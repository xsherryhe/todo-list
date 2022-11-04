import PubSub from 'pubsub-js';
import { BACK, VIEW_RENDERED, INDEX, NEW, ANY_NEW_RENDERED, CREATE, 
         SHOW, ANY_EDIT_RENDERED, EDIT_ATTRIBUTE, ANY_EDIT_ATTRIBUTE_RENDERED, 
         UPDATE, DESTROY } from './pubsub-event-types';

const indexButtons = () => document.querySelectorAll('.index'),
      newButtons = () => document.querySelectorAll('.new'),
      showButtons = () => document.querySelectorAll('.show'),
      editAttributeButtons = () => document.querySelectorAll('.edit-attribute'),
      destroyButtons = () => document.querySelectorAll('.destroy'),
      backButtons = () => document.querySelectorAll('.back'),
      inputElements = () => document.querySelectorAll('input'),
      submitButtons = () => document.querySelectorAll('.submit');

function _bindButtons(buttons, pubSubEvent, extraDataAttrs = []) {
  buttons.forEach(button => {
    const clearedButton = button.cloneNode(true);
    button.replaceWith(clearedButton);
    const extraData = extraDataAttrs.reduce((data, attr) => 
      Object.assign(data, { [attr]: button[attr] }), {});
    clearedButton.addEventListener('click', 
      e => PubSub.publish(typeof pubSubEvent == 'function' ? 
                            pubSubEvent(e.target.dataset.type) : pubSubEvent,
                          Object.assign(e.target.dataset, extraData)));
  });
}

PubSub.subscribe(VIEW_RENDERED, bindActionButtons);
function bindActionButtons() {
  _bindButtons(indexButtons(), INDEX);
  _bindButtons(newButtons(), NEW);
  _bindButtons(showButtons(), SHOW);
  _bindButtons(editAttributeButtons(), EDIT_ATTRIBUTE, ['textContent']);
  _bindButtons(destroyButtons(), DESTROY);
  _bindButtons(backButtons(), BACK);
}

function _bindFormSubmitButtons(pubSubEvent, dataAttrs) {
  submitButtons().forEach(button => { 
    const clearedButton = button.cloneNode(true);
    button.replaceWith(clearedButton);
    clearedButton.addEventListener('click', e => {
      e.preventDefault();
      const form = e.target.closest('form'),
            args = dataAttrs.map(attr => form.dataset[attr]);
      PubSub.publish(pubSubEvent(...args), Object.fromEntries(new FormData(form)));
    })
  });
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
function bindEditAttributeEvents() {
  inputElements().forEach(input => {
    const clearedInput = input.cloneNode(true);
    input.replaceWith(clearedInput);
    _focusInput(clearedInput);
    clearedInput.addEventListener('keydown', e => {
      if(!(e.key == 'Enter' && document.activeElement == input)) return;
      const form = e.target.closest('form');
      PubSub.publish(UPDATE(form.type, form.id), Object.fromEntries(new FormData(form)));
    })

    clearedInput.addEventListener('focusout', () => PubSub.publish(BACK));
  })
}

function _focusInput(input) {
  input.focus();
  if(input.type == 'text')
    input.selectionStart = input.selectionEnd = input.value.length;
}
