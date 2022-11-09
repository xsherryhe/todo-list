import PubSub from 'pubsub-js';
import { INITIALIZE, DATA_INITIALIZED, ANY_UPDATED } from './pubsub-event-types';
import { applicationData } from './application';
//may change this depending on storageProvider implementation
import * as localStorageProvider from './storage-providers/local-storage-provider';

PubSub.subscribe(INITIALIZE, initializeDataFn(localStorageProvider.getData));
function initializeDataFn(getDataFn = localStorageProvider.getData) {
  return function() {
    const storageData = getDataFn() || 
    { projectsList: [{ id: 0, title: 'My To-Dos', todoItems: [1] }], 
      todoItemsList: [{ id: 1, title: 'Sample To-Do', priority: 'Low', status: 'Incomplete' }], 
      checklistItemsList: [] };
    PubSub.publish(DATA_INITIALIZED, storageData);
  }
}

PubSub.subscribe(ANY_UPDATED, saveDataFn(localStorageProvider.saveData));
function saveDataFn(saveDataFn = localStorageProvider.saveData) {
  return function() {
    const storageData = {};
    for(const key in applicationData) 
      storageData[key] = applicationData[key].toStorage();
    saveDataFn(storageData);
  }
}
