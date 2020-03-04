import { Todo } from './Todo';

export class TodoList {
  private items: Todo[] = [];

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
  }
}
