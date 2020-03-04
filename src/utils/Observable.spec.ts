import { delay } from './delay';
import { Observable, Subject } from './Observable';

describe('Observable', () => {
  let subject: Subject<any>;
  let observable: Observable<any>;

  beforeEach(() => {
    subject = new Subject();
    observable = subject.asObservable();
  });

  it('should call callback on next value', async () => {
    const spy = jasmine.createSpy();
    observable.subscribe(spy);
    subject.next({});
    await delay();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call callback on next value if unsubscribed', async () => {
    const spy = jasmine.createSpy();
    const subscription = observable.subscribe(spy);
    subscription.unsubscribe();
    subject.next({});
    await delay();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should send to callback subject.next value', async () => {
    const spy = jasmine.createSpy();
    observable.subscribe(spy);
    const sendingValue = {};
    subject.next(sendingValue);
    await delay();
    expect(spy.calls.first().args[0]).toBe(sendingValue);
  });
});
