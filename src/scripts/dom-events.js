import PubSub from 'pubsub-js';
import { BACK, VIEW_RENDERED, INDEX, NEW, ANY_NEW_RENDERED, 
         CREATE, SHOW, DESTROY } from './pubsub-event-types';

const indexButtons = () => document.querySelectorAll('.index'),
      newButtons = () => document.querySelectorAll('.new'),
      showButtons = () => document.querySelectorAll('.show'),
      destroyButtons = () => document.querySelectorAll('.destroy'),
      backButton = () => document.querySelector('.back'),
      newForm = () => document.querySelector('.new-form'),
      submitButton = () => document.querySelector('.submit');

function _bindButtons(buttons, pubSubEvent) {
  buttons.forEach(button => {
    const clearedButton = button.cloneNode(true);
    button.replaceWith(clearedButton);
    clearedButton.addEventListener('click', e => PubSub.publish(pubSubEvent(e.target.dataset.type), e.target.dataset));
  });
}

PubSub.subscribe(VIEW_RENDERED, bindActionButtons);
function bindActionButtons() {
  _bindButtons(indexButtons(), INDEX);
  _bindButtons(newButtons(), NEW);
  _bindButtons(showButtons(), SHOW);
  _bindButtons(destroyButtons(), DESTROY);
}

PubSub.subscribe(ANY_NEW_RENDERED, bindNewEvents);
function bindNewEvents() {
  backButton().addEventListener('click', () => PubSub.publish(BACK));
  submitButton().addEventListener('click', e => {
    e.preventDefault();
    PubSub.publish(CREATE(newForm().dataset.type), Object.fromEntries(new FormData(newForm())));
  });
}
