import PubSub from 'pubsub-js';
import { VALIDATION_ERROR } from '../pubsub-event-types';
import { humanReadableNames } from '../settings';
import { centerOnPage, capitalize } from './view-helpers';

PubSub.subscribe(VALIDATION_ERROR, validationErrorView);
function validationErrorView(_, data) {
  const containerElementSelectors = 
    `[data-type="${data.type}"]${data.id ? `[data-id="${data.id}"]` : ''}${data.index ? `[data-index="${data.index}"]` : ''}`;
  const containerElement = document.querySelector(`form${containerElementSelectors},.field${containerElementSelectors}`);
  if(!containerElement) return;

  containerElement.querySelectorAll('.error').forEach(error => error.remove());
  
  for(const error of data.errors) {
    const attrElement = 
      containerElement.querySelector(`input[name*="${error.attribute}"],textarea[name*="${error.attribute}"]`);
    if(!attrElement) continue;

    if(data.errors.indexOf(error) == 0) centerOnPage(attrElement.parentNode);
    const typeText = capitalize(humanReadableNames[error.objType] || error.objType),
          errorAttributeText = humanReadableNames[error.objAttribute] || error.objAttribute,
          errorHTML = `<p class="error">${typeText} ${errorAttributeText} ${error.message}</p>`;
    attrElement.insertAdjacentHTML('afterend', errorHTML);
  }
}
