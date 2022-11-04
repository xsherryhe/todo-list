import PubSub from 'pubsub-js';
import { INITIALIZE, DATA_INITIALIZED, ANY_UPDATED } from './pubsub-event-types';
import applicationData from './application';
//may change this depending on storageProvider implementation
import * as localStorage from './storage-providers/local-storage-provider';

PubSub.subscribe(INITIALIZE, initializeDataFn(localStorage.getData));
function initializeDataFn(getDataFn = localStorage.getData) {
  return function() {
    const storageData = getDataFn() || 
    { projectsList: [{ id: 0, title: 'My To-Dos', todoItemIds: [1] }], 
      todoItemsList: [{ id: 1, title: 'Sample To-Do', priority: 'low', status: 'incomplete', dueDate: new Date('November 10, 2022') }], 
      checklistItemsList: [] };
    PubSub.publish(DATA_INITIALIZED, storageData);
  }
}

PubSub.subscribe(ANY_UPDATED, saveDataFn(localStorage.saveData));
function saveDataFn(saveDataFn = localStorage.saveData) {
  return function() {
    saveDataFn(applicationData);
  }
}
