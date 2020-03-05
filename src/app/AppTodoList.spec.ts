import { delay } from 'src/utils/delay';
import { SubjectTests } from 'src/utils/Observable';
import { TodoType } from '../core/TodoFactory';
import { AppTodoList } from './AppTodoList';

describe('AppTodoList', () => {
  let todoList: AppTodoList;

  beforeEach(() => {
    todoList = new AppTodoList({
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
    todoList = new AppTodoList({ getItems: async () => [], save: async () => spy() });
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('+todo.onChange() should call TodoListApi.save', async () => {
    const spy = jasmine.createSpy();
    todoList = new AppTodoList({ getItems: async () => [{ title: '' }], save: async () => spy() });
    await todoList.resolve();
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should ignore error on save', () => {
    const api = { getItems: async () => [], save: () => Promise.resolve() };
    todoList = new AppTodoList(api);
    todoList.add({ title: '1' });
    api.save = jasmine.createSpy().and.returnValue(Promise.reject('Mock saving failed'));
    todoList.add({ title: '2' });
    expect(todoList.getItems()).toHaveLength(2);
    expect(api.save).toHaveBeenCalled();
    expect(todoList.getItems()).toHaveLength(2);
  });

  it('+resolve() should provide current todoList state to history', async () => {
    expect(todoList.getItems()).toHaveLength(0);
    expect(todoList.getHistory().getState()).toHaveLength(0);
    await todoList.resolve();
    expect(todoList.getItems()).toHaveLength(1);
    expect(todoList.getHistory().getState()).toHaveLength(1);
  });

  it('+add() should provide current todoList state to history', () => {
    expect(todoList.getItems()).toHaveLength(0);
    expect(todoList.getHistory().getState()).toHaveLength(0);
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(1);
    expect(todoList.getHistory().getState()).toHaveLength(1);
  });

  it('+history.switchToPrev() should change todoList state on prev', () => {
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(1);
    expect(todoList.getHistory().getState()).toHaveLength(1);
    todoList.getHistory().switchToPrev();
    expect(todoList.getHistory().getState()).toHaveLength(0);
    expect(todoList.getItems()).toHaveLength(0);
  });

  it('+history.switchToPrev() should change todoList state on prev after resolve()', async () => {
    await todoList.resolve();
    todoList.add({ title: '' });
    expect(todoList.getItems()).toHaveLength(2);
    expect(todoList.getHistory().getState()).toHaveLength(2);
    todoList.getHistory().switchToPrev();
    expect(todoList.getHistory().getState()).toHaveLength(1);
    expect(todoList.getItems()).toHaveLength(1);
  });

  it('+add() should emit changes after history.switchToPrev()', () => {
    todoList.add({ title: '' });
    todoList.getHistory().switchToPrev();
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add({ title: '' });
    expect(spy).toHaveBeenCalled();
  });
});
