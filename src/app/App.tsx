import React, { useEffect, useState } from 'react';

import { TodoType } from 'src/core/TodoFactory';
import { Observable, Subscription } from 'src/utils/Observable';
import { TodoList } from '../core/TodoList';
import { AppTodoList } from './AppTodoList';
import { TodoRenderer } from './todo-components/TodoRenderer';
import { TodoListApiImp } from './TodoListApi';
import { TodoListApiProxy } from './TodoListApiProxy';
import { HistoryControl } from './TodoListHistory';

export class App extends React.Component {
  private subscriptions: Subscription[] = [];

  readonly todoListApiProxy = new TodoListApiProxy(new TodoListApiImp());
  readonly todoList = new AppTodoList(this.todoListApiProxy);

  render(): any {
    return (
      <React.Fragment>
        <header>
          <h1>Todo List App</h1>
        </header>
        <main>
          <TodoListCmp todoList={this.todoList}></TodoListCmp>
          <AddTodoCmp todoList={this.todoList}></AddTodoCmp>
          <AddFixedTodoCmp todoList={this.todoList}></AddFixedTodoCmp>
          <AddEditableTodoCmp todoList={this.todoList}></AddEditableTodoCmp>
          <HistoryControlCmp historyControl={this.todoList.getHistory()}></HistoryControlCmp>
        </main>
        <footer>
          <SavingStatusCmp todoListApiProxy={this.todoListApiProxy}></SavingStatusCmp>
        </footer>
      </React.Fragment>
    );
  }

  componentDidMount(): void {
    this.subscriptions.push(this.todoList.changes.subscribe(() => this.forceUpdate()));
    this.todoList.resolve();
  }

  componentWillUnmount(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.todoList.destroy();
  }
}

export const TodoListCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => {
  const todoRenderer = new TodoRenderer();
  return (
    <div>
      <h2>What to do?</h2>
      <ul>
        {todoList.getUncompletedItems().map((todo) => (
          <React.Fragment key={todo.id}>{todo.render(todoRenderer)}</React.Fragment>
        ))}
        {todoList.getCompletedItems().map((todo) => (
          <React.Fragment key={todo.id}>{todo.render(todoRenderer)}</React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export const AddTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => (
  <button onClick={() => todoList.add({ title: `Todo ${todoList.getItems().length}` })}>
    Add Todo
  </button>
);

export const AddFixedTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => (
  <button
    onClick={() =>
      todoList.add({
        title: `Fixed Todo ${todoList.getItems().length}`,
        type: TodoType.Fixed,
      })
    }
  >
    Add Fixed Todo
  </button>
);

export const AddEditableTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => (
  <button
    onClick={() =>
      todoList.add({
        title: `Editable Todo ${todoList.getItems().length}`,
        type: TodoType.Editable,
      })
    }
  >
    Add Editable Todo
  </button>
);

export const SavingStatusCmp: React.FC<{
  todoListApiProxy: TodoListApiProxy;
}> = ({ todoListApiProxy }) => {
  const saving = useObservable(todoListApiProxy.saving);
  const error = useObservable(todoListApiProxy.error);
  return <p>{error ? 'Error 🔴' : saving ? 'Saving 🟡' : 'Saved 🟢'}</p>;
};

export const HistoryControlCmp: React.FC<{
  historyControl: HistoryControl;
}> = ({ historyControl }) => {
  useObservable(historyControl.changes);
  return (
    <p>
      <button disabled={!historyControl.hasPrev()} onClick={() => historyControl.switchToPrev()}>
        ↪️
      </button>
      &nbsp;
      <button disabled={!historyControl.hasNext()} onClick={() => historyControl.switchToNext()}>
        ↩️
      </button>
    </p>
  );
};

function useObservable<T>(observable: Observable<T>): T | undefined {
  const [result, update] = useState(undefined as T | undefined);
  useEffect(() => {
    const subscription = observable.subscribe((value) => update(value));
    return () => subscription.unsubscribe();
  }, [0]);
  return result;
}
