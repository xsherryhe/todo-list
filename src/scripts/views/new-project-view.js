import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(NEW('project'), newProjectView);
export default function newProjectView() {
  const addProjectButton = document.querySelector('.new[data-type="project"]'),
        backButton = document.createElement('button'),
        projectFormElement = document.createElement('form');
  backButton.classList.add('back');
  backButton.textContent = 'Back';
  projectFormElement.classList.add('new-form');
  projectFormElement.dataset.type = 'project';
  projectFormElement.innerHTML =
    `<label for="title">New Project</label>
     <input type="text" name="title" id="title">
     <button class="submit">Submit</button>`;

  addProjectButton.parentNode.append(backButton, projectFormElement);
  addProjectButton.remove();
  PubSub.publish(NEW_RENDERED('project'));
}
