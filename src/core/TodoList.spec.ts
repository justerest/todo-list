import { SubjectTests } from 'src/utils/Observable';
import { TodoList, TodoListImp } from './TodoList';

describe('TodoList', () => {
  let todoList: TodoList;

  beforeAll(() => {
    SubjectTests.useSyncResolver();
  });

  beforeEach(() => {
    todoList = new TodoListImp();
  });

  it('+getItems() should returns Todo[]', () => {
    expect(todoList.getItems()).toEqual([]);
  });

  it('+add() should create item and add to collection', () => {
    todoList.add({ title: 'title' });
    expect(todoList.getItems()).toHaveLength(1);
  });

  it('+add() should create item with the description', () => {
    const title = 'Write tests';
    todoList.add({ title });
    const [item] = todoList.getItems();
    expect(item.getTitle()).toBe(title);
  });

  it('+getCompletedItems() should not returns uncompleted Todo[]', () => {
    todoList.add({ title: 'title' });
    expect(todoList.getCompletedItems()).toEqual([]);
  });

  it('+getCompletedItems() should returns completed Todo[]', () => {
    todoList.add({ title: 'title' });
    const [item] = todoList.getItems();
    item.toggleCompletion();
    expect(todoList.getCompletedItems()).toEqual([item]);
  });

  it('+getUncompletedItems() should returns uncompleted Todo[]', () => {
    todoList.add({ title: 'title' });
    const [item] = todoList.getItems();
    expect(todoList.getUncompletedItems()).toEqual([item]);
  });

  it('+getUncompletedItems() should not returns completed Todo[]', () => {
    todoList.add({ title: 'title' });
    const [item] = todoList.getItems();
    item.toggleCompletion();
    expect(todoList.getUncompletedItems()).toEqual([]);
  });

  it('+add() should emit changes', () => {
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    todoList.add({ title: 'description' });
    expect(spy).toHaveBeenCalled();
  });

  it('+todo.toggleCompletion() should emit changes', () => {
    todoList.add({ title: 'title' });
    const spy = jasmine.createSpy();
    todoList.changes.subscribe(spy);
    const [item] = todoList.getItems();
    item.toggleCompletion();
    expect(spy).toHaveBeenCalled();
  });
});
