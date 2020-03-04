import { Observable, Subject } from 'src/utils/Observable';
import { Todo } from './Todo';

export class TodoList {
  private items: Todo[] = [];
  private changesSubject = new Subject();

  readonly changes: Observable = this.changesSubject.asObservable();

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
    this.items.push(new Todo(description));
    this.changesSubject.next({});
  }
}