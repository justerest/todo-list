import React from 'react';

import { EditableTodo } from 'src/core/EditableTodo';

export class EditableTodoCmp extends React.Component<{ todo: EditableTodo }> {
  state = { isEditableMode: false };

  render(): any {
    const { todo } = this.props;
    const { isEditableMode } = this.state;
    return (
      <li
        style={{ textDecoration: todo.isCompleted() ? 'line-through' : '', cursor: 'pointer' }}
        onClick={() => !isEditableMode && todo.toggleCompletion()}
      >
        {isEditableMode ? (
          <input
            defaultValue={todo.getTitle()}
            type='text'
            onBlur={(e) => this.changeTitle(e.target.value)}
          />
        ) : (
          <React.Fragment>
            <span>{todo.getTitle()}</span>&nbsp;
            {!todo.isCompleted() ? (
              <span onClick={(event) => this.enableEditableMode(event)}>✎</span>
            ) : null}
          </React.Fragment>
        )}
      </li>
    );
  }

  changeTitle(title: string): void {
    this.props.todo.changeTitle(title);
    this.setState({ isEditableMode: false });
  }

  enableEditableMode(event: React.MouseEvent<HTMLSpanElement>): void {
    event.stopPropagation();
    this.setState({ isEditableMode: true });
  }
}
