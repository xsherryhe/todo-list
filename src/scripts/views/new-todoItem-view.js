import PubSub from 'pubsub-js';
import { NEW, NEW_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(NEW('todoItem'), newTodoItemView);


function newTodoItemView() {
  console.log('newTodoItemView');
}
