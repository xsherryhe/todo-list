import PubSub from 'pubsub-js';
import { VALIDATION_ERROR } from '../pubsub-event-types';
import { humanReadableNames } from '../settings';
import { capitalize } from './view-helpers';

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

    const errorElement = document.createElement('p'),
          typeText = capitalize(humanReadableNames[error.objType] || error.objType),
          errorAttributeText = humanReadableNames[error.objAttribute] || error.objAttribute;
    errorElement.classList.add('error');
    errorElement.textContent = `${typeText} ${errorAttributeText} ${error.message}`;
    attrElement.insertAdjacentElement('afterend', errorElement);
  }
}
