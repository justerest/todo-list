import { generateId } from '../utils/generateId';

export class Todo {
  private completed: boolean = false;

  id: string = generateId();

  constructor(protected title: string, protected onChange?: (todo: Todo) => void) {}

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
}
