import { Todo } from './Todo';

describe('Todo', () => {
  let todo: Todo;

  beforeEach(() => {
    todo = new Todo('description');
  });

  it('+getItems() should returns Todo[]', () => {
    expect(todo.getTitle()).toBe('description');
  });

  it('+isCompleted() should returns completion flag', () => {
    expect(todo.isCompleted()).toBe(false);
  });

  it('+toggleCompletion() should invert completion flag', () => {
    todo.toggleCompletion();
    expect(todo.isCompleted()).toBe(true);
  });
});
