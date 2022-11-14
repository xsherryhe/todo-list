import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED, NEW_COLLECTION_ITEM_RENDERED, HIDE } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderDisabled, snakeCase } from './view-helpers'

PubSub.subscribe(NEW('checklistItem'), newChecklistItemView);
export default function newChecklistItemView(_, { belongType, belongId }) {
  if(belongId) renderDisabled();

  const newChecklistItemButtonSelector = `${belongId ? `.${snakeCase(belongType)}[data-id="${belongId}"] ` : ''}.new[data-type="checklistItem"]`,
        newChecklistItemButton = document.querySelector(newChecklistItemButtonSelector),
        checklistItemFormElement = newChecklistItemButton.closest('form'),
        backButton = checklistItemFormElement.querySelector('.back'),
        submitButton = checklistItemFormElement.querySelector('.submit');

  renderDisabled(checklistItemFormElement, false);
  [backButton, submitButton].forEach(button => button?.classList?.remove('hidden'));

  const index = 1 + document.querySelectorAll('.checklist-item.field').length + 
                (belongId ? renderData[belongType + 'sList'].withId(belongId).checklistItems.length : 0),
        attrWrapper = attribute => `checklistItemsCollectionData[${index}][${attribute}]`;
  
  const checklistItemFieldHTML = 
  `<div class="field enabled checklist-item" data-type="checklistItem" data-index="${index}">
      <input type="hidden" name="${attrWrapper(belongType + 'Index')}" id="${attrWrapper(belongType + 'Index')}" value="${index}">
      <label for="${attrWrapper('title')}">${index}.</label>
      <input type="text" name="${attrWrapper('title')}" id="${attrWrapper('title')}">
      <input type="hidden" name="${attrWrapper('status')}" id="${attrWrapper('status')}" value="${settings.statuses[0]}">
      <button class="hide symbol" data-type="new-checklistItem" data-index="${index}" 
              data-belong-type="${belongType}" ${belongId ? `data-belong-id=${belongId}` : ''}>X</button>
   </div>`;

  newChecklistItemButton.insertAdjacentHTML('beforebegin', checklistItemFieldHTML);
  PubSub.publish(belongId ? NEW_COLLECTION_ITEM_RENDERED(belongType) : NEW_RENDERED('checklistItem'));
}

PubSub.subscribe(HIDE('new-checklistItem'), hideNewChecklistItemView);
function hideNewChecklistItemView(_, { belongType, belongId, index }) {
  const checklistItemFormElementSelector = 
    belongId ? `.${snakeCase(belongType)}[data-id="${belongId}"] form[data-collection-type="checklistItem"]` 
             : `form[data-type="${belongType}"]`;
  const checklistItemFormElement = document.querySelector(checklistItemFormElementSelector);
  checklistItemFormElement.querySelector(`.checklist-item.field[data-index="${index}"]`).remove();

  const remainingChecklistItemFieldElements = checklistItemFormElement.querySelectorAll('.checklist-item.field');
  
  if(belongId && remainingChecklistItemFieldElements.length == 0) {
    renderDisabled(document.body, false);

    const backButton = checklistItemFormElement.querySelector('.back'),
          submitButton = checklistItemFormElement.querySelector('.submit');
    [backButton, submitButton].forEach(button => button?.classList?.add('hidden'));
  }

  const offset = 1 + (belongId ? renderData[belongType + 'sList'].withId(belongId).checklistItems.length : 0);
  remainingChecklistItemFieldElements.forEach((checklistItemElement, i) => {
    _updateIndex(checklistItemElement, belongType, i + offset);
  })
}

function _updateIndex(checklistItemElement, belongType, newIndex) {
  const inputElements = checklistItemElement.querySelectorAll('input'),
        belongIndexElement = checklistItemElement.querySelector(`input[name*="${belongType}Index"]`),
        labelElement = checklistItemElement.querySelector('label[for*="title"]'),
        hideButton = checklistItemElement.querySelector('.hide');

  inputElements.forEach(inputElement => {
    ['name', 'id'].forEach(attr => inputElement[attr] = inputElement[attr].replace(/\d+/, newIndex));
  })
  checklistItemElement.dataset.index = newIndex;
  belongIndexElement.value = newIndex;
  labelElement.textContent = `${newIndex}.`;
  hideButton.dataset.index = newIndex;
}
