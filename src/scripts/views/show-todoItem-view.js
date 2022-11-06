import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED, PAGE_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderEditableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('todoItem'), showTodoItemView);

export default function showTodoItemView(_, data) {
  const todoItem = renderData.todoItemsList.withId(data.id);
  const showButton = document.querySelector(`.show[data-type="todoItem"][data-id="${data.id}"]`),
        todoItemElement = document.querySelector(`.todo-item[data-id="${data.id}"]`),
        hideButton = document.createElement('button'),
        editProjectButton = document.createElement('button'),
        updateStatusButton = document.createElement('button'),
        priorityElement = document.createElement('div');

  renderEditableAttribute(todoItem, 'description', 'textarea', { parentElement: todoItemElement, elementText: 'Description: ' });
  renderEditableAttribute(todoItem, 'notes', 'textarea', { parentElement: todoItemElement, elementText: 'Notes: ' });

  hideButton.classList.add('hide');
  hideButton.textContent = 'Shrink';

  editProjectButton.textContent = 'Change Project';
  const statuses = settings.statuses;
  updateStatusButton.textContent = `Mark as ${statuses[statuses.indexOf(todoItem.status) ^ 1]}`;
  priorityElement.innerHTML = 
    `Priority: ${todoItem.priority} <button>v</button> <button>^</button>`;
  showButton.replaceWith(hideButton);
  todoItemElement.append(editProjectButton, updateStatusButton, priorityElement);
  _renderChecklistItems(todoItem);

  PubSub.publish(PAGE_RENDERED, showTodoItemView.bind(null, _, data));
  PubSub.publish(SHOW_RENDERED('todoItem'));
}

function _renderChecklistItems(todoItem) {

}
