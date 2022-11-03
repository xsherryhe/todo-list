import PubSub from 'pubsub-js';
import { CREATE, DESTROY, UPDATE, UPDATE_STATUS, UPDATE_PRIORITY, UPDATED, BELONG_UPDATED, LIST_UPDATED } from './pubsub-event-types';

export function Updatable(obj) {
  PubSub.subscribe(UPDATE(obj.type), update);
  function update(_, data) {
    if(data.type != obj.type || data.id != obj.id) return;
    for(key in data) obj[attribute] = data[attribute];
    PubSub.publish(UPDATED(obj.type));
  }
}

export function Statusable(obj) {
  const statuses = ['incomplete', 'complete'];
  PubSub.subscribe(UPDATE_STATUS(obj.type), incrementStatus)
  function incrementStatus() {
    obj.status = statuses[(statuses.indexOf(obj.status )+ 1) % statuses.length];
    PubSub.publish(UPDATED(obj.type));
  }
}

export function Prioritizable(obj) {
  const priorities = ['low', 'medium', 'high'];
  PubSub.subscribe(UPDATE_PRIORITY(obj.type), updatePriority)
  function updatePriority(_, data) {
    obj.priority = priorities[Math.max(Math.min(priorities.indexOf(obj.priority) + data, 0), priorities.length - 1)];
    PubSub.publish(UPDATED(obj.type));
  }
}

export function Collectionable(obj, collectionType) {
  const collection = collectionType + 's';
  obj[collection] ||= [];

  PubSub.subscribe(LIST_UPDATED(collectionType), updateCollectionItems);
  function updateCollectionItems(_, data) {
    const newCollectionItems = data?.[obj.type]?.[obj.id];
    if(newCollectionItems) obj[collection] = newChecklistItems;
  }
}

export function Belongable(obj, belongType) {
  obj.belongs ||= {};
  obj.belongs[belongType] = obj[belongType + 'Id'];
  delete obj[belongType + 'Id'];
}

export function Listable(obj, itemList = []) {
  const list = obj.itemType + 's';
  obj[list] ||= itemList;
  let nextId = 1;

  PubSub.subscribe(BELONG_UPDATED(obj.itemType), updateListBelongs);
  function updateListBelongs(_, data) {
    const belongType = data.belongType, oldBelongId = data.oldBelongId, newBelongId = data.newBelongId;
    const item = obj[list].find(item => item.id == data.id);
    item.belongs[belongType] = newBelongId;
    PubSub.publish(LIST_UPDATED(obj.itemType), 
                  { [belongType]: { 
                      [oldBelongId]: obj[list].filter(item => item.belongs[belongType] == oldBelongId),
                      [newBelongId]: obj[list].filter(item => item.belongs[belongType] == newBelongId)
                  } })
  }

  PubSub.subscribe(CREATE(obj.itemType), createListItem);
  function createListItem(_, data) {
    const newListItem = obj.itemFactory(Object.assign({ id: nextId++ }, data.attributes));
    obj[list].push(newListItem);
    publishListUpdatedWithBelongData(newListItem);
  }

  PubSub.subscribe(DESTROY(obj.itemType), destroyListItem);
  function destroyListItem(_, data) {
    const item = obj[list].find(item => item.id == data.id);
    obj[list].splice(obj[list].indexOf(item), 1);
    publishListUpdatedWithBelongData(item);
  }

  function publishListUpdatedWithBelongData(item) {
    const belongData = Object.entries(item.belongs).reduce((data, [belongType, belongId]) =>
      Object.assign(data,
        {
          [belongType]: {
            [belongId]: obj[list].filter(item => item.belongs[belongType] == belongId)
          }
        }), {});
    PubSub.publish(LIST_UPDATED(obj.itemType), belongData);
  }
}
