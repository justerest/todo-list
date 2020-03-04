import React from 'react';

import { Todo } from 'src/core/Todo';

export const FixedTodoCmp: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li style={{ cursor: 'not-allowed' }} onClick={() => todo.toggleCompletion()}>
    {todo.getTitle()}
  </li>
);
