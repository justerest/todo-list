import { TodoRenderer } from '../app/todo-components/TodoRenderer';
import { generateId } from '../utils/generateId';

export class Todo {
  id: string = generateId();

  constructor(
    protected title: string,
    private completed: boolean = false,
    protected onChange?: (todo: Todo) => void,
  ) {}

  getTitle(): string {
    return this.title;
  }

  isCompleted(): boolean {
    return this.completed;
  }

  toggleCompletion(): void {
    this.completed = !this.completed;
    this.onChange?.(this);
  }

  render(renderer: TodoRenderer): any {
    return renderer.renderSimpleTodo(this);
  }
}
