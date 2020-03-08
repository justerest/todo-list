import { Todo } from 'src/core/Todo';
import { Observable, Subject, Subscription } from 'src/utils/Observable';
import { TodoFactory, TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';
import { HistoryControl, HistoryState } from './HistoryState';
import { TodoListApi } from './TodoListApi';

export class AppTodoList implements TodoList, HistoryControl {
  private readonly todoFactory = new TodoFactory();
  private readonly history: HistoryState<TodoParams[]> = new HistoryState([]);

  private changesSubject: Subject = new Subject();
  readonly changes: Observable = this.changesSubject.asObservable();

  private state: TodoList = new TodoListImp();
  private stateSubscription: Subscription = this.state.changes.subscribe(() =>
    this.onTodoListChanges(),
  );

  constructor(private api: TodoListApi) {}

  private onTodoListChanges(): void {
    const params = this.state.getItems().map((todo) => this.todoFactory.serializeTodo(todo));
    this.history.addState(params);
    this.api.save(params).catch(() => {});
    this.changesSubject.next({});
  }

  private onHistorySwitched(): void {
    const params = this.history.getState();
    this.updateState(params);
    this.api.save(params).catch(() => {});
  }

  private updateState(todoParamsList: TodoParams[]): void {
    this.state = new TodoListImp(todoParamsList);
    this.updateStateSubscription();
    this.changesSubject.next({});
  }

  private updateStateSubscription(): void {
    this.stateSubscription.unsubscribe();
    this.stateSubscription = this.state.changes.subscribe(() => this.onTodoListChanges());
  }

  async resolve(): Promise<void> {
    const todoParamsList = await this.api.getItems();
    this.history.reset(todoParamsList);
    this.updateState(todoParamsList);
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
