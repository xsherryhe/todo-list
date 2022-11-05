import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED, HIDE } from '../pubsub-event-types';
import { applicationSettings as settings } from '../application';

PubSub.subscribe(NEW('checklistItem'), newChecklistItemView);
export default function newChecklistItemView(_, data) {
  const prevNewChecklistItemButton = document.querySelector('.new[data-type="checklistItem"]'),
        checklistItemFieldElement = document.createElement('div'),
        nextNewChecklistItemButton = document.createElement('button');
  
  const labelIndex = document.querySelectorAll('.checklist-item').length + 1,
        index = +data.index,
        prefix = `checklistItemsCollectionData[${index}]`;
  checklistItemFieldElement.classList.add('field', 'checklist-item');
  checklistItemFieldElement.dataset.index = `${index}`;

  checklistItemFieldElement.innerHTML = 
    `<label for="${prefix}[title]">${labelIndex}.</label>
     <input type="text" name="${prefix}[title]" id="${prefix}[title]">
     <input type="hidden" name="${prefix}[status]" id="${prefix}[status]" value="${settings.statuses[0]}">
     <button class="hide" data-type="new-checklistItem" data-index=${index}>-</button>`;

  nextNewChecklistItemButton.classList.add('new');
  nextNewChecklistItemButton.dataset.type = 'checklistItem';
  nextNewChecklistItemButton.dataset.index = index + 1;
  nextNewChecklistItemButton.textContent = 'Add a Checklist Item';
  prevNewChecklistItemButton.replaceWith(checklistItemFieldElement, nextNewChecklistItemButton);
  PubSub.publish(NEW_RENDERED('checklistItem'));
}

PubSub.subscribe(HIDE('new-checklistItem'), hideNewChecklistItemView);
function hideNewChecklistItemView(_, data) {
  document.querySelector(`.checklist-item[data-index="${data.index}"]`).remove();

  let labelIndex = 1;
  document.querySelectorAll('.checklist-item > label[for$="[title]"]')
          .forEach(label => label.textContent = `${labelIndex++}.`);
}
