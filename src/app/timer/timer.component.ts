import { Component, OnInit } from '@angular/core';
import { merge, NEVER, Observable, of, Subject, timer } from 'rxjs';
import { map, mapTo, scan, startWith, switchMap } from 'rxjs/operators';
import { TimerState, TimeValue } from '../models/timer-state';

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


  timer$: Observable<TimeValue>;

  //events
  events$: Observable<any>;


  constructor() { }

  ngOnInit(): void {

    this.events$ = merge(
      this.startButtonClicked$.pipe(mapTo({ isTicking: true })),
      this.pauseButtonClicked$.pipe(mapTo({ isTicking: false })),
      this.resetButtonClicked$.pipe(mapTo({ value: { minutes: 0, seconds: 0 } })),
    )

    //create the timer with the initial state
    this.timer$ = this.events$.pipe(
      startWith({ isTicking: false, value: { minutes: 10, seconds: 0 } }),
      scan((state: TimerState, curr): TimerState => ({ ...state, ...curr }), {}),
      // create the actual timer by switching from base
      switchMap((state: TimerState) =>
        state.isTicking ? timer(0, 1000).pipe(map(timer => {
          const { minutes, seconds } = state.value;
          const totalSeconds = minutes * 60 + seconds;
          const currentValue = totalSeconds - timer;
          
          return ({ minutes: currentValue, seconds: 0 })
        })) : NEVER)
    )
  }

}
