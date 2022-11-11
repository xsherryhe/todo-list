import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED, NEW_COLLECTION_ITEM_RENDERED, HIDE } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderSelectablesDisabled, snakeCase } from './view-helpers'

PubSub.subscribe(NEW('checklistItem'), newChecklistItemView);
export default function newChecklistItemView(_, { belongType, belongId }) {
  if(belongId) renderSelectablesDisabled();

  const newChecklistItemButtonSelector = `${belongId ? `.${snakeCase(belongType)}[data-id="${belongId}"] ` : ''}.new[data-type="checklistItem"]`,
        newChecklistItemButton = document.querySelector(newChecklistItemButtonSelector),
        checklistItemFormElement = newChecklistItemButton.closest('form'),
        backButton = checklistItemFormElement.querySelector('.back'),
        submitButton = checklistItemFormElement.querySelector('.submit'),
        checklistItemFieldElement = document.createElement('div');

  const index = 1 + document.querySelectorAll('.checklist-item.field').length + 
                (belongId ? renderData[belongType + 'sList'].withId(belongId).checklistItems.length : 0),
        attrWrapper = attribute => `checklistItemsCollectionData[${index}][${attribute}]`;
  checklistItemFieldElement.classList.add('field', 'checklist-item');
  checklistItemFieldElement.dataset.type = 'checklistItem';
  checklistItemFieldElement.dataset.index = `${index}`;

  checklistItemFieldElement.innerHTML =
    `<input type="hidden" name="${attrWrapper(belongType + 'Index')}" id="${attrWrapper(belongType + 'Index')}" value="${index}">
     <label for="${attrWrapper('title')}">${index}.</label>
     <input type="text" name="${attrWrapper('title')}" id="${attrWrapper('title')}">
     <input type="hidden" name="${attrWrapper('status')}" id="${attrWrapper('status')}" value="${settings.statuses[0]}">
     <button class="hide symbol" data-type="new-checklistItem" data-index="${index}" 
             data-belong-type="${belongType}" ${belongId ? `data-belong-id=${belongId}` : ''}>X</button>`;

  [backButton, submitButton].forEach(button => button?.classList?.remove('hidden'));
  newChecklistItemButton.insertAdjacentElement('beforebegin', checklistItemFieldElement);
  renderSelectablesDisabled(checklistItemFormElement, false);
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
    renderSelectablesDisabled(document, false);

    const backButton = checklistItemFormElement.querySelector('.back'),
          submitButton = checklistItemFormElement.querySelector('.submit');
    [backButton, submitButton].forEach(button => button?.classList?.add('hidden'));
  }

  const offset = 1 + (belongId ? renderData[belongType + 'sList'].withId(belongId).checklistItems.length : 0);
  remainingChecklistItemFieldElements.forEach((checklistItemElement, i) => {
    const newIndex = i + offset;
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
  })
}
