import PubSub from 'pubsub-js';
import { ANY_EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(ANY_EDIT_ATTRIBUTE, editAttributeView)
function editAttributeView(_, { type, id, attribute, attributeType, attributeValue }) {
  document.querySelectorAll('button').forEach(button => button.disabled = true);

  const editAttributeButtonSelector = `.edit-attribute[data-type="${type}"][data-id="${id}"][data-attribute="${attribute}"]`,
        editAttributeButton = document.querySelector(editAttributeButtonSelector),
        backButton = document.createElement('button'), 
        formElement = document.createElement('form');

  backButton.classList.add('back');
  backButton.textContent = '←';
  formElement.classList.add('edit-form');
  formElement.dataset.type = type;
  formElement.dataset.id = id;
  formElement.dataset.attribute = attribute;
  formElement.innerHTML =
    `<input type="${attributeType}" name="${attribute}" id="${attribute}" value="${attributeValue}">
     <button class="submit">✓</button>`;

  editAttributeButton.replaceWith(backButton, formElement);
  //editAttributeButton.remove();
  PubSub.publish(EDIT_ATTRIBUTE_RENDERED(type), { type, id, attribute });
}
