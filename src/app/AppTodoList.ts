import { Observable, Subject, Subscription } from 'src/utils/Observable';
import { Todo } from '../core/Todo';
import { TodoFactory, TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';
import { TodoListApi } from './TodoListApi';

export class AppTodoList implements TodoList {
  private todoFactory = new TodoFactory();
  private changesSubject = new Subject();

  readonly changes: Observable = this.changesSubject.asObservable();

  private state: TodoList = new TodoListImp();
  private subscription: Subscription = this.state.changes.subscribe(() => this.onStateChanges());
  private synchronizedTodoParamsList: TodoParams[] = [];

  constructor(private api: TodoListApi) {}

  async resolve(): Promise<void> {
    const todoParamsList = await this.api.getItems();
    this.updateState(todoParamsList);
  }

  private updateState(todoParamsList: TodoParams[]): void {
    const todoList = new TodoListImp(todoParamsList);
    this.state = todoList;
    this.subscription.unsubscribe();
    this.subscription = todoList.changes.subscribe(() => this.onStateChanges());
    this.synchronizedTodoParamsList = todoParamsList;
    this.changesSubject.next({});
  }

  private async onStateChanges(): Promise<void> {
    this.changesSubject.next({});
    try {
      const params = this.state.getItems().map((todo) => this.todoFactory.serializeTodo(todo));
      await this.api.save(params);
      this.synchronizedTodoParamsList = params;
    } catch {
      this.updateState(this.synchronizedTodoParamsList);
    }
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
    this.state.add(todoParams);
  }
}
