import PubSub from 'pubsub-js';
import { INITIALIZE, DATA_INITIALIZED, ANY_UPDATED } from './pubsub-event-types';
import applicationData from './application';
//may change this depending on storageProvider implementation
import * as localStorage from './storage-providers/local-storage-provider';

PubSub.subscribe(INITIALIZE, initializeDataFn(localStorage.getData));
function initializeDataFn(getDataFn = localStorage.getData) {
  return function() {
    const storageData = getDataFn() || [{ id: 0, title: 'My Project' }];
    PubSub.publish(DATA_INITIALIZED, storageData);
  }
}

PubSub.subscribe(ANY_UPDATED, saveDataFn(localStorage.saveData));
function saveDataFn(saveDataFn = localStorage.saveData) {
  return function() {
    saveDataFn(applicationData);
  }
}
