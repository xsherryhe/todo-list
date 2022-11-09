import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(NEW('project'), newProjectView);
export default function newProjectView() {
  const newProjectButton = document.querySelector('.new[data-type="project"]'),
        formElement = document.createElement('form');
  formElement.dataset.type = 'project';
  formElement.innerHTML =
    `<button class="back">Back</button>
     <label for="title">New Project</label>
     <input type="text" name="title" id="title">
     <button class="submit">Submit</button>`;

  newProjectButton.replaceWith(formElement);
  PubSub.publish(NEW_RENDERED('project'));
}
