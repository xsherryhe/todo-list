import PubSub from 'pubsub-js';
import { INDEX, INDEX_RENDERED, SHOW } from '../pubsub-event-types';
import { applicationData as renderData } from '../application';

PubSub.subscribe(INDEX('checklistItem'), indexChecklistItemsView);
function indexChecklistItemsView(_, data) {
  const parentElement = document.querySelector(data.parentElementSelector || 'body'),
        prevChecklistItemsIndexElement = parentElement.querySelector('.checklist-items-index');
  prevChecklistItemsIndexElement?.remove();
  parentElement.innerHTML += 
  `<div class="checklist-items-index">
    <h3>Checklist</h3>
     <ol class="checklist-items"></ol>
     <form class="new-form" data-type="${data.belongType}" data-id="${data.belongId}" 
           data-collection-type="checklistItem">
        <button class="back hidden">Back</button>
        <button class="new link" data-type="checklistItem"
                data-belong-type="${data.belongType}" data-belong-id="${data.belongId}">
          Add a Checklist Item
        </button>
        <button class="submit hidden">Submit</button>
     </form>
  </div>`;
  _renderChecklistItems(data.ids, data.belongType, data.parentElementSelector);
  PubSub.publish(INDEX_RENDERED('checklistItem'));
}

function _renderChecklistItems(ids, belongType, grandparentElementSelector) {
  renderData.checklistItemsList.withIds(ids)
            .sort((a, b) => +a[belongType + 'Index'] - +b[belongType + 'Index'])
            .forEach(checklistItem => {
              PubSub.publish(SHOW('checklistItem'), 
                             { id: checklistItem.id, 
                               elementWrapper: 'li',
                               parentElementSelector: `${grandparentElementSelector} .checklist-items` });
            });
}
