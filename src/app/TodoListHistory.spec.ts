import { TodoParams } from 'src/core/TodoFactory';
import { delay } from 'src/utils/delay';
import { TodoListHistory } from './TodoListHistory';

describe('TodoListHistory', () => {
  let history: TodoListHistory;

  beforeEach(() => {
    history = new TodoListHistory();
  });

  it('+getState() should returns TodoParams[]', () => {
    expect(history.getState()).toEqual([]);
  });

  it('+setState() should rewrite current state', () => {
    const newState = [{ title: '' }] as TodoParams[];
    history.setState(newState);
    expect(history.getState()).toBe(newState);
  });

  it('+hasPrev() should returns false on init', () => {
    expect(history.hasPrev()).toBe(false);
  });

  it('+hasPrev() should returns true after setState()', () => {
    history.setState([]);
    expect(history.hasPrev()).toBe(true);
  });

  it('+switchToPrev() should switch on prev state', () => {
    const prevState = [{ title: '' }] as TodoParams[];
    history.setState(prevState);
    history.setState([]);
    history.switchToPrev();
    expect(history.getState()).toBe(prevState);
  });

  it('+hasPrev() should returns false after switch to first', () => {
    history.setState([]);
    history.switchToPrev();
    expect(history.hasPrev()).toBe(false);
  });

  it('+hasNext() should returns false on init', () => {
    expect(history.hasNext()).toBe(false);
  });

  it('+hasNext() should returns true after switchToPrev()', () => {
    history.setState([]);
    history.switchToPrev();
    expect(history.hasNext()).toBe(true);
  });

  it('+switchToNext() should switch on next state', () => {
    const prevState = [{ title: '' }] as TodoParams[];
    history.setState([]);
    history.setState(prevState);
    history.switchToPrev();
    history.switchToNext();
    expect(history.getState()).toBe(prevState);
  });

  it('+hasNext() should returns false after switchToNext()', () => {
    history.setState([]);
    history.switchToPrev();
    history.switchToNext();
    expect(history.hasNext()).toBe(false);
  });

  it('+hasNext() should returns false after setState()', () => {
    history.setState([]);
    history.switchToPrev();
    history.setState([]);
    expect(history.hasNext()).toBe(false);
  });

  it('+switchToPrev() should switch on prev state after setState()', () => {
    const prevState = [{ title: '' }] as TodoParams[];
    history.setState(prevState);
    history.setState([]);
    history.switchToPrev();
    history.setState([]);
    history.switchToPrev();
    expect(history.getState()).toBe(prevState);
  });

  it('+setState() should emit changes', async () => {
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.setState([]);
    await delay();
    expect(spy).toHaveBeenCalled();
  });

  it('+switchToPrev() should emit changes', async () => {
    history.setState([]);
    await delay();
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.switchToPrev();
    await delay();
    expect(spy).toHaveBeenCalled();
  });

  it('+switchToPrev() should emit changes', async () => {
    history.setState([]);
    history.switchToPrev();
    await delay();
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.switchToNext();
    await delay();
    expect(spy).toHaveBeenCalled();
  });

  it('+reset() should reset history and apply initial state', async () => {
    history.setState([]);
    expect(history.hasPrev()).toBe(true);
    const initState = [{ title: '' }] as TodoParams[];
    history.reset(initState);
    expect(history.hasPrev()).toBe(false);
    expect(history.getState()).toBe(initState);
  });
});
