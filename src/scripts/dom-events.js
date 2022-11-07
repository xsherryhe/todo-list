import PubSub from 'pubsub-js';
import { BACK, VIEW_RENDERED, INDEX, NEW, ANY_NEW_RENDERED, CREATE, 
         SHOW, HIDE, ANY_EDIT_RENDERED, EDIT_ATTRIBUTE, ANY_EDIT_ATTRIBUTE_RENDERED, 
         UPDATE, DESTROY } from './pubsub-event-types';
import { applicationSettings as settings } from './application';

const indexButtons = () => document.querySelectorAll('.index'),
      newButtons = () => document.querySelectorAll('.new'),
      showButtons = () => document.querySelectorAll('.show'),
      hideButtons = () => document.querySelectorAll('.hide'),
      editAttributeButtons = () => document.querySelectorAll('.edit-attribute'),
      destroyButtons = () => document.querySelectorAll('.destroy'),
      backButtons = () => document.querySelectorAll('.back'),
      inputElements = () => document.querySelectorAll('input,textarea'),
      submitButtons = () => document.querySelectorAll('.submit');

function _bindButtons(buttons, pubSubEvent) {
  buttons.forEach(button => {
    button = _clearEventListeners(button);
    button.addEventListener('click', e => {
      e.preventDefault();
      PubSub.publish(typeof pubSubEvent == 'function' ? 
                      pubSubEvent(e.target.dataset.type) : pubSubEvent,
                     e.target.dataset);
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

PubSub.subscribe(ANY_NEW_RENDERED, bindCreateButtons);
function bindCreateButtons() {
  _bindFormSubmitButtons(CREATE, ['type']);
}

PubSub.subscribe(ANY_EDIT_RENDERED, bindUpdateButtons);
function bindUpdateButtons() {
  _bindFormSubmitButtons(UPDATE, ['type', 'id']);
}

PubSub.subscribe(ANY_EDIT_ATTRIBUTE_RENDERED, bindEditAttributeEvents);
function bindEditAttributeEvents(_, data) {
  inputElements().forEach(input => {
    input = _clearEventListeners(input);
    const form = input.closest('form');
    if(Object.entries(data).every(([key, val]) => form.dataset[key] == val)) 
      _focusInput(input);
    input.addEventListener('keydown', e => {
      if(!(e.key == 'Enter' && document.activeElement == input)) return;
      PubSub.publish(UPDATE(form.dataset.type, form.dataset.id), Object.fromEntries(new FormData(form)));
    })

    if(settings.clickOut.includes(input.type)) 
      input.addEventListener('focusout', () => 
        PubSub.publish(UPDATE(form.dataset.type, form.dataset.id), Object.fromEntries(new FormData(form))));
  })
}

function _focusInput(input) {
  input.focus();
  if(input.selectionStart)
    input.selectionStart = input.selectionEnd = input.value.length;
}

function _clearEventListeners(element) {
  const clearedElement = element.cloneNode(true);
  element.replaceWith(clearedElement);
  return clearedElement;
}
