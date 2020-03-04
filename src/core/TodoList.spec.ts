import { delay } from 'src/utils/delay';
import { TodoList } from './TodoList';

describe('TodoList', () => {
  let todoList: TodoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  it('+getItems() should returns Todo[]', () => {
    expect(todoList.getItems()).toEqual([]);
  });

  it('+add() should create item and add to collection', () => {
    todoList.add('Write tests');
    expect(todoList.getItems()).toHaveLength(1);
  });

  it('+add() should create item with the description', () => {
    const description = 'Write tests';
    todoList.add(description);
    const [item] = todoList.getItems();
    expect(item.getTitle()).toBe(description);
  });

  it('+getCompletedItems() should not returns uncompleted Todo[]', () => {
    const description = 'Write tests';
    todoList.add(description);
    expect(todoList.getCompletedItems()).toEqual([]);
  });

  it('+getCompletedItems() should returns completed Todo[]', () => {
    const description = 'Write tests';
    todoList.add(description);
    const [item] = todoList.getItems();
    item.toggleCompletion();
    expect(todoList.getCompletedItems()).toEqual([item]);
  });

  it('+getUncompletedItems() should returns uncompleted Todo[]', () => {
    const description = 'Write tests';
    todoList.add(description);
    const [item] = todoList.getItems();
    expect(todoList.getUncompletedItems()).toEqual([item]);
  });

  it('+getUncompletedItems() should not returns completed Todo[]', () => {
    const description = 'Write tests';
    todoList.add(description);
    const [item] = todoList.getItems();
    item.toggleCompletion();
    expect(todoList.getUncompletedItems()).toEqual([]);
  });

  it('+add() should emit changes', async () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add('description');
    await delay();
    expect(spy).toHaveBeenCalled();
  });
});
