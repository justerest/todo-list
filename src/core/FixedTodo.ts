import { TodoRenderer } from 'src/app/todo-components/TodoRenderer';
import { override } from 'src/utils/metric-decorators';
import { Todo } from './Todo';

export class FixedTodo extends Todo {
  @override
  toggleCompletion(): void {}

  @override
  render(renderer: TodoRenderer): any {
    return renderer.renderFixedTodo(this);
  }
}
