import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types'; 
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { editableAttribute } from './view-helpers';
import checkmark from '../../images/check.svg';

PubSub.subscribe(SHOW('checklistItem'), showChecklistItemView);
function showChecklistItemView(_, data) {
  const checklistItem = renderData.checklistItemsList.withId(data.id);
  const parentElement = document.querySelector(data.parentElementSelector || 'body'),
        prevChecklistItemElement = document.querySelector(`${data.elementWrapper || '.checklist-item'}[data-id="${checklistItem.id}"]`);

  prevChecklistItemElement?.remove();
  parentElement.innerHTML += 
  `${data.elementWrapper ? 
    `<${data.elementWrapper} class="status-${settings.statuses.indexOf(checklistItem.status)}" 
                             data-id="${checklistItem.id}">` : ''}
    <div class="status-${settings.statuses.indexOf(checklistItem.status)} checklist-item" data-id="${checklistItem.id}">
      ${editableAttribute(checklistItem, 'title', 'text')}
      <button class="update-status symbol icon" data-type="${checklistItem.type}" data-id="${checklistItem.id}">
        ${settings.statuses.indexOf(checklistItem.status) ? 
          `<img class="check" src="${checkmark}" alt="${settings.statuses[1]}">` : ''}
      </button>
      <button class="destroy" data-type="${checklistItem.type}" data-id="${checklistItem.id}">Delete</button>
    </div>
  ${data.elementWrapper ? `</${data.elementWrapper}>` : ''}`;
   
  PubSub.publish(SHOW_RENDERED('checklistItem'));
}
