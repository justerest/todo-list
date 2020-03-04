import { Observable, Subject, Subscription } from 'src/utils/Observable';
import { Todo } from '../core/Todo';
import { TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';

export interface TodoListApi {
  getItems(): Promise<TodoParams[]>;
  save(todoList: TodoList): Promise<void>;
}

export class AppTodoList implements TodoList {
  private changesSubject = new Subject();

  changes: Observable = this.changesSubject.asObservable();

  private state: TodoList = new TodoListImp();
  private subscription: Subscription = this.state.changes.subscribe(() =>
    this.changesSubject.next({}),
  );

  constructor(private api: TodoListApi) {}

  async resolve(): Promise<void> {
    const todoParamsList = await this.api.getItems();
    this.state = new TodoListImp(todoParamsList);
    this.subscription.unsubscribe();
    this.subscription = this.state.changes.subscribe(() => this.changesSubject.next({}));
    this.changesSubject.next({});
  }

  destroy(): void {
    this.subscription.unsubscribe();
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
    this.api.save(this.state).then(() => this.state.add(todoParams));
  }
}
