import { override } from 'src/utils/metric-decorators';
import { Todo } from './Todo';

export class FixedTodo extends Todo {
  @override
  toggleCompletion(): void {}
}
