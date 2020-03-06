import { SubjectTests } from 'src/utils/Observable';
import { HistoryState } from './HistoryState';

describe('HistoryState', () => {
  let history: HistoryState;

  beforeEach(() => {
    history = new HistoryState([]);
  });

  beforeAll(() => {
    SubjectTests.useSyncResolver();
  });

  it('+getState() should returns TodoParams[]', () => {
    expect(history.getState()).toEqual([]);
  });

  it('+setState() should rewrite current state', () => {
    const newState = [{}];
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
    const prevState = [{}];
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
    const prevState = [{}];
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
    const prevState = [{}];
    history.setState(prevState);
    history.setState([]);
    history.switchToPrev();
    history.setState([]);
    history.switchToPrev();
    expect(history.getState()).toBe(prevState);
  });

  it('+setState() should emit changes', () => {
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.setState([]);
    expect(spy).toHaveBeenCalled();
  });

  it('+switchToPrev() should emit changes', () => {
    history.setState([]);
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.switchToPrev();
    expect(spy).toHaveBeenCalled();
  });

  it('+switchToPrev() should emit changes', () => {
    history.setState([]);
    history.switchToPrev();
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.switchToNext();
    expect(spy).toHaveBeenCalled();
  });

  it('+setState() should not emit switched', () => {
    const spy = jasmine.createSpy();
    history.switched.subscribe(spy);
    history.setState([]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('+switchToPrev() should emit switched', () => {
    history.setState([]);
    const spy = jasmine.createSpy();
    history.switched.subscribe(spy);
    history.switchToPrev();
    expect(spy).toHaveBeenCalled();
  });

  it('+switchToPrev() should emit switched', () => {
    history.setState([]);
    history.switchToPrev();
    const spy = jasmine.createSpy();
    history.switched.subscribe(spy);
    history.switchToNext();
    expect(spy).toHaveBeenCalled();
  });

  it('+reset() should reset history and apply initial state', () => {
    history.setState([]);
    expect(history.hasPrev()).toBe(true);
    const initState = [{}];
    history.reset(initState);
    expect(history.hasPrev()).toBe(false);
    expect(history.getState()).toBe(initState);
  });

  it('+reset() should emit changes', () => {
    const spy = jasmine.createSpy();
    history.changes.subscribe(spy);
    history.reset([]);
    expect(spy).toHaveBeenCalled();
  });
});
