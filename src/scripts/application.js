import PubSub from 'pubsub-js';

//run modules
import * as storage from './storage';
import * as views from './views';

import { INITIALIZE, DATA_INITIALIZED, ANY_UPDATED } from './pubsub-event-types';
import { ProjectsList } from './projects';

export let applicationData;

function initialize() {
  PubSub.publish(INITIALIZE);
}

PubSub.subscribe(DATA_INITIALIZED, populateData);
function populateData(_, data) {
  applicationData = ProjectsList(data);
  PubSub.publish(ANY_UPDATED);
}

initialize();
