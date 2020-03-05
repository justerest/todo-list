import { EditableTodo } from './EditableTodo';

describe('EditableTodo', () => {
  let editableTodo: EditableTodo;

  beforeEach(() => {
    editableTodo = new EditableTodo('description');
  });

  it('+changeTitle() should change title', () => {
    const newTitle = 'new title';
    editableTodo.changeTitle(newTitle);
    expect(editableTodo.getTitle()).toBe(newTitle);
  });

  it('+changeTitle() should emit changes', () => {
    const spy = jasmine.createSpy();
    editableTodo = new EditableTodo('description', false, spy);
    editableTodo.changeTitle('new title');
    expect(spy).toHaveBeenCalled();
  });
});
