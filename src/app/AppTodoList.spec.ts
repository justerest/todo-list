import { delay } from 'src/utils/delay';
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

  it('+resolve() should load saved todo items', async () => {
    await todoList.resolve();
    expect(todoList.getItems().length).toBeGreaterThan(0);
  });

  it('+resolve() should emit changes', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    await todoList.resolve();
    await delay(1);
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should emit changes', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add({ title: '' });
    await delay(1);
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should emit changes after resolve()', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    await todoList.resolve();
    todoList.add({ title: '' });
    await delay(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('+todo.onChange() should emit changes', async () => {
    await todoList.resolve();
    await delay(1);
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    await delay(1);
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should call TodoListApi.save', async () => {
    const spy = jasmine.createSpy();
    todoList = new AppTodoList({ getItems: async () => [], save: async () => spy() });
    todoList.add({ title: '' });
    await delay();
    expect(spy).toHaveBeenCalled();
  });

  it('+todo.onChange() should call TodoListApi.save', async () => {
    const spy = jasmine.createSpy();
    todoList = new AppTodoList({ getItems: async () => [{ title: '' }], save: async () => spy() });
    await todoList.resolve();
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    await delay();
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should save todoList state on success and rollback to it on error', async () => {
    const api = { getItems: async () => [], save: () => Promise.resolve() };
    todoList = new AppTodoList(api);
    todoList.add({ title: '1' });
    await delay(1);
    const savedData = JSON.stringify(todoList.getItems());
    api.save = () => Promise.reject('Mock saving failed');
    todoList.add({ title: '2' });
    expect(todoList.getItems()).toHaveLength(2);
    await delay(1);
    expect(JSON.stringify(todoList.getItems())).toBe(savedData);
  });
});
