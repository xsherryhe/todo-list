import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { renderEditableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('todoItem'), showTodoItemView);

export default function showTodoItemView(_, data) {
  const todoItem = renderData.todoItemsList.withId(data.id);
  const showButton = document.querySelector(`.show-todoItem[data-todo-item-id="${data.id}"]`),
        hideButton = document.querySelector(`.hide-todoItem[data-todo-item-id="${data.id}"]`),
        todoItemElement = document.querySelector(`.todo-item[data-id="${data.id}"]`),
        editProjectButton = document.createElement('button'),
        priorityElement = document.createElement('div'),
        decrementPriorityButton = document.createElement('button'),
        incrementPriorityButton = document.createElement('button');

  renderEditableAttribute(todoItem, 'description', 'textarea', { parentElement: todoItemElement, elementText: 'Description: ' });
  renderEditableAttribute(todoItem, 'notes', 'textarea', { parentElement: todoItemElement, elementText: 'Notes: ' });

  [editProjectButton, decrementPriorityButton, incrementPriorityButton].forEach(element => {
    element.dataset.type = todoItem.type;
    element.dataset.id = todoItem.id;
  })
  editProjectButton.classList.add('edit-belong');
  editProjectButton.dataset.belongType = 'project';
  editProjectButton.dataset.belongId = todoItem.belongs.project;
  editProjectButton.textContent = 'Change Project';

  priorityElement.textContent = `Priority: ${todoItem.priority}`;
  [decrementPriorityButton, incrementPriorityButton].forEach(button => button.classList.add('update-priority'));
  decrementPriorityButton.dataset.direction = -1;
  decrementPriorityButton.textContent = 'v';
  incrementPriorityButton.dataset.direction = 1;
  incrementPriorityButton.textContent = '^';
  priorityElement.append(decrementPriorityButton, incrementPriorityButton);

  showButton.classList.add('hidden');
  hideButton.classList.remove('hidden');
  todoItemElement.append(editProjectButton, priorityElement);
  _renderChecklistItems(todoItem);

  PubSub.publish(SHOW_RENDERED('todoItem'));
}

function _renderChecklistItems(todoItem) { 
}
