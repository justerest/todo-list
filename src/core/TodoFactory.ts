import { EditableTodo } from 'src/core/EditableTodo';
import { FixedTodo } from 'src/core/FixedTodo';
import { Todo } from './Todo';

export enum TodoType {
  Simple = 'simple',
  Fixed = 'fixed',
  Editable = 'editable',
}

export interface TodoParams {
  title: string;
  type?: TodoType;
  completed?: boolean;
}

export class TodoFactory {
  createTodo(todoParams: TodoParams, onChange?: () => void): Todo {
    switch (todoParams.type) {
      case TodoType.Fixed: {
        return new FixedTodo(todoParams.title, onChange);
      }
      case TodoType.Editable: {
        return new EditableTodo(todoParams.title, onChange);
      }
      default: {
        return new Todo(todoParams.title, onChange);
      }
    }
  }

  serializeTodo(todo: Todo): TodoParams {
    return {
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
