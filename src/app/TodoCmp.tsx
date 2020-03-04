import React from 'react';

import { FixedTodo } from 'src/core/FixedTodo';
import { Todo } from 'src/core/Todo';

export const TodoCmp: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li
    style={{
      textDecoration: todo.isCompleted() ? 'line-through' : '',
      cursor: todo instanceof FixedTodo ? 'not-allowed' : 'pointer',
    }}
    onClick={() => todo.toggleCompletion()}
  >
    {todo.getTitle()}
  </li>
);
