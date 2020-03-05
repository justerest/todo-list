import { TodoParams } from 'src/core/TodoFactory';
import { Observable, Subject } from 'src/utils/Observable';
import { TodoListApi } from './TodoListApi';

export class TodoListApiProxy implements TodoListApi {
  private savingSubject = new Subject<boolean>();
  private errorSubject = new Subject<boolean>();

  saving: Observable<boolean> = this.savingSubject.asObservable();
  error: Observable<boolean> = this.errorSubject.asObservable();

  constructor(private api: TodoListApi) {}

  getItems(): Promise<TodoParams[]> {
    return this.api.getItems();
  }

  async save(todoParamsList: TodoParams[]): Promise<void> {
    this.savingSubject.next(true);
    this.errorSubject.next(false);
    try {
      await this.api.save(todoParamsList);
    } catch (error) {
      this.errorSubject.next(true);
      throw error;
    } finally {
      this.savingSubject.next(false);
    }
  }
}
