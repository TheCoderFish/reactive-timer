export interface TimerState {
    value: TimeValue;
    isTicking?: boolean;
    mode?: Modes
}

export enum Modes {
    Pomodoro = 'Pomodoro',
    ShortBreak = 'ShortBreak',
    LongBreak = 'LongBreak'
}

export const TimeValues: { [key in keyof typeof Modes]: TimeValue } = {
    [Modes.Pomodoro]: { minutes: 40, seconds: 0 },
    [Modes.LongBreak]: { minutes: 10, seconds: 0 },
    [Modes.ShortBreak]: { minutes: 5, seconds: 0 }
}

export interface TimeValue {
    minutes: number;
    seconds: number;
}
export interface OutputTimeValue {
    minutes: string;
    seconds: string;
}