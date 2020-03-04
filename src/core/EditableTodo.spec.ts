import { delay } from 'src/utils/delay';
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

  it('+changeTitle() should emit changes', async () => {
    const spy = jasmine.createSpy();
    editableTodo = new EditableTodo('description', spy);
    editableTodo.changeTitle('new title');
    await delay();
    expect(spy).toHaveBeenCalled();
  });
});
