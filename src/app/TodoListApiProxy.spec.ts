import { delay } from 'src/utils/delay';
import { TodoListApi } from './TodoListApi';
import { TodoListApiProxy } from './TodoListApiProxy';

describe('TodoListApiProxy', () => {
  let service: TodoListApiProxy;
  let api: TodoListApi;

  beforeEach(() => {
    api = { getItems: async () => [], save: () => delay(2) };
    service = new TodoListApiProxy(api);
  });

  it('+save() should emit saving true on start', async () => {
    const spy = jasmine.createSpy();
    service.saving.subscribe(spy);
    service.save([]);
    await delay();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('+save() should emit saving false on end', async () => {
    const spy = jasmine.createSpy();
    service.saving.subscribe(spy);
    await service.save([]);
    await delay();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('+save() should emit saving false on error', async () => {
    api.save = () => delay(2).then(() => Promise.reject());
    const spy = jasmine.createSpy();
    service.saving.subscribe(spy);
    await service.save([]).catch(() => {});
    await delay();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('+save() should emit error true on error', async () => {
    api.save = () => delay(2).then(() => Promise.reject());
    const spy = jasmine.createSpy();
    service.error.subscribe(spy);
    await service.save([]).catch(() => {});
    await delay();
    expect(spy).toHaveBeenLastCalledWith(true);
  });

  it('+save() should emit error false on start', async () => {
    const spy = jasmine.createSpy();
    service.error.subscribe(spy);
    service.save([]);
    await delay();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
