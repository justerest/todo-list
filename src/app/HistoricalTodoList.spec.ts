import { SubjectTests } from 'src/utils/Observable';
import { HistoricalTodoList } from './HistoricalTodoList';

describe('HistoricalTodoList', () => {
  let todoList: HistoricalTodoList;

  beforeEach(() => {
    todoList = new HistoricalTodoList();
  });

  beforeAll(() => {
    SubjectTests.useSyncResolver();
  });

  it('+add() should emit changes', () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('+todo.onChange() should emit changes', () => {
    todoList.add({ title: '' });
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    expect(spy).toHaveBeenCalled();
  });

  it('+undo() should change todoList state on prev', () => {
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(1);
    todoList.undo();
    expect(todoList.getItems()).toHaveLength(0);
  });

  it('+add() should emit changes after +undo()', () => {
    todoList.add({ title: '' });
    todoList.undo();
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('+redo() should switch on next state', () => {
    todoList.add({ title: '' });
    todoList.undo();
    todoList.redo();
    expect(todoList.getItems().length).toBe(1);
  });

  it('+canUndo() should returns false on init', () => {
    expect(todoList.canUndo()).toBe(false);
  });

  it('+canRedo() should returns false on init', () => {
    expect(todoList.canRedo()).toBe(false);
  });

  it('+add() should add Todo', () => {
    const initTodoCount = todoList.getItems().length;
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(initTodoCount + 1);
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(initTodoCount + 2);
  });
});
