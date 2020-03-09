import { Todo } from 'src/core/Todo';
import { Observable, Subject, Subscription } from 'src/utils/Observable';
import { TodoFactory, TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';
import { HistoryControl, HistoryState } from './HistoryState';

export class HistoricalTodoList implements TodoList, HistoryControl {
  protected readonly todoFactory = new TodoFactory();
  protected readonly history = new HistoryState<TodoParams[]>([]);

  private changesSubject: Subject = new Subject();
  readonly changes: Observable = this.changesSubject.asObservable();

  private state: TodoList = new TodoListImp();
  private stateSubscription: Subscription = this.state.changes.subscribe(() =>
    this.onStateChanged(this.getSerializedState()),
  );

  constructor() {}

  protected onStateChanged(params: TodoParams[]): void {
    this.history.addState(params);
    this.changesSubject.next({});
  }

  protected onHistorySwitched(): void {
    this.updateState(this.history.getState());
  }

  protected updateState(todoParamsList: TodoParams[]): void {
    this.state = new TodoListImp(todoParamsList);
    this.updateStateSubscription();
    this.changesSubject.next({});
  }

  private updateStateSubscription(): void {
    this.stateSubscription.unsubscribe();
    this.stateSubscription = this.state.changes.subscribe(() =>
      this.onStateChanged(this.getSerializedState()),
    );
  }

  private getSerializedState(): TodoParams[] {
    return this.state.getItems().map((todo) => this.todoFactory.serializeTodo(todo));
  }

  destroy(): void {
    this.stateSubscription.unsubscribe();
  }

  getItems(): Todo[] {
    return this.state.getItems();
  }

  getCompletedItems(): Todo[] {
    return this.state.getCompletedItems();
  }

  getUncompletedItems(): Todo[] {
    return this.state.getUncompletedItems();
  }

  add(todoParams: TodoParams): void {
    this.state.add(todoParams);
  }

  canUndo(): boolean {
    return this.history.hasPrev();
  }

  canRedo(): boolean {
    return this.history.hasNext();
  }

  undo(): void {
    this.history.switchToPrev();
    this.onHistorySwitched();
  }

  redo(): void {
    this.history.switchToNext();
    this.onHistorySwitched();
  }
}
