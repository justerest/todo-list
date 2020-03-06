import { Observable, Subject } from 'src/utils/Observable';

export interface HistoryControl<T extends object = {}> {
  changes: Observable;
  hasPrev(): boolean;
  hasNext(): boolean;
  getState(): T;
  switchToPrev(): void;
  switchToNext(): void;
}

export class HistoryState<T extends object = {}> implements HistoryControl<T> {
  private changesSubject: Subject = new Subject();
  private switchedSubject: Subject = new Subject();

  changes: Observable = this.changesSubject.asObservable();
  switched: Observable = this.switchedSubject.asObservable();

  private history: T[] = [this.state];

  constructor(private state: T) {}

  getState(): T {
    return this.state;
  }

  hasPrev(): boolean {
    return this.getCurrentStateIndex() > 0;
  }

  hasNext(): boolean {
    return this.getCurrentStateIndex() < this.history.length - 1;
  }

  setState(state: T): void {
    this.deleteHistoryAfterCurrentState();
    this.state = state;
    this.changesSubject.next({});
    this.history.push(state);
  }

  private deleteHistoryAfterCurrentState(): void {
    this.history = this.history.slice(0, this.getCurrentStateIndex() + 1);
  }

  reset(state: T): void {
    this.state = state;
    this.history = [this.state];
    this.changesSubject.next({});
  }

  switchToPrev(): void {
    const prevStateIndex = Math.max(this.getCurrentStateIndex() - 1, 0);
    this.switchState(this.history[prevStateIndex]);
  }

  private switchState(state: T): void {
    this.state = state;
    this.changesSubject.next({});
    this.switchedSubject.next({});
  }

  switchToNext(): void {
    const nextStateIndex = Math.min(this.getCurrentStateIndex() + 1, this.history.length - 1);
    this.switchState(this.history[nextStateIndex]);
  }

  private getCurrentStateIndex(): number {
    return this.history.indexOf(this.state);
  }
}
