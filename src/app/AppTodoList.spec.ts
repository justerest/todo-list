import { delay } from 'src/utils/delay';
import { TodoType } from '../core/TodoFactory';
import { AppTodoList, TodoListApi } from './AppTodoList';

describe('AppTodoList', () => {
  let todoList: AppTodoList;

  beforeEach(() => {
    todoList = new AppTodoList({
      getItems: async () => [{ type: TodoType.Simple, title: 'Loaded todo', completed: false }],
      save: () => delay(),
    } as TodoListApi);
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
    todoList.add({ title: 'title' });
    await delay(1);
    expect(spy).toHaveBeenCalled();
  });

  it('+add() should emit changes after resolve()', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    await todoList.resolve();
    todoList.add({ title: 'title' });
    await delay(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('+todo.onChange should emit changes', async () => {
    await todoList.resolve();
    await delay(1);
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    const [todo] = todoList.getItems();
    todo.toggleCompletion();
    await delay(1);
    expect(spy).toHaveBeenCalled();
  });
});
