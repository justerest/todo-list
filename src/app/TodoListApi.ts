import { TodoParams, TodoType } from 'src/core/TodoFactory';
import { delay } from 'src/utils/delay';

export interface TodoListApi {
  getItems(): Promise<TodoParams[]>;
  save(todoParamsList: TodoParams[]): Promise<void>;
}

export class TodoListApiImp implements TodoListApi {
  async getItems(): Promise<TodoParams[]> {
    await delay(1000);
    return [
      { title: 'Initial created Todo', type: TodoType.Simple },
      { title: 'Initial created Fixed Todo', type: TodoType.Fixed },
      { title: 'Initial created Editable Todo', type: TodoType.Editable },
    ];
  }

  async save(): Promise<void> {
    await delay(500);
    if (Math.random() < 0.25) {
      throw new Error('Saving failed');
    }
  }
}
