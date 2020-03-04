import { generateId } from '../utils/generateId';

export class Todo {
  private completed: boolean = false;

  id: string = generateId();

  constructor(private description: string) {}

  getTitle(): string {
    return this.description;
  }

  isCompleted(): boolean {
    return this.completed;
  }

  toggleCompletion(): void {
    this.completed = !this.completed;
  }
}
