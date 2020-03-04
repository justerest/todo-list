import React from 'react';

import { TodoParams, TodoType } from 'src/core/TodoFactory';
import { delay } from 'src/utils/delay';
import { TodoList } from '../core/TodoList';
import { AppTodoList } from './AppTodoList';
import { TodoRenderer } from './TodoRenderer';

export class App extends React.Component {
  todoList: AppTodoList = this.createTodoList();

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
        </main>
      </React.Fragment>
    );
  }

  componentDidMount(): void {
    this.todoList.changes.subscribe(() => this.forceUpdate());
    this.todoList.resolve();
  }

  private createTodoList(): AppTodoList {
    const todoParams: TodoParams[] = [
      { title: 'Initial created Todo', type: TodoType.Simple },
      { title: 'Initial created Fixed Todo', type: TodoType.Fixed },
      { title: 'Initial created Editable Todo', type: TodoType.Editable },
    ];
    return new AppTodoList({
      getItems: async () => {
        await delay(1000);
        return todoParams;
      },
      save: () => delay(500),
    });
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
