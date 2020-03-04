import { Todo } from './Todo';

export class EditableTodo extends Todo {
  changeTitle(title: string): void {
    this.title = title;
    this.onChange?.(this);
  }
}
