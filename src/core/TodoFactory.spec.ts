import { Todo } from './Todo';
import { TodoFactory, TodoType } from './TodoFactory';

describe('TodoFactory', () => {
  let todoFactory: TodoFactory;

  beforeEach(() => {
    todoFactory = new TodoFactory();
  });

  it('+createTodo() should returns Todo', () => {
    expect(todoFactory.createTodo({ title: '' })).toBeInstanceOf(Todo);
  });

  it('+serializeTodo(+createTodo()) should returns equal Todo', () => {
    const todo = todoFactory.createTodo({ title: '' });
    todo.toggleCompletion();
    const params = todoFactory.serializeTodo(todo);
    expect(todoFactory.createTodo(params)).toEqual(todo);
  });

  it('+serializeTodo(+createTodo()) should returns equal EditableTodo', () => {
    const todo = todoFactory.createTodo({ title: '', type: TodoType.Editable });
    todo.toggleCompletion();
    const params = todoFactory.serializeTodo(todo);
    expect(todoFactory.createTodo(params)).toEqual(todo);
  });
});
