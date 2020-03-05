import { delay } from 'src/utils/delay';
import { SubjectTests } from 'src/utils/Observable';
import { TodoListApi } from './TodoListApi';
import { TodoListApiProxy } from './TodoListApiProxy';

describe('TodoListApiProxy', () => {
  let service: TodoListApiProxy;
  let api: TodoListApi;

  beforeEach(() => {
    api = { getItems: async () => [], save: () => delay() };
    service = new TodoListApiProxy(api);
  });

  beforeAll(() => {
    SubjectTests.useSyncResolver();
  });

  it('+save() should emit saving true on start', () => {
    const spy = jasmine.createSpy();
    service.saving.subscribe(spy);
    service.save([]);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('+save() should emit saving false on end', async () => {
    const spy = jasmine.createSpy();
    service.saving.subscribe(spy);
    await service.save([]);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('+save() should emit saving false on error', async () => {
    api.save = () => delay().then(() => Promise.reject());
    const spy = jasmine.createSpy();
    service.saving.subscribe(spy);
    await service.save([]).catch(() => {});
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('+save() should emit error true on error', async () => {
    api.save = () => delay().then(() => Promise.reject());
    const spy = jasmine.createSpy();
    service.error.subscribe(spy);
    await service.save([]).catch(() => {});
    expect(spy).toHaveBeenLastCalledWith(true);
  });

  it('+save() should emit error false on start', () => {
    const spy = jasmine.createSpy();
    service.error.subscribe(spy);
    service.save([]);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
