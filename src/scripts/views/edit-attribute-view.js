import PubSub from 'pubsub-js';
import { ANY_EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(ANY_EDIT_ATTRIBUTE, editAttributeView)
function editAttributeView(_, { type, id, attribute, attributeType, attributeValue }) {
  document.querySelectorAll('button').forEach(button => button.disabled = true);

  const attrElementSelector = `.attribute[data-type="${type}"][data-id="${id}"][data-attribute="${attribute}"]`,
        attrElement = document.querySelector(attrElementSelector),
        backButton = document.createElement('button'), 
        formElement = document.createElement('form');

  backButton.classList.add('back');
  backButton.textContent = '←';
  formElement.classList.add('edit-form');
  formElement.dataset.type = type;
  formElement.dataset.id = id;
  formElement.dataset.attribute = attribute;
  const isTextarea = attributeType == 'textarea';
  formElement.innerHTML =
    `<${isTextarea ? 'textarea' : 'input'} 
      type="${attributeType}" name="${attribute}" id="${attribute}" value="${attributeValue}">
     ${isTextarea ? `${attributeValue}</textarea>` : ''}
     <button class="submit">✓</button>`;

  attrElement.replaceWith(backButton, formElement);
  PubSub.publish(EDIT_ATTRIBUTE_RENDERED(type), { type, id, attribute });
}
