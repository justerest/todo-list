import React from 'react';

import { EditableTodo } from 'src/core/EditableTodo';
import { Todo } from 'src/core/Todo';
import { EditableTodoCmp } from './EditableTodoCmp';
import { FixedTodoCmp } from './FixedTodoCmp';
import { SimpleTodoCmp } from './SimpleTodoCmp';

export class TodoRenderer {
  renderSimpleTodo(todo: Todo): any {
    return <SimpleTodoCmp todo={todo}></SimpleTodoCmp>;
  }

  renderFixedTodo(todo: Todo): any {
    return <FixedTodoCmp todo={todo}></FixedTodoCmp>;
  }

  renderEditableTodo(todo: EditableTodo): any {
    return <EditableTodoCmp todo={todo}></EditableTodoCmp>;
  }
}
