import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderEditableAttribute } from './view-helpers';
import { formatRelative } from 'date-fns';

PubSub.subscribe(SHOW('todoItem'), showTodoItemView);

export default function showTodoItemView(_, data) {
  const todoItem = renderData.todoItemsList.withId(data.id);
  _renderTodoItem(todoItem, data.parentElement);
  if(data.full) _renderFull(todoItem, data.parentElement);
  PubSub.publish(SHOW_RENDERED('todoItem'));
}

function _renderTodoItem(todoItem, parentElement) {
  const prevTodoItemElement = document.querySelector(`.todo-item[data-id="${todoItem.id}"`),
        todoItemElement = document.createElement('div'),
        updateStatusButton = document.createElement('button'),
        showButton = document.createElement('button'),
        hideButton = document.createElement('button'),
        destroyButton = document.createElement('button');

  prevTodoItemElement?.remove();
  todoItemElement.classList.add(todoItem.priority, todoItem.status, 'todo-item');
  todoItemElement.dataset.id = todoItem.id;

  renderEditableAttribute(todoItem, 'title', 'text', { parentElement: todoItemElement });

  updateStatusButton.classList.add('update-status');
  updateStatusButton.dataset.type = todoItem.type;
  updateStatusButton.dataset.id = todoItem.id;
  //TO DO: Change check to icon image
  updateStatusButton.textContent = settings.statuses.indexOf(todoItem.status) ? '✓' : '';
  todoItemElement.append(updateStatusButton);

  renderEditableAttribute(todoItem, 'dueDate', 'datetime-local',
    {
      parentElement: todoItemElement, elementText: 'Due: ',
      attributeText: todoItem.dueDate ? formatRelative(new Date(todoItem.dueDate), new Date())
        : 'None'
    });

  [showButton, hideButton].forEach(button => {
    button.dataset.type = todoItem.type + 'Full';
    button.dataset.id = todoItem.id;
  })

  showButton.classList.add('show');
  showButton.textContent = 'Expand';

  hideButton.classList.add('hide', 'hidden');
  hideButton.textContent = 'Shrink';

  destroyButton.dataset.type = todoItem.type;
  destroyButton.dataset.id = todoItem.id;
  destroyButton.classList.add('destroy');
  destroyButton.textContent = '-';

  todoItemElement.append(showButton, hideButton, destroyButton);
  (parentElement || document.body).append(todoItemElement);
}

function _renderFull(todoItem, parentElement) {
  const todoItemElement = parentElement.querySelector(`.todo-item[data-id="${todoItem.id}"]`),
        showButton = todoItemElement.querySelector(`.show[data-type="${todoItem.type + 'Full'}"]`),
        hideButton = todoItemElement.querySelector(`.hide[data-type="${todoItem.type + 'Full'}"]`),
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

  _renderChecklistItems(todoItem, todoItemElement);
}

function _renderChecklistItems(todoItem, todoItemElement) {
  const newChecklistItemFormElement = document.createElement('form'); 
  newChecklistItemFormElement.dataset.type = todoItem.type;
  newChecklistItemFormElement.dataset.id = todoItem.id;
  newChecklistItemFormElement.dataset.collectionType = 'checklistItem';
  newChecklistItemFormElement.innerHTML =
    `<button class="new" data-type="checklistItem" data-todo-item="${todoItem.id}">
      Add a Checklist Item
     </button>
     <button class="submit hidden">✓</button>`;

  const checklistItems = renderData.checklistItemsList.withIds(todoItem.checklistItems).sort((a, b) => +a.index - +b.index);
  if(!checklistItems.length) return todoItemElement.append(newChecklistItemFormElement);

  const headingElement = document.createElement('h3'),
        listElement = document.createElement('ol');
  headingElement.textContent = 'Checklist';

  checklistItems.forEach(checklistItem => {
    const checklistItemElement = document.createElement('li');
    //TO DO: Change check to icon image
    checklistItemElement.classList.add(checklistItem.status, 'checklist-item');
    checklistItemElement.dataset.id = checklistItem.id;
    checklistItemElement.innerHTML =
      `${checklistItem.title}
       <button class="update-status" data-type="${checklistItem.type}" data-id="${checklistItem.id}">
        ${settings.statuses.indexOf(checklistItem.status) ? '✓' : ''}
       </button>
       <button class="destroy" data-type="${checklistItem.type}" data-id="${checklistItem.id}">-</button>`;

    listElement.append(checklistItemElement);
  })

  todoItemElement.append(headingElement, listElement, newChecklistItemFormElement);
}
