import PubSub from 'pubsub-js';
import { INDEX, SHOW } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';
import { snakeCase } from './view-helpers';

PubSub.subscribe(INDEX('checklistItem'), indexChecklistItemsView);
function indexChecklistItemsView(_, data) {
  _renderHeading(data.parentElement);
  _renderChecklistItems(data.ids, data.belongType, data.parentElement);
  _renderNewChecklistItemsForm(data.belongType, data.belongId, data.parentElement);
}

function _renderHeading(parentElement) {
  const headingElement = document.createElement('h3');
  headingElement.textContent = 'Checklist';
  (parentElement || document.body).append(headingElement);
}

function _renderChecklistItems(ids, belongType, parentElement) {
  const checklistItemsElement = document.createElement('ol');
  renderData.checklistItemsList.withIds(ids)
            .sort((a, b) => +a[belongType + 'Index'] - +b[belongType + 'Index'])
            .forEach(checklistItem => {
              PubSub.publish(SHOW('checklistItem'), 
                             { id: checklistItem.id, 
                               elementType: 'li',
                               parentElement: checklistItemsElement });
            });
  (parentElement || document.body).append(checklistItemsElement);
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
