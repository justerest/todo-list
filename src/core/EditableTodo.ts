import { TodoRenderer } from 'src/app/todo-components/TodoRenderer';
import { Todo } from './Todo';

export class EditableTodo extends Todo {
  changeTitle(title: string): void {
    this.title = title;
    this.onChange?.(this);
  }

  render(renderer: TodoRenderer): any {
    return renderer.renderEditableTodo(this);
  }
}
