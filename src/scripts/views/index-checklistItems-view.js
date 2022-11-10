import PubSub from 'pubsub-js';
import { INDEX } from '../pubsub-event-types';
import { applicationData as renderData, applicationSettings as settings } from '../application';
import { renderEditableAttribute, snakeCase } from './view-helpers';

PubSub.subscribe(INDEX('checklistItem'), indexChecklistItemsView);
function indexChecklistItemsView(_, data) {
  _renderHeading(data.parentElement);
  _renderChecklistItems(data.ids, data.parentElement);
  _renderNewChecklistItemsForm(data.belongType, data.belongId, data.parentElement);
}

function _renderHeading(parentElement) {
  const headingElement = document.createElement('h3');
  headingElement.textContent = 'Checklist';
  (parentElement || document.body).append(headingElement);
}

function _renderChecklistItems(ids, parentElement) {
  const checklistItems =
    renderData.checklistItemsList
              .withIds(ids)
              .sort((a, b) => +a[belongType + 'Index'] - +b[belongType + 'Index']);

  const listElement = document.createElement('ol');
  checklistItems.forEach(checklistItem => {
    const checklistItemElement = document.createElement('li'),
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
    listElement.append(checklistItemElement);
  });

  (parentElement || document.body).append(listElement);
}

function _renderNewChecklistItemsForm(belongType, belongId, parentElement) {
  const newChecklistItemsFormElement = document.createElement('form');
  newChecklistItemsFormElement.dataset.type = belongType;
  newChecklistItemsFormElement.dataset.id = belongId;
  newChecklistItemsFormElement.dataset.collectionType = 'checklistItem';
  newChecklistItemsFormElement.innerHTML =
    `<button class="back hidden">←</button>
     <button class="new link" data-type="checklistItem" data-${snakeCase(belongType)}="${belongId}">
      Add a Checklist Item
     </button>
     <button class="submit hidden">Submit</button>`;

  (parentElement || document.body).append(newChecklistItemsFormElement);
}
