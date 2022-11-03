import PubSub from 'pubsub-js';
import { SHOW, SHOW_RENDERED } from '../pubsub-event-types';

PubSub.subscribe(SHOW('project'), showProjectView);

function showProjectView() {
  console.log('showProjectView');

}
