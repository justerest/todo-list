import { TodoParams } from 'src/core/TodoFactory';
import { HistoricalTodoList } from './HistoricalTodoList';
import { TodoListApi } from './TodoListApi';

export class ResolvableTodoList extends HistoricalTodoList {
  constructor(private api: TodoListApi) {
    super();
  }

  async resolve(): Promise<void> {
    const todoParamsList = await this.api.getItems();
    this.history.reset(todoParamsList);
    this.updateState(todoParamsList);
  }

  protected onStateChanged(params: TodoParams[]): void {
    super.onStateChanged(params);
    this.api.save(params).catch(() => this.undo());
  }

  protected onHistorySwitched(): void {
    super.onHistorySwitched();
    this.api.save(this.history.getState()).catch(() => {});
  }
}
