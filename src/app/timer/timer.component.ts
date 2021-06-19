import { Component, OnInit } from '@angular/core';
import { interval, merge, NEVER, Observable, Subject } from 'rxjs';
import { map, mapTo, pluck, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { Modes, OutputTimeValue, TimerState, TimeValue, TimeValues } from '../models/timer-state';

const SECONDS_IN_A_MINUTE = 60;
const SECOND_TO_MILLISECONDS = 1000;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  // create observable from the button click
  startButtonClicked$ = new Subject();
  pauseButtonClicked$ = new Subject();
  resetButtonClicked$ = new Subject();
  changeTimerMode$ = new Subject<Modes>();

  Modes = Modes;

  timer$: Observable<TimerState>;
  displayTimer$: Observable<OutputTimeValue>;

  // events
  events$: Observable<any>;

  constructor() { }

  ngOnInit(): void {

    this.events$ = merge(
      this.startButtonClicked$.pipe(mapTo({ isTicking: true })),
      this.pauseButtonClicked$.pipe(mapTo({ isTicking: false })),
      this.resetButtonClicked$.pipe(mapTo({ value: { minutes: 0, seconds: 0 } })),
      this.changeTimerMode$.pipe(map<Modes, TimerState>((mode: Modes) => {
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
      }))
    )

    // create the timer with the initial state
    this.timer$ = this.events$.pipe(
      startWith({ isTicking: false, value: { minutes: TimeValues.Pomodoro.minutes, seconds: TimeValues.Pomodoro.seconds } }),
      scan((state: TimerState, curr): TimerState => ({ ...state, ...curr }), {}),
      /* tap(console.log), */
      // create the actual timer by switching from base
      switchMap((state: TimerState) =>
        state.isTicking ? interval(1000).pipe(
          map(tick => this.updateTimerStateOnTick(state)),
          tap((_state: TimerState) => state.value = _state.value),
        ) : NEVER),
    )

    this.displayTimer$ = this.timer$.pipe(
      startWith({ isTicking: false, value: { minutes: TimeValues.Pomodoro.minutes, seconds: TimeValues.Pomodoro.seconds } }),
      pluck('value'),
      map(((value: TimeValue) => ({ minutes: this.padNumber(value.minutes), seconds: this.padNumber(value.seconds) })))
    )
  }

  private padNumber(num: number) {
    return String(num).padStart(2, '0');
  }

  private updateTimerStateOnTick(currentState: TimerState): TimerState {
    const { value: { minutes, seconds } } = currentState;

    // Find a better way to reset
    if (minutes === 0 && seconds === 0) {
      const _value = ({ minutes: 0, seconds: 0 });
      return ({ ...currentState, value: _value })
    }
    const totalSeconds = minutes * 60 + seconds;
    const currentValue = totalSeconds - 1;

    const _minutes = Math.floor(currentValue / SECONDS_IN_A_MINUTE);
    const _seconds = (currentValue % SECONDS_IN_A_MINUTE);

    const value = ({ minutes: _minutes, seconds: _seconds });
    return ({ ...currentState, value })
  }

}
