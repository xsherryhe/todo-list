import '../styles/application.css';

import './storage';
import './views/views';
import './dom-events';
import './projects';
import './todo-items';
import './checklist-items';

import PubSub from 'pubsub-js';
import { INITIALIZE, DATA_INITIALIZED, ANY_UPDATED } from './pubsub-event-types';

import { ProjectsList } from './projects';
import { TodoItemsList } from './todo-items';
import { ChecklistItemsList } from './checklist-items';
const applicationDataLists = { ProjectsList, TodoItemsList, ChecklistItemsList };

export let applicationData = {};
export * as applicationSettings from './settings';

function initialize() {
  PubSub.publish(INITIALIZE);
}

PubSub.subscribe(DATA_INITIALIZED, populateData);
function populateData(_, data) {
  for(const key in data)
    applicationData[key] = applicationDataLists[key[0].toUpperCase() + key.slice(1)](data[key]);
  PubSub.publish(ANY_UPDATED);
}

initialize();
