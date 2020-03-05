import { Observable, Subject, Subscription } from 'src/utils/Observable';
import { Todo } from '../core/Todo';
import { TodoFactory, TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';
import { TodoListApi } from './TodoListApi';
import { TodoListHistory } from './TodoListHistory';

export class AppTodoList implements TodoList {
  private todoFactory = new TodoFactory();
  private changesSubject = new Subject();

  readonly history: TodoListHistory = new TodoListHistory();
  readonly changes: Observable = this.changesSubject.asObservable();

  private state: TodoList = new TodoListImp();
  private subscription: Subscription = this.state.changes.subscribe(() => this.onStateChanges());
  private historySubscription = this.history.changes.subscribe(() => this.onHistoryChanges());

  constructor(private api: TodoListApi) {}

  private onStateChanges(): void {
    this.changesSubject.next({});
    const params = this.state.getItems().map((todo) => this.todoFactory.serializeTodo(todo));
    this.history.setState(params);
    this.api.save(params).catch(() => {});
  }

  private onHistoryChanges(): void {
    const params = this.history.getState();
    this.updateState(params);
    this.api.save(params).catch(() => {});
  }

  private updateState(todoParamsList: TodoParams[]): void {
    const todoList = new TodoListImp(todoParamsList);
    this.state = todoList;
    this.subscription.unsubscribe();
    this.subscription = this.state.changes.subscribe(() => this.onStateChanges());
    this.changesSubject.next({});
  }

  async resolve(): Promise<void> {
    const todoParamsList = await this.api.getItems();
    this.history.reset(todoParamsList);
    this.updateState(todoParamsList);
  }

  destroy(): void {
    this.subscription.unsubscribe();
    this.historySubscription.unsubscribe();
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
