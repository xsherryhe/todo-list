import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types'; 
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { editableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('checklistItem'), showChecklistItemView);
function showChecklistItemView(_, data) {
  const checklistItem = renderData.checklistItemsList.withId(data.id);
  const parentElement = document.querySelector(data.parentElementSelector || 'body'),
        prevChecklistItemElement = document.querySelector(`.checklist-item[data-id="${checklistItem.id}"]`);

  prevChecklistItemElement?.remove();
  //TO DO: Change check to icon image
  parentElement.innerHTML += 
  `<${data.elementType || 'div'} class="status-${settings.statuses.indexOf(checklistItem.status)} checklist-item" data-id="${checklistItem.id}">
      ${editableAttribute(checklistItem, 'title', 'text')}
      <button class="update-status" data-type="${checklistItem.type}" data-id="${checklistItem.id}">
        ${settings.statuses.indexOf(checklistItem.status) ? '✓' : ''}
      </button>
      <button class="destroy" data-type="${checklistItem.type}" data-id="${checklistItem.id}">-</button>
   </${data.elementType || 'div'}>`;
   
  PubSub.publish(SHOW_RENDERED('checklistItem'));
}
