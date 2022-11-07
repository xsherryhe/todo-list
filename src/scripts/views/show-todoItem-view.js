import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderEditableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('todoItem'), showTodoItemView);

export default function showTodoItemView(_, data) {
  const todoItem = renderData.todoItemsList.withId(data.id);
  const showButton = document.querySelector(`.show-todoItem[data-todo-item-id="${data.id}"]`),
        hideButton = document.querySelector(`.hide-todoItem[data-todo-item-id="${data.id}"]`),
        todoItemElement = document.querySelector(`.todo-item[data-id="${data.id}"]`),
        editProjectButton = document.createElement('button'),
        updateStatusButton = document.createElement('button'),
        priorityElement = document.createElement('div');

  renderEditableAttribute(todoItem, 'description', 'textarea', { parentElement: todoItemElement, elementText: 'Description: ' });
  renderEditableAttribute(todoItem, 'notes', 'textarea', { parentElement: todoItemElement, elementText: 'Notes: ' });

  editProjectButton.classList.add('edit-belong');
  editProjectButton.dataset.type = todoItem.type;
  editProjectButton.dataset.id = todoItem.id;
  editProjectButton.dataset.belongType = 'project';
  editProjectButton.dataset.belongId = todoItem.belongs.project;
  editProjectButton.textContent = 'Change Project';

  const statuses = settings.statuses;
  updateStatusButton.textContent = `Mark as ${statuses[statuses.indexOf(todoItem.status) ^ 1]}`;
  priorityElement.innerHTML = 
    `Priority: ${todoItem.priority} <button>v</button> <button>^</button>`;
  showButton.classList.add('hidden');
  hideButton.classList.remove('hidden');
  todoItemElement.append(editProjectButton, updateStatusButton, priorityElement);
  _renderChecklistItems(todoItem);

  PubSub.publish(SHOW_RENDERED('todoItem'));
}

function _renderChecklistItems(todoItem) { 
}
