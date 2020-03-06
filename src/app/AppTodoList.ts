import { Todo } from 'src/core/Todo';
import { Observable, Subject, Subscription } from 'src/utils/Observable';
import { TodoFactory, TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';
import { HistoryControl, HistoryState } from './HistoryState';
import { TodoListApi } from './TodoListApi';

export class AppTodoList implements TodoList {
  private readonly todoFactory = new TodoFactory();
  private readonly history: HistoryState<TodoParams[]> = new HistoryState([]);

  private changesSubject: Subject = new Subject();
  readonly changes: Observable = this.changesSubject.asObservable();

  private state: TodoList = new TodoListImp();
  private stateSubscription: Subscription = this.state.changes.subscribe(() =>
    this.onTodoListChanges(),
  );
  private historySubscription = this.history.switched.subscribe(() => this.onHistorySwitched());

  constructor(private api: TodoListApi) {}

  private onTodoListChanges(): void {
    const params = this.state.getItems().map((todo) => this.todoFactory.serializeTodo(todo));
    this.history.setState(params);
    this.api.save(params).catch(() => {});
    this.changesSubject.next({});
  }

  private onHistorySwitched(): void {
    const params = this.history.getState();
    this.updateState(params);
    this.api.save(params).catch(() => {});
  }

  private updateState(todoParamsList: TodoParams[]): void {
    const todoList = new TodoListImp(todoParamsList);
    this.state = todoList;
    this.stateSubscription.unsubscribe();
    this.stateSubscription = this.state.changes.subscribe(() => this.onTodoListChanges());
    this.changesSubject.next({});
  }

  async resolve(): Promise<void> {
    const todoParamsList = await this.api.getItems();
    this.history.reset(todoParamsList);
    this.updateState(todoParamsList);
  }

  destroy(): void {
    this.stateSubscription.unsubscribe();
    this.historySubscription.unsubscribe();
  }

  getHistory(): HistoryControl<TodoParams[]> {
    return this.history;
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
}
