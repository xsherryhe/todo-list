import PubSub from 'pubsub-js';
import { BACK, ANY_INDEX_RENDERED, INDEX_RENDERED, NEW, ANY_NEW_RENDERED, 
         CREATE, SHOW, DESTROY } from './pubsub-event-types';

const addButton = type => document.querySelector(`.add-${type}`),
      addTodoButton = () => document.querySelector('.add-todo'),
      showButtons = () => document.querySelectorAll('.show'),
      deleteButtons = () => document.querySelectorAll('.delete'),
      backButton = () => document.querySelector('.back'),
      newForm = () => document.querySelector('.new-form'),
      submitButton = () => document.querySelector('.submit');

PubSub.subscribe(ANY_INDEX_RENDERED, bindIndexEvents)
function bindIndexEvents(_, type) {
  addButton(type).addEventListener('click', () => PubSub.publish(NEW(type)));
  showButtons().forEach(button =>
    button.addEventListener('click', e => PubSub.publish(SHOW(type), { id: e.target.dataset.id })));
  deleteButtons().forEach(button => 
    button.addEventListener('click', e => PubSub.publish(DESTROY(type), { id: e.target.dataset.id })));
}

PubSub.subscribe(ANY_NEW_RENDERED, bindNewEvents)
function bindNewEvents(_, type) {
  backButton().addEventListener('click', () => PubSub.publish(BACK));
  submitButton().addEventListener('click', e => {
    e.preventDefault();
    PubSub.publish(CREATE(type), Object.fromEntries(new FormData(newForm())));
  });
}

PubSub.subscribe(INDEX_RENDERED('project'), bindIndexProjectsEvents)
function bindIndexProjectsEvents() {
  addTodoButton().addEventListener('click', () => PubSub.publish(NEW('todoItem')));
}
