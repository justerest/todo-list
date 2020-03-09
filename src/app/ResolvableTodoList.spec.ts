import { delay } from 'src/utils/delay';
import { SubjectTests } from 'src/utils/Observable';
import { TodoType } from '../core/TodoFactory';
import { ResolvableTodoList } from './ResolvableTodoList';

describe('ResolvableTodoList', () => {
  let todoList: ResolvableTodoList;

  beforeEach(() => {
    todoList = new ResolvableTodoList({
      getItems: async () => [{ type: TodoType.Simple, title: 'Loaded todo', completed: false }],
      save: () => delay(),
    });
  });

  beforeAll(() => {
    SubjectTests.useSyncResolver();
  });

  it('+resolve() should load saved todo items', async () => {
    await todoList.resolve();
    expect(todoList.getItems().length).toBeGreaterThan(0);
  });

  it('+resolve() should emit changes', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    await todoList.resolve();
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should emit changes', () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should emit changes after resolve()', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    await todoList.resolve();
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalledTimes(2);
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('+todo.onChange() should emit changes', async () => {
    await todoList.resolve();
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should call TodoListApi.save', () => {
    const spy = jasmine.createSpy();
    todoList = new ResolvableTodoList({ getItems: async () => [], save: async () => spy() });
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('+todo.onChange() should call TodoListApi.save', async () => {
    const spy = jasmine.createSpy();
    todoList = new ResolvableTodoList({
      getItems: async () => [{ title: '' }],
      save: async () => spy(),
    });
    await todoList.resolve();
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should prevent changes on save error', async () => {
    const api = { getItems: async () => [], save: () => Promise.resolve() };
    api.save = jasmine.createSpy().and.returnValue(Promise.reject('Mock saving failed'));
    todoList = new ResolvableTodoList(api);
    todoList.add({ title: '' });
    expect(api.save).toHaveBeenCalled();
    await delay();
    expect(todoList.getItems()).toHaveLength(0);
  });

  it('+undo() should change todoList state on prev', () => {
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(1);
    todoList.undo();
    expect(todoList.getItems()).toHaveLength(0);
  });

  it('+undo() should change todoList state on prev after resolve()', async () => {
    await todoList.resolve();
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(2);
    todoList.undo();
    expect(todoList.getItems()).toHaveLength(1);
  });

  it('+add() should emit changes after history.switchToPrev()', () => {
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

  it('+canUndo() should returns false after resolve', async () => {
    await todoList.resolve();
    expect(todoList.canUndo()).toBe(false);
  });

  it('+canRedo() should returns false after resolve', async () => {
    await todoList.resolve();
    expect(todoList.canRedo()).toBe(false);
  });

  it('+add() should add Todo after resolve()', async () => {
    await todoList.resolve();
    const initTodoCount = todoList.getItems().length;
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(initTodoCount + 1);
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(initTodoCount + 2);
  });
});
