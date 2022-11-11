import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types'; 
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderEditableAttribute } from './view-helpers';

PubSub.subscribe(SHOW('checklistItem'), showChecklistItemView);
function showChecklistItemView(_, data) {
  const checklistItem = renderData.checklistItemsList.withId(data.id);
  const checklistItemElement = document.createElement(data.elementType || 'div'),
        updateStatusButton = document.createElement('button'),
        destroyButton = document.createElement('button');

  checklistItemElement.classList.add(checklistItem.status, 'checklist-item');
  checklistItemElement.dataset.id = checklistItem.id;

  renderEditableAttribute(checklistItem, 'title', 'text', { parentElement: checklistItemElement });

  [updateStatusButton, destroyButton].forEach(button => {
    button.dataset.type = checklistItem.type;
    button.dataset.id = checklistItem.id;
  })
  updateStatusButton.classList.add('update-status');
  //TO DO: Change check to icon image
  updateStatusButton.textContent = settings.statuses.indexOf(checklistItem.status) ? '✓' : '';

  destroyButton.classList.add('destroy');
  destroyButton.textContent = '-';

  checklistItemElement.append(updateStatusButton, destroyButton);
  (data.parentElement || document.body).append(checklistItemElement);
  PubSub.publish(SHOW_RENDERED('checklistItem'));
}
