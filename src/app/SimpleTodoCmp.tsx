import React from 'react';

import { Todo } from 'src/core/Todo';

export const SimpleTodoCmp: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li
    style={{ textDecoration: todo.isCompleted() ? 'line-through' : '', cursor: 'pointer' }}
    onClick={() => todo.toggleCompletion()}
  >
    {todo.getTitle()}
  </li>
);
