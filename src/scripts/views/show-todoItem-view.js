import PubSub from 'pubsub-js';
import { INDEX, SHOW, SHOW_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { editableAttribute } from './view-helpers';
import { formatRelative } from 'date-fns';
import down from '../../images/down.svg';
import up from '../../images/up.svg';
import checkmark from '../../images/check.svg';

PubSub.subscribe(SHOW('todoItem'), showTodoItemView);

export default function showTodoItemView(_, data) {
  const todoItem = renderData.todoItemsList.withId(data.id);
  const parentElement = document.querySelector(data.parentElementSelector || 'body');
  _renderTodoItem(todoItem, { parentElement, belongType: data.belongType });
  if(data.full) _renderFull(todoItem, { parentElement });
  PubSub.publish(SHOW_RENDERED('todoItem'));
}

function _renderTodoItem(todoItem, options) {
  const prevTodoItemElement = document.querySelector(`.todo-item[data-id="${todoItem.id}"]`);
  prevTodoItemElement?.remove();

  (options.parentElement || document.body).innerHTML +=
  `<div class="priority-${settings.priorities.indexOf(todoItem.priority)} 
               status-${settings.statuses.indexOf(todoItem.status)} todo-item" data-id="${todoItem.id}">
      <div class="todo-item-heading">
        ${editableAttribute(todoItem, 'title', 'text')}
        <button class="update-status symbol icon" data-type="${todoItem.type}" data-id="${todoItem.id}">
          ${settings.statuses.indexOf(todoItem.status) ? 
            `<img class="check" src="${checkmark}" alt="${settings.statuses[1]}">` : ''}
        </button>
      </div>
      ${editableAttribute(todoItem, 'dueDate', 'datetime-local',
        { elementText: 'Due: ',
          attributeText: todoItem.dueDate ? formatRelative(new Date(todoItem.dueDate), new Date())
                                          : 'None' })}
      <button class="show" data-type="${todoItem.type}Full" data-id="${todoItem.id}" 
             data-belong-type="${options.belongType || ''}">
        Expand
      </button>
      <button class="hide hidden" data-type="${todoItem.type}Full" data-id="${todoItem.id}"
              data-belong-type="${options.belongType || ''}">
        Shrink
      </button>
      <button class="destroy" data-type="${todoItem.type}" data-id="${todoItem.id}">Delete</button>
   </div>`;
}

function _renderFull(todoItem, options) {
  const todoItemElement = (options.parentElement || document).querySelector(`.todo-item[data-id="${todoItem.id}"]`),
        showButton = todoItemElement.querySelector(`.show[data-type="${todoItem.type}Full"]`),
        hideButton = todoItemElement.querySelector(`.hide[data-type="${todoItem.type}Full"]`);
  showButton.classList.add('hidden');
  hideButton.classList.remove('hidden');

  todoItemElement.innerHTML +=
    `<button class="edit-belong" data-type="${todoItem.type}" data-id="${todoItem.id}"
             data-belong-type="project" data-belong-id="${todoItem.belongs.project}">
      Change Project
     </button>
     ${editableAttribute(todoItem, 'description', 'textarea', { elementText: 'Description: ' })}
     ${editableAttribute(todoItem, 'notes', 'textarea', { elementText: 'Notes: ' }) }
     <div class="priority">
      <div>Priority: ${todoItem.priority || 'None'}</div>
      <button class="update-priority symbol icon" data-type="${todoItem.type}" data-id="${todoItem.id}" 
              data-direction="-1"><img src="${down}" alt="Down"></button>
      <button class="update-priority symbol icon" data-type="${todoItem.type}" data-id="${todoItem.id}"
              data-direction="1"><img src="${up}" alt="Up"></button>
     </div>`;

  _renderChecklistItemsIndex(todoItem);
}

function _renderChecklistItemsIndex(todoItem) {
  PubSub.publish(INDEX('checklistItem'),
                { belongType: todoItem.type, belongId: todoItem.id,
                  ids: todoItem.checklistItems, parentElementSelector: `.todo-item[data-id="${todoItem.id}"]` });
}
