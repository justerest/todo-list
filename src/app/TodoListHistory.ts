import { TodoParams } from 'src/core/TodoFactory';
import { Observable, Subject } from 'src/utils/Observable';

export interface HistoryControl<T extends object = {}> {
  changes: Observable;
  hasPrev(): boolean;
  hasNext(): boolean;
  getState(): T;
  switchToPrev(): void;
  switchToNext(): void;
}

export class TodoListHistory implements HistoryControl<TodoParams[]> {
  private changesSubject = new Subject();
  private switchedSubject = new Subject();
  private history: TodoParams[][] = [this.state];

  changes: Observable = this.changesSubject.asObservable();
  switched: Observable = this.switchedSubject.asObservable();

  constructor(private state: TodoParams[] = []) {}

  reset(state: TodoParams[]): void {
    this.state = state;
    this.history = [this.state];
  }

  getState(): TodoParams[] {
    return this.state;
  }

  setState(state: TodoParams[]): void {
    this.deleteHistoryAfterCurrentState();
    this.state = state;
    this.changesSubject.next({});
    this.history.push(state);
  }

  private nextState(state: TodoParams[]): void {
    this.state = state;
    this.changesSubject.next({});
    this.switchedSubject.next({});
  }

  private deleteHistoryAfterCurrentState(): void {
    this.history = this.history.slice(0, this.getCurrentStateIndex() + 1);
  }

  hasPrev(): boolean {
    return this.getCurrentStateIndex() > 0;
  }

  hasNext(): boolean {
    return this.getCurrentStateIndex() < this.history.length - 1;
  }

  switchToPrev(): void {
    const prevStateIndex = Math.max(this.getCurrentStateIndex() - 1, 0);
    this.nextState(this.history[prevStateIndex]);
  }

  switchToNext(): void {
    const nextStateIndex = Math.min(this.getCurrentStateIndex() + 1, this.history.length - 1);
    this.nextState(this.history[nextStateIndex]);
  }

  private getCurrentStateIndex(): number {
    return this.history.indexOf(this.state);
  }
}
