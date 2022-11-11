import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';
import { renderSelectablesDisabled } from './view-helpers';

PubSub.subscribe(NEW('project'), newProjectView);
export default function newProjectView() {
  renderSelectablesDisabled();
  
  const newProjectButton = document.querySelector('.new[data-type="project"]'),
        formElement = document.createElement('form');
  formElement.classList.add('new-form');
  formElement.dataset.type = 'project';
  formElement.innerHTML =
    `<button class="back symbol">←</button>
     <label for="title">New Project</label>
     <input type="text" name="title" id="title">
     <button class="submit symbol">✓</button>`;

  newProjectButton.replaceWith(formElement);
  PubSub.publish(NEW_RENDERED('project'));
}
