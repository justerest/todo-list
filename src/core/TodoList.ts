import { Observable, Subject } from 'src/utils/Observable';
import { EditableTodo } from './EditableTodo';
import { FixedTodo } from './FixedTodo';
import { Todo } from './Todo';

export interface TodoList {
  readonly changes: Observable;
  getItems(): Todo[];
  getCompletedItems(): Todo[];
  getUncompletedItems(): Todo[];
  add(description: string): void;
  addFixedTodo(description: string): void;
  addEditableTodo(description: string): void;
}

export class TodoListImp implements TodoList {
  private items: Todo[];
  private changesSubject = new Subject();

  readonly changes: Observable = this.changesSubject.asObservable();

  constructor(items: Todo[] = []) {
    this.items = items;
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

  add(description: string): void {
    this.items.push(new Todo(description, () => this.changesSubject.next({})));
    this.changesSubject.next({});
  }

  addFixedTodo(description: string): void {
    this.items.push(new FixedTodo(description));
    this.changesSubject.next({});
  }

  addEditableTodo(description: string): void {
    this.items.push(new EditableTodo(description, () => this.changesSubject.next({})));
    this.changesSubject.next({});
  }
}
