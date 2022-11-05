import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(NEW('project'), newProjectView);
export default function newProjectView() {
  const newProjectButton = document.querySelector('.new[data-type="project"]'),
        backButton = document.createElement('button'),
        formElement = document.createElement('form');
  backButton.classList.add('back');
  backButton.textContent = 'Back';
  formElement.dataset.type = 'project';
  formElement.innerHTML =
    `<label for="title">New Project</label>
     <input type="text" name="title" id="title">
     <button class="submit">Submit</button>`;

  newProjectButton.replaceWith(backButton, formElement);
  //addProjectButton.remove();
  PubSub.publish(NEW_RENDERED('project'));
}
