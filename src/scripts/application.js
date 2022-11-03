import PubSub from 'pubsub-js';
import { INITIALIZE } from './pubsub-event-types';
import { ProjectsList } from './projects';

let applicationData;

function initialize() {
  PubSub.publish(INITIALIZE);
}

PubSub.subscribe(DATA_INITIALIZED, populateData);
function populateData(_, data) {
  applicationData = ProjectsList(data);
}

initialize();
export default applicationData;
