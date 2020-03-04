import React from 'react';

import { Todo } from './core/Todo';
import { TodoList } from './core/TodoList';

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
    return todoList;
  }
}

export const TodoListCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => {
  return (
    <div>
      <h2>What to do?</h2>
      <ul>
        {todoList.getUncompletedItems().map((todo) => (
          <TodoCmp key={todo.id} todo={todo}></TodoCmp>
        ))}
        {todoList.getCompletedItems().map((todo) => (
          <TodoCmp key={todo.id} todo={todo}></TodoCmp>
        ))}
      </ul>
    </div>
  );
};

export const TodoCmp: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li
    style={{ textDecoration: todo.isCompleted() ? 'line-through' : '' }}
    onClick={() => todo.toggleCompletion()}
  >
    {todo.getTitle()}
  </li>
);

export const AddTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => {
  return <button onClick={() => todoList.add(`Todo ${todoList.getItems().length}`)}>Add</button>;
};
