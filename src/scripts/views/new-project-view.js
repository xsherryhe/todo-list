import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';
import { renderSelectablesDisabled } from './view-helpers';
import pencil from '../../images/pencil.svg';

PubSub.subscribe(NEW('project'), newProjectView);
export default function newProjectView() {
  renderSelectablesDisabled();
  
  const newProjectButton = document.querySelector('.new[data-type="project"]');
  const formHTML = 
  `<form class="new-form" data-type="project">
      <button class="back symbol">←</button>
      <label for="title">New Project</label>
      <input type="text" name="title" id="title">
      <button class="submit symbol"><img src="${pencil}" alt="Submit"></button>
   </form>`;

  newProjectButton.insertAdjacentHTML('afterend', formHTML);
  newProjectButton.remove();
  PubSub.publish(NEW_RENDERED('project'));
}
