import PubSub from 'pubsub-js';
import { ANY_EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(ANY_EDIT_ATTRIBUTE, editAttributeView)
function editAttributeView(_, { type, id, attribute, attributeType, textContent }) {
  document.querySelectorAll('button').forEach(button => 
    button.classList.add('unclickable'));

  const editAttributeButtonSelector = `.edit-attribute[data-type="${type}"][data-id="${id}"][data-attribute="${attribute}"]`,
        editAttributeButton = document.querySelector(editAttributeButtonSelector),
        backButton = document.createElement('button'), 
        formElement = document.createElement('form');

  backButton.classList.add('back');
  backButton.textContent = '←';
  formElement.classList.add('edit-form');
  formElement.dataset.type = type;
  formElement.dataset.id = id;
  formElement.innerHTML =
    `<input type="${attributeType}" name="${attribute}" id="${attribute}" value="${textContent}">
     <button class="submit">✓</button>`;

  editAttributeButton.replaceWith(backButton, formElement);
  //editAttributeButton.remove();
  PubSub.publish(EDIT_ATTRIBUTE_RENDERED(type));
}
