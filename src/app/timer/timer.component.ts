import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, merge, NEVER, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, mapTo, pluck, scan, skip, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Purpose } from '../button/button.component';
import { Modes, OutputTimeValue, TimerState, TimeValue, TimeValues } from '../models/timer-state';

const SECONDS_IN_A_MINUTE = 60;
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {



  // Commands
  startButtonClicked$ = new Subject();
  pauseButtonClicked$ = new Subject();
  resetButtonClicked$ = new Subject();

  // events
  events$: Observable<any>;

  currentMode = new BehaviorSubject(Modes.Pomodoro);
  currentMode$ = this.currentMode.asObservable().pipe(
    map<Modes, TimerState>((mode: Modes) => this.getTimerForMode(mode)))

  Modes = Modes;
  Purpose = Purpose;

  timer$: Observable<TimerState>;
  displayTimer$: Observable<OutputTimeValue>;
  timerState$ = new BehaviorSubject(null);

  private destroyed$ = new ReplaySubject();

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    // Map the commands to the delta needed in the store
    this.events$ = merge(
      this.startButtonClicked$.pipe(mapTo({ isTicking: true })),

      this.pauseButtonClicked$.pipe(mapTo({ isTicking: false })),

      this.resetButtonClicked$.pipe(map(() => {
        const value = this.getTimerForMode(this.currentMode.value)
        return ({ ...value, isTicking: false })
      })),

      this.currentMode$.pipe(
        skip(1),
        tap(() => this.startButtonClicked$.next())
      )
    )

    // Reducer
    this.timer$ = this.events$.pipe(
      startWith({ isTicking: false, value: { minutes: TimeValues.Pomodoro.minutes, seconds: TimeValues.Pomodoro.seconds } }),
      scan((state: TimerState, curr): TimerState => ({ ...state, ...curr }), {}),
      tap(state => this.setTimerState(state)),
      switchMap((state: TimerState) =>
        state.isTicking ? interval(1000).pipe(
          map(tick => this.updateTimerStateOnTick(state)),
          tap((_state: TimerState) => {
            state.value = _state.value;
            this.setTimerState(state);
          })
        ) : NEVER)
    )

    // Selector
    this.displayTimer$ = this.timerState$.pipe(
      pluck('value'),
      map(((value: TimeValue) => ({ minutes: this.padNumber(value.minutes), seconds: this.padNumber(value.seconds) })))
    )

    // Init
    this.timer$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  private padNumber(number: number) {
    return String(number).padStart(2, '0');
  }

  private updateTimerStateOnTick(currentState: TimerState): TimerState {
    const { value: { minutes, seconds } } = currentState;

    // Find a better way to reset
    if (minutes === 0 && seconds === 0) {
      const _value = ({ minutes: 0, seconds: 0 });
      return ({ ...currentState, value: _value, isTicking: false })
    }
    const totalSeconds = minutes * 60 + seconds;
    const currentValue = totalSeconds - 1;

    const _minutes = Math.floor(currentValue / SECONDS_IN_A_MINUTE);
    const _seconds = (currentValue % SECONDS_IN_A_MINUTE);

    const value = ({ minutes: _minutes, seconds: _seconds });
    return ({ ...currentState, value })
  }

  private setTimerState(state: TimerState) {
    this.timerState$.next(state);
    this.cdr.detectChanges();
  }

  private getTimerForMode(mode: Modes) {
    let value: TimeValue;
    switch (mode) {
      case Modes.Pomodoro:
        value = { minutes: TimeValues.Pomodoro.minutes, seconds: TimeValues.Pomodoro.seconds }
        break;
      case Modes.ShortBreak:
        value = { minutes: TimeValues.ShortBreak.minutes, seconds: TimeValues.ShortBreak.seconds }
        break;
      case Modes.LongBreak:
        value = { minutes: TimeValues.LongBreak.minutes, seconds: TimeValues.LongBreak.seconds }
        break;
      default:
        value = { minutes: TimeValues.Pomodoro.minutes, seconds: TimeValues.Pomodoro.seconds }
        break;
    }
    return ({ value });
  }

  setMode(mode: Modes) {
    this.currentMode.next(mode);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
