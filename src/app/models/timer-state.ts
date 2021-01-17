export interface TimerState {
    value: TimeValue;
    isTicking: boolean;
}

export interface TimeValue {
    minutes: number;
    seconds: number;
}
export interface OutputTimeValue {
    minutes: string;
    seconds: string;
}