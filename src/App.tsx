import React from 'react';

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
        {todoList.getItems().map((todo) => (
          <li key={todo.getTitle()}>{todo.getTitle()}</li>
        ))}
      </ul>
    </div>
  );
};

export const AddTodoCmp: React.FC<{ todoList: TodoList }> = ({ todoList }) => {
  return <button onClick={() => todoList.add(`Todo ${todoList.getItems().length}`)}>Add</button>;
};
