import { Observable, Subject } from 'src/utils/Observable';
import { Todo } from '../core/Todo';
import { TodoParams } from '../core/TodoFactory';
import { TodoList, TodoListImp } from '../core/TodoList';

export interface TodoListApi {
  getItems(): Promise<TodoParams[]>;
  save(todoList: TodoList): Promise<void>;
}

export class AppTodoList implements TodoList {
  private changesSubject = new Subject();
  private state: TodoList = new TodoListImp();

  changes: Observable = this.changesSubject.asObservable();

  constructor(private api: TodoListApi) {}

  async resolve(): Promise<void> {
    const todoItems = await this.api.getItems();
    this.state = new TodoListImp(todoItems);
    this.changesSubject.next({});
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

  add(description: string): void {
    this.api.save(this.state).then(() => {
      this.state.add(description);
      this.changesSubject.next({});
    });
  }

  addFixedTodo(description: string): void {
    this.api.save(this.state).then(() => {
      this.state.addFixedTodo(description);
      this.changesSubject.next({});
    });
  }

  addEditableTodo(description: string): void {
    this.api.save(this.state).then(() => {
      this.state.addEditableTodo(description);
      this.changesSubject.next({});
    });
  }
}
