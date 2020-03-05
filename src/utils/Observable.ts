export interface Observable<T = unknown> {
  subscribe(onNext: (value: T) => void): Subscription;
}

export interface Subscription {
  unsubscribe(): void;
}

export class Subject<T = unknown> implements Observable<T> {
  protected static resolve(): PromiseLike {
    return Promise.resolve();
  }

  protected callbackSet: Set<(value: T) => void> = new Set();

  asObservable(): Observable<T> {
    return this;
  }

  subscribe(onNext: (value: T) => void): Subscription {
    this.callbackSet.add(onNext);
    return { unsubscribe: () => this.callbackSet.delete(onNext) };
  }

  next(value: T): void {
    Subject.resolve().then(() => this.callbackSet.forEach((onNext) => onNext(value)));
  }
}

interface PromiseLike {
  then(callback: () => void): any;
}

export class SubjectTests extends Subject {
  /** Make Subject.next() sync */
  static useSyncResolver(): void {
    Subject.resolve = () => ({ then: (callback) => callback() });
  }

  private constructor() {
    super();
  }
}
