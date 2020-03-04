import React from 'react';

import { TodoList } from '../core/TodoList';
import { TodoRenderer } from './TodoRenderer';

export class App extends React.Component {
  todoList: TodoList = this.createTodoList();

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
  }

  private createTodoList(): TodoList {
    const todoList = new TodoList();
    todoList.add('Initial created Todo');
    todoList.addFixedTodo('Initial created Fixed Todo');
    todoList.addEditableTodo('Initial created Editable Todo');
    return todoList;
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
  <button onClick={() => todoList.add(`Todo ${todoList.getItems().length}`)}>Add Todo</button>
);

export const AddFixedTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => (
  <button onClick={() => todoList.addFixedTodo(`Fixed Todo ${todoList.getItems().length}`)}>
    Add Fixed Todo
  </button>
);

export const AddEditableTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => (
  <button onClick={() => todoList.addEditableTodo(`Editable Todo ${todoList.getItems().length}`)}>
    Add Editable Todo
  </button>
);
