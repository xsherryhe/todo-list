import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED, HIDE } from '../pubsub-event-types';
import { applicationSettings as settings } from '../application';

PubSub.subscribe(NEW('checklistItem'), newChecklistItemView);
export default function newChecklistItemView(_, data) {
  const prevNewChecklistItemButtonSelector = `${data.todoItem ? `.todo-item[data-id="${data.todoItem}"] ` : ''}.new[data-type="checklistItem"]`,
        prevNewChecklistItemButton = document.querySelector(prevNewChecklistItemButtonSelector),
        checklistItemFieldElement = document.createElement(data.todoItem ? 'form' : 'div'),
        nextNewChecklistItemButton = document.createElement('button');

  const labelIndex = document.querySelectorAll('.checklist-item').length + 1,
        index = +data.index,
        wrapper = attribute => data.todoItem ? attribute : `checklistItemsCollectionData[${index}][${attribute}]`;
  checklistItemFieldElement.classList.add('field', 'checklist-item');
  checklistItemFieldElement.dataset.type = 'checklistItem';
  checklistItemFieldElement.dataset.index = `${index}`;

  checklistItemFieldElement.innerHTML =
    `<label for="${wrapper('title')}">${labelIndex}.</label>
     <input type="text" name="${wrapper('title')}" id="${wrapper('title')}">
     <input type="hidden" name="${wrapper('status')}" id="${wrapper('status')}" value="${settings.statuses[0]}">
     <button class="hide" data-type="new-checklistItem" data-index=${index} ${data.todoItem ? `data-todo-item=${data.todoItem}` : ''}>-</button>
     ${data.todoItem ?
      `<input type="hidden" name="belongs[todoItem]" id="belongs[todoItem]" value="${data.todoItem}">
       <button class="submit">✓</button>` : ''}`;

  nextNewChecklistItemButton.classList.add('new');
  nextNewChecklistItemButton.dataset.type = 'checklistItem';
  if(data.todoItem) nextNewChecklistItemButton.dataset.todoItem = data.todoItem;
  nextNewChecklistItemButton.dataset.index = index + 1;
  nextNewChecklistItemButton.textContent = 'Add a Checklist Item';
  prevNewChecklistItemButton.replaceWith(checklistItemFieldElement, nextNewChecklistItemButton);
  PubSub.publish(NEW_RENDERED('checklistItem'));
}

PubSub.subscribe(HIDE('new-checklistItem'), hideNewChecklistItemView);
function hideNewChecklistItemView(_, data) {
  const selectorPrefix = data.todoItem ? `.todo-item[data-id="${data.todoItem}"] ` : '';
  document.querySelector(`${selectorPrefix}.checklist-item[data-index="${data.index}"]`).remove();

  let labelIndex = 1;
  document.querySelectorAll(`${selectorPrefix}.checklist-item > label[for*="title"]`)
          .forEach(label => label.textContent = `${labelIndex++}.`);
}
