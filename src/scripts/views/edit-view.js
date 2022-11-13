import PubSub from 'pubsub-js';
import { ANY_EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_RENDERED, ANY_EDIT_BELONG, EDIT_BELONG_RENDERED } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderDisabled } from './view-helpers';
import back from '../../images/back.svg';
import pencil from '../../images/pencil.svg';

PubSub.subscribe(ANY_EDIT_ATTRIBUTE, editAttributeView)
function editAttributeView(_, { type, id, attribute, attributeType, attributeValue }) {
  renderDisabled();

  const attrElementSelector = `.attribute[data-type="${type}"][data-id="${id}"][data-attribute="${attribute}"]`,
        attrElement = document.querySelector(attrElementSelector),
        labelText = attrElement.querySelector('.element-text').textContent,
        isTextarea = attributeType == 'textarea';
  
  const formHTML =
    `<form class="edit-attribute-form enabled 
                  ${settings.clickOut.includes(attributeType) ? 'click-out' : ''}
                  ${labelText ? 'with-label' : ''}
                  ${isTextarea ? 'textarea' : ''}" 
           data-type="${type}" data-id="${id}" data-attribute="${attribute}">
      ${settings.clickOut.includes(attributeType) ? ''
      : `<button class="back ${isTextarea ? '' : 'symbol icon'}">
            ${isTextarea ? 'Back' : `<img src="${back}" alt="Back">`}
         </button>`}
      ${labelText ? `<label for="${attribute}">${labelText}</label>` : ''}
      <${isTextarea ? 'textarea' : 'input'} 
      type="${attributeType}" name="${attribute}" id="${attribute}" 
      value="${attributeValue}">${isTextarea ? `${attributeValue}</textarea>` : ''}
      <button class="submit ${isTextarea ? '' : 'symbol icon'}">
        ${isTextarea ? 'Submit' : `<img src="${pencil}" alt="Submit">`}
      </button>
   </form>`;
  
  attrElement.insertAdjacentHTML('afterend', formHTML);
  attrElement.remove();
  PubSub.publish(EDIT_ATTRIBUTE_RENDERED(type), { type, id, attribute });
}

PubSub.subscribe(ANY_EDIT_BELONG, editBelongView)
function editBelongView(_, { type, id, belongType, belongId }) {
  renderDisabled();
  
  const editBelongButtonSelector = `.edit-belong[data-belong-type="${belongType}"][data-type="${type}"][data-id="${id}"]`,
        editBelongButton = document.querySelector(editBelongButtonSelector);
  
  const formHTML =
  `<form class="edit-belong-form enabled" data-type="${type}" data-id="${id}" data-belong-type="${belongType}">
      <button class="back symbol icon"><img src="${back}" alt="Back"></button>
      <label for="belongId">Project</label>
      <select name="belongId" id="belongId">
        ${renderData[belongType + 'sList'][belongType + 's'].map(obj =>
          `<option value="${obj.id}" ${obj.id == +belongId ? 'selected' : ''}>
            ${obj.title}
           </option>`)
        .join('\n')}
      </select>
      <button class="submit">Change</button>
   </form>`;

  editBelongButton.insertAdjacentHTML('afterend', formHTML);
  editBelongButton.remove();
  PubSub.publish(EDIT_BELONG_RENDERED(type), { type, id, belongType })
}
