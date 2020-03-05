import { EditableTodo } from 'src/core/EditableTodo';
import { FixedTodo } from 'src/core/FixedTodo';
import { Todo } from './Todo';

export enum TodoType {
  Simple = 'simple',
  Fixed = 'fixed',
  Editable = 'editable',
}

export interface TodoParams {
  id?: string;
  title: string;
  type?: TodoType;
  completed?: boolean;
}

export class TodoFactory {
  createTodo(todoParams: TodoParams, onChange?: () => void): Todo {
    const todo = this.build(todoParams, onChange);
    todo.id = todoParams.id ?? this.generateId();
    return todo;
  }

  private build(todoParams: TodoParams, onChange?: () => void): Todo {
    switch (todoParams.type) {
      case TodoType.Fixed: {
        return new FixedTodo(todoParams.title, todoParams.completed);
      }
      case TodoType.Editable: {
        return new EditableTodo(todoParams.title, todoParams.completed, onChange);
      }
      default: {
        return new Todo(todoParams.title, todoParams.completed, onChange);
      }
    }
  }

  private generateId(): string {
    return `${Math.random()}`.slice(2);
  }

  serializeTodo(todo: Todo): TodoParams {
    return {
      id: todo.id,
      title: todo.getTitle(),
      completed: todo.isCompleted(),
      type:
        todo instanceof FixedTodo
          ? TodoType.Fixed
          : todo instanceof EditableTodo
          ? TodoType.Editable
          : TodoType.Simple,
    };
  }
}
