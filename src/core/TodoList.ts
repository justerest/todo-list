import { Observable, Subject } from 'src/utils/Observable';
import { Todo } from './Todo';
import { TodoFactory, TodoParams } from './TodoFactory';

export interface TodoList {
  readonly changes: Observable;
  getItems(): Todo[];
  getCompletedItems(): Todo[];
  getUncompletedItems(): Todo[];
  add(todoParams: TodoParams): void;
}

export class TodoListImp implements TodoList {
  private items: Todo[];
  private changesSubject = new Subject();
  private todoFactory = new TodoFactory();

  readonly changes: Observable = this.changesSubject.asObservable();

  constructor(todoParamsList: TodoParams[] = []) {
    this.items = todoParamsList.map((todoParams) => this.createTodo(todoParams));
  }

  getItems(): Todo[] {
    return this.items;
  }

  getCompletedItems(): Todo[] {
    return this.items.filter((todo) => todo.isCompleted());
  }

  getUncompletedItems(): Todo[] {
    return this.items.filter((todo) => !todo.isCompleted());
  }

  add(todoParams: TodoParams): void {
    const todo = this.createTodo(todoParams);
    this.items.push(todo);
    this.changesSubject.next({});
  }

  private createTodo(todoParams: TodoParams): Todo {
    return this.todoFactory.createTodo(todoParams, () => this.changesSubject.next({}));
  }
}
