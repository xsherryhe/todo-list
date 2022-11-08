import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED, NEW_COLLECTION_ITEM_RENDERED, HIDE } from '../pubsub-event-types';
import { applicationSettings as settings } from '../application';
import { renderSelectablesDisabled } from './view-helpers'

PubSub.subscribe(NEW('checklistItem'), newChecklistItemView);
export default function newChecklistItemView(_, data) {
  //To do: refactor to rely more on the data from the to do item rather than data from query selectors
  if(data.todoItem) renderSelectablesDisabled();

  const newChecklistItemButtonSelector = `${data.todoItem ? `.todo-item[data-id="${data.todoItem}"] ` : ''}.new[data-type="checklistItem"]`,
        newChecklistItemButton = document.querySelector(newChecklistItemButtonSelector),
        checklistItemFormElement = newChecklistItemButton.closest('form'),
        submitButton = checklistItemFormElement.querySelector('.submit'),
        checklistItemFieldElement = document.createElement('div');

  const index = document.querySelectorAll('.checklist-item').length + 1,
        attrWrapper = attribute => `checklistItemsCollectionData[${index}][${attribute}]`;
  checklistItemFieldElement.classList.add('field', 'checklist-item');
  checklistItemFieldElement.dataset.type = 'checklistItem';
  checklistItemFieldElement.dataset.index = `${index}`;

  checklistItemFieldElement.innerHTML =
    `<input type="hidden" name="${attrWrapper('index')}" id="${attrWrapper('index')}" value="${index}">
     <label for="${attrWrapper('title')}">${index}.</label>
     <input type="text" name="${attrWrapper('title')}" id="${attrWrapper('title')}">
     <input type="hidden" name="${attrWrapper('status')}" id="${attrWrapper('status')}" value="${settings.statuses[0]}">
     <button class="hide" data-type="new-checklistItem" data-index="${index}" ${data.todoItem ? `data-todo-item=${data.todoItem}` : ''}>-</button>`;

  submitButton.classList.remove('hidden');
  newChecklistItemButton.insertAdjacentElement('beforebegin', checklistItemFieldElement);
  renderSelectablesDisabled(checklistItemFormElement, false);
  PubSub.publish(data.todoItem ? NEW_COLLECTION_ITEM_RENDERED('todoItem') : NEW_RENDERED('checklistItem'));
}

PubSub.subscribe(HIDE('new-checklistItem'), hideNewChecklistItemView);
function hideNewChecklistItemView(_, data) {
  //To do: refactor to rely more on the data from the to do item rather than data from query selectors
  const checklistItemFormElementSelector = 
    data.todoItem ? `.todo-item[data-id="${data.todoItem}"] form[data-collection-type="checklistItem"]` 
                  : 'form[data-type="todoItem"]',
        checklistItemFormElement = document.querySelector(checklistItemFormElementSelector);
  
  checklistItemFormElement.querySelector(`.checklist-item.field[data-index="${data.index}"]`).remove();

  const offset = checklistItemFormElement.querySelectorAll('.checklist-item:not(.field)').length + 1,
        remainingChecklistItemFieldElements = checklistItemFormElement.querySelectorAll('.checklist-item.field');
  
  if(data.todoItem && remainingChecklistItemFieldElements.length == 0) {
    renderSelectablesDisabled(document, false);
    checklistItemFormElement.querySelector('.submit').classList.add('hidden');
  }

  remainingChecklistItemFieldElements.forEach((checklistItemElement, i) => {
    const index = i + offset;
    const indexAttr = checklistItemElement.querySelector('input[name*="index"]'),
          label = checklistItemElement.querySelector('label[for*="title"]'),
          hideButton = checklistItemElement.querySelector('.hide');
    checklistItemElement.dataset.index = index;
    indexAttr.value = index;
    label.textContent = `${index}.`;
    hideButton.dataset.index = index;
  })
}
