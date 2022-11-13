import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';
import { renderDisabled } from './view-helpers';
import back from '../../images/back.svg';
import pencil from '../../images/pencil.svg';

PubSub.subscribe(NEW('project'), newProjectView);
export default function newProjectView() {
  renderDisabled();
  
  const newProjectButton = document.querySelector('.new[data-type="project"]');
  const formHTML = 
  `<form class="new-form enabled" data-type="project">
      <button class="back symbol icon"><img src="${back}" alt="Back"></button>
      <label for="title">New Project</label>
      <input type="text" name="title" id="title">
      <button class="submit symbol icon"><img src="${pencil}" alt="Submit"></button>
   </form>`;

  newProjectButton.insertAdjacentHTML('afterend', formHTML);
  newProjectButton.remove();
  PubSub.publish(NEW_RENDERED('project'));
}
