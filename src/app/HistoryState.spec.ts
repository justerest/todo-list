import { HistoryState } from './HistoryState';

describe('HistoryState', () => {
  let history: HistoryState;

  beforeEach(() => {
    history = new HistoryState([]);
  });

  it('+getState() should returns TodoParams[]', () => {
    expect(history.getState()).toEqual([]);
  });

  it('+addState() should rewrite current state', () => {
    const newState = [{}];
    history.addState(newState);
    expect(history.getState()).toBe(newState);
  });

  it('+hasPrev() should returns false on init', () => {
    expect(history.hasPrev()).toBe(false);
  });

  it('+hasPrev() should returns true after setState()', () => {
    history.addState([]);
    expect(history.hasPrev()).toBe(true);
  });

  it('+switchToPrev() should switch on prev state', () => {
    const prevState = [{}];
    history.addState(prevState);
    history.addState([]);
    history.switchToPrev();
    expect(history.getState()).toBe(prevState);
  });

  it('+hasPrev() should returns false after switch to first', () => {
    history.addState([]);
    history.switchToPrev();
    expect(history.hasPrev()).toBe(false);
  });

  it('+hasNext() should returns false on init', () => {
    expect(history.hasNext()).toBe(false);
  });

  it('+hasNext() should returns true after switchToPrev()', () => {
    history.addState([]);
    history.switchToPrev();
    expect(history.hasNext()).toBe(true);
  });

  it('+switchToNext() should switch on next state', () => {
    const prevState = [{}];
    history.addState([]);
    history.addState(prevState);
    history.switchToPrev();
    history.switchToNext();
    expect(history.getState()).toBe(prevState);
  });

  it('+hasNext() should returns false after switchToNext()', () => {
    history.addState([]);
    history.switchToPrev();
    history.switchToNext();
    expect(history.hasNext()).toBe(false);
  });

  it('+hasNext() should returns false after setState()', () => {
    history.addState([]);
    history.switchToPrev();
    history.addState([]);
    expect(history.hasNext()).toBe(false);
  });

  it('+switchToPrev() should switch on prev state after setState()', () => {
    const prevState = [{}];
    history.addState(prevState);
    history.addState([]);
    history.switchToPrev();
    history.addState([]);
    history.switchToPrev();
    expect(history.getState()).toBe(prevState);
  });

  it('+reset() should reset history and apply initial state', () => {
    history.addState([]);
    expect(history.hasPrev()).toBe(true);
    const initState = [{}];
    history.reset(initState);
    expect(history.hasPrev()).toBe(false);
    expect(history.getState()).toBe(initState);
  });
});
