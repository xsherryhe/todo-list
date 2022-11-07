import PubSub from 'pubsub-js';
import { ANY_EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_RENDERED, ANY_EDIT_BELONG, EDIT_BELONG_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { renderSelectablesDisabled } from './view-helpers';

PubSub.subscribe(ANY_EDIT_ATTRIBUTE, editAttributeView)
function editAttributeView(_, { type, id, attribute, attributeType, attributeValue }) {
  renderSelectablesDisabled();

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
      type="${attributeType}" name="${attribute}" id="${attribute}" 
      value="${attributeValue}">${isTextarea ? `${attributeValue}</textarea>` : ''}
     <button class="submit">✓</button>`;

  attrElement.replaceWith(backButton, formElement);
  PubSub.publish(EDIT_ATTRIBUTE_RENDERED(type), { type, id, attribute });
}

PubSub.subscribe(ANY_EDIT_BELONG, editBelongView)
function editBelongView(_, { type, id, belongType, belongId }) {
  renderSelectablesDisabled();
  
  const editBelongButtonSelector = `.edit-belong[data-belong-type="${belongType}"][data-type="${type}"][data-id="${id}"]`,
        editBelongButton = document.querySelector(editBelongButtonSelector),
        backButton = document.createElement('button'),
        formElement = document.createElement('form');
  
  backButton.classList.add('back');
  backButton.textContent = '←';
  formElement.classList.add('edit-form');
  formElement.dataset.type = type;
  formElement.dataset.id = id;
  formElement.dataset.belongType = belongType;
  formElement.innerHTML = 
    `<label for="belongId">Project</label>
     <select name="belongId" id="belongId">
      ${renderData[belongType + 'sList'][belongType + 's'].map(obj =>
        `<option value="${obj.id}" ${obj.id == belongId ? 'selected' : ''}>
            ${obj.title}
          </option>`)
      .join('\n')}
     </select>
     <button class="submit">Change</button>`;

  editBelongButton.replaceWith(backButton, formElement);
  PubSub.publish(EDIT_BELONG_RENDERED(type), { type, id, belongType })
}
