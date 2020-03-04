import { FixedTodo } from './FixedTodo';

describe('FixedTodo', () => {
  let fixedTodo: FixedTodo;

  beforeEach(() => {
    fixedTodo = new FixedTodo('description');
  });

  it('+getItems() should returns FixedTodo[]', () => {
    expect(fixedTodo.getTitle()).toBe('description');
  });

  it('+isCompleted() should returns false', () => {
    expect(fixedTodo.isCompleted()).toBe(false);
  });

  it('+toggleCompletion() should not invert completion flag', () => {
    fixedTodo.toggleCompletion();
    expect(fixedTodo.isCompleted()).toBe(false);
  });
});
