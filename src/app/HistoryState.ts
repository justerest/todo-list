import { Observable } from 'src/utils/Observable';

export interface HistoryControl {
  changes: Observable;
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
}

export class HistoryState<T extends object = {}> {
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

  addState(state: T): void {
    this.deleteHistoryAfterCurrentState();
    this.state = state;
    this.history.push(state);
  }

  private deleteHistoryAfterCurrentState(): void {
    this.history = this.history.slice(0, this.getCurrentStateIndex() + 1);
  }

  reset(state: T): void {
    this.state = state;
    this.history = [this.state];
  }

  switchToPrev(): void {
    const prevStateIndex = Math.max(this.getCurrentStateIndex() - 1, 0);
    this.state = this.history[prevStateIndex];
  }

  switchToNext(): void {
    const nextStateIndex = Math.min(this.getCurrentStateIndex() + 1, this.history.length - 1);
    this.state = this.history[nextStateIndex];
  }

  private getCurrentStateIndex(): number {
    return this.history.indexOf(this.state);
  }
}
