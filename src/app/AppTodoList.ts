import { delay } from 'src/utils/delay';
import { Observable } from 'src/utils/Observable';
import { Todo } from '../core/Todo';
import { TodoList, TodoListImp } from '../core/TodoList';

export class AppTodoList implements TodoList {
  private todoList: TodoList = new TodoListImp();

  changes: Observable = this.todoList.changes;

  constructor() {}

  getItems(): Todo[] {
    return this.todoList.getItems();
  }

  getCompletedItems(): Todo[] {
    return this.todoList.getCompletedItems();
  }

  getUncompletedItems(): Todo[] {
    return this.todoList.getUncompletedItems();
  }

  add(description: string): void {
    apiRequest().then(() => this.todoList.add(description));
  }

  addFixedTodo(description: string): void {
    apiRequest().then(() => this.todoList.addFixedTodo(description));
  }

  addEditableTodo(description: string): void {
    apiRequest().then(() => this.todoList.addEditableTodo(description));
  }
}

async function apiRequest(): Promise<void> {
  await delay(500);
}
