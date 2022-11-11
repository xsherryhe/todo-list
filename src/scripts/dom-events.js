import PubSub from 'pubsub-js';
import { BACK, VIEW_RENDERED, INDEX, NEW, ANY_NEW_RENDERED, NEW_RENDERED, ANY_NEW_COLLECTION_ITEM_RENDERED, 
         CREATE, SHOW, HIDE, EDIT_ATTRIBUTE, ANY_EDIT_ATTRIBUTE_RENDERED, EDIT_BELONG, ANY_EDIT_BELONG_RENDERED, 
         UPDATE, UPDATE_BELONG, UPDATE_STATUS, UPDATE_PRIORITY, DESTROY, CREATE_COLLECTION_ITEMS } from './pubsub-event-types';
import { applicationSettings as settings } from './application';

const indexButtons = () => document.querySelectorAll('.index'),
      newButtons = () => document.querySelectorAll('.new'),
      showButtons = () => document.querySelectorAll('.show'),
      hideButtons = () => document.querySelectorAll('.hide'),
      editAttributeButtons = () => document.querySelectorAll('.edit-attribute'),
      editBelongButtons = () => document.querySelectorAll('.edit-belong'),
      updateStatusButtons = () => document.querySelectorAll('.update-status'),
      updatePriorityButtons = () => document.querySelectorAll('.update-priority'),
      destroyButtons = () => document.querySelectorAll('.destroy'),
      backButtons = () => document.querySelectorAll('.back'),
      inputElements = () => document.querySelectorAll('input:not([type="checkbox"],[type="radio"]),textarea'),
      submitButtons = () => document.querySelectorAll('.submit');

function _bindButtons(buttons, pubSubEvent, options = {}) {
  buttons.forEach(button => {
    button = _clearEventListeners(button);
    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target.closest('button');
      const args = [target.dataset.type]
                   .concat((options.extraArgs || []).map(arg => target.dataset[arg]));
      PubSub.publish(typeof pubSubEvent == 'function' ? 
                      pubSubEvent(...args) : pubSubEvent,
                     target.dataset);
    })
  })
}

PubSub.subscribe(VIEW_RENDERED, bindActionButtons);
function bindActionButtons() {
  _bindButtons(indexButtons(), INDEX);
  _bindButtons(newButtons(), NEW);
  _bindButtons(showButtons(), SHOW);
  _bindButtons(hideButtons(), HIDE);
  _bindButtons(editAttributeButtons(), EDIT_ATTRIBUTE);
  _bindButtons(editBelongButtons(), EDIT_BELONG);
  _bindButtons(updateStatusButtons(), UPDATE_STATUS, { extraArgs: ['id'] });
  _bindButtons(updatePriorityButtons(), UPDATE_PRIORITY, { extraArgs: ['id'] });
  _bindButtons(destroyButtons(), DESTROY);
  _bindButtons(backButtons(), BACK);
}

function _bindFormSubmitButtons(pubSubEvent, dataAttrs) {
  submitButtons().forEach(button => { 
    button = _clearEventListeners(button);
    button.addEventListener('click', e => {
      e.preventDefault();
      const form = e.target.closest('form'),
            args = dataAttrs.map(attr => form.dataset[attr]);
      PubSub.publish(pubSubEvent(...args), Object.fromEntries(new FormData(form)));
    })
  })
}

function _bindFormSubmitEnterKey(pubSubEvent, dataAttrs) {
  inputElements().forEach(input => {
    input = _clearEventListeners(input);
    const form = input.closest('form'),
          args = dataAttrs.map(attr => form.dataset[attr]);
    input.addEventListener('keydown', e => {
      if (!(e.key == 'Enter' && document.activeElement == input)) return;
      e.preventDefault();
      PubSub.publish(pubSubEvent(...args), Object.fromEntries(new FormData(form)));
    })
  })
}

function _clearEventListeners(element) {
  const clearedElement = element.cloneNode(true);
  element.replaceWith(clearedElement);
  return clearedElement;
}

PubSub.subscribe(ANY_NEW_RENDERED, bindCreateButtons);
function bindCreateButtons() {
  _bindFormSubmitButtons(CREATE, ['type']);
}

PubSub.subscribe(NEW_RENDERED('project'), bindNewProjectEvents);
function bindNewProjectEvents() {
  _bindFormSubmitEnterKey(CREATE, ['type']);
}

PubSub.subscribe(ANY_NEW_COLLECTION_ITEM_RENDERED, bindCreateCollectionItemsButtons);
function bindCreateCollectionItemsButtons() {
  _bindFormSubmitButtons(CREATE_COLLECTION_ITEMS, ['type', 'id', 'collectionType']);
  _bindFormSubmitEnterKey(CREATE_COLLECTION_ITEMS, ['type', 'id', 'collectionType']);
}

PubSub.subscribe(ANY_EDIT_ATTRIBUTE_RENDERED, bindEditAttributeEvents);
function bindEditAttributeEvents(_, data) {
  _bindFormSubmitButtons(UPDATE, ['type', 'id']);
  _bindFormSubmitEnterKey(UPDATE, ['type', 'id']);
  inputElements().forEach(input => {
    const form = e.target.closest('form');
    if(Object.entries(data).every(([key, val]) => form.dataset[key] == val)) 
      _focusInput(input);
    if(settings.clickOut.includes(input.type)) 
      input.addEventListener('focusout', () => 
        PubSub.publish(UPDATE(form.dataset.type, form.dataset.id), 
                       Object.fromEntries(new FormData(form))));
  })
}

function _focusInput(input) {
  input.focus();
  if(input.selectionStart)
    input.selectionStart = input.selectionEnd = input.value.length;
}

PubSub.subscribe(ANY_EDIT_BELONG_RENDERED, bindEditBelongEvents);
function bindEditBelongEvents() {
  _bindFormSubmitButtons(UPDATE_BELONG, ['type', 'id', 'belongType']);
}
