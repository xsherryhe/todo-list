import PubSub from 'pubsub-js';
import { CREATE, DESTROY, UPDATE, UPDATE_STATUS, UPDATE_PRIORITY, UPDATE_BELONG, 
         UPDATED, BELONG_UPDATED, LIST_UPDATED } from './pubsub-event-types';
import { applicationSettings as settings } from './application'

export function Updatable(obj) {
  PubSub.subscribe(UPDATE(obj.type, obj.id), update);
  function update(_, data) {
    for(const attribute in data) obj[attribute] = data[attribute];
    PubSub.publish(UPDATED(obj.type, obj.id));
  }
}

export function Statusable(obj) {
  const statuses = settings.statuses;
  PubSub.subscribe(UPDATE_STATUS(obj.type, obj.id), incrementStatus)
  function incrementStatus() {
    obj.status = statuses[(statuses.indexOf(obj.status )+ 1) % statuses.length];
    PubSub.publish(UPDATED(obj.type, obj.id));
  }
}

export function Prioritizable(obj) {
  const priorities = settings.priorities;
  PubSub.subscribe(UPDATE_PRIORITY(obj.type, obj.id), updatePriority)
  function updatePriority(_, data) {
    obj.priority = priorities[Math.max(Math.min(priorities.indexOf(obj.priority) + data, 0), priorities.length - 1)];
    PubSub.publish(UPDATED(obj.type, obj.id));
  }
}

export function Collectionable(obj, collectionType) {
  const collection = collectionType + 's';
  obj[collection] ||= [];

  PubSub.subscribe(LIST_UPDATED(collectionType), updateCollectionItems);
  function updateCollectionItems(_, data) {
    const newCollectionItems = data?.[obj.type]?.[obj.id];
    if(newCollectionItems) obj[collection] = newCollectionItems;
  }

  Object.values((obj[collectionType + 'sCollectionData'] || {})).forEach(itemData => {
    PubSub.publish(CREATE(collectionType), 
                   Object.assign(itemData, { [`belongs[${obj.type}]`]: obj.id }));
  })
  delete obj[collectionType + 'sData'];
}

//may change depending on storage
export function Belongable(obj, belongType) {
  obj.belongs ||= { [belongType]: 0 };
  Object.keys(obj.belongs).forEach(key => obj.belongs[key] = +obj.belongs[key]);
  //obj.belongs[belongType] = obj[belongType + 'Id'];
  //delete obj[belongType + 'Id'];
}

export function BelongUpdatable(obj, belongType) {
  PubSub.subscribe(UPDATE_BELONG(obj.type, obj.id, belongType), updateBelong);
  function updateBelong(_, data) {
    const oldBelongId = obj.belongs[belongType], 
          newBelongId = data.belongId;
    obj.belongs[belongType] = newBelongId;
    PubSub.publish(BELONG_UPDATED(obj.type), { id: obj.id, belongType, oldBelongId, newBelongId });
  }
}

export function Listable(obj, rawItemList = []) {
  let nextId = 1;
  const list = obj.itemType + 's';
  obj[list] ||= rawItemList.map(rawItem => obj.itemFactory(Object.assign({ id: nextId++ }, rawItem)));

  obj.withId = function(id) {
    return obj[list].find(item => id == item.id);
  }

  obj.withIds = function(ids) {
    return obj[list].filter(item => ids.includes(item.id));
  }

  PubSub.subscribe(BELONG_UPDATED(obj.itemType), updateListBelongs);
  function updateListBelongs(_, data) {
    const belongType = data.belongType, oldBelongId = data.oldBelongId, newBelongId = data.newBelongId;
    const item = obj[list].find(item => item.id == data.id);
    item.belongs[belongType] = newBelongId;
    PubSub.publish(LIST_UPDATED(obj.itemType), 
                  { [belongType]: { 
                      [oldBelongId]: obj[list].filter(item => item.belongs[belongType] == oldBelongId).map(item => item.id),
                      [newBelongId]: obj[list].filter(item => item.belongs[belongType] == newBelongId).map(item => item.id)
                  } })
  }

  PubSub.subscribe(CREATE(obj.itemType), createListItem);
  function createListItem(_, data) {
    console.log(data);
    _assignNested(data);
    const newListItem = obj.itemFactory(Object.assign({ id: nextId++ }, data));
    obj[list].unshift(newListItem);
    publishListUpdatedWithBelongData(newListItem);
  }

  function _assignNested(data) {
    const reg = /(.+)\[(.+)\]/;
    let keys, targetKeys = () => Object.keys(data).filter(key => reg.test(key));
    while((keys = targetKeys()).length > 0) {
      keys.forEach(key => {
        const [outer, inner] = key.match(reg).slice(1);
        data[outer] ||= {};
        data[outer][inner] = data[key];
        delete data[key];
      })
    }
  }

  PubSub.subscribe(DESTROY(obj.itemType), destroyListItem);
  function destroyListItem(_, data) {
    if(data.id == 0) return;
    
    const item = obj[list].find(item => item.id == data.id);
    obj[list].splice(obj[list].indexOf(item), 1);
    publishListUpdatedWithBelongData(item);
  }

  function publishListUpdatedWithBelongData(item) {
    const belongData = Object.entries(item.belongs || {}).reduce((data, [belongType, belongId]) =>
      Object.assign(data,
        {
          [belongType]: {
            [belongId]: obj[list].filter(item => item.belongs[belongType] == belongId).map(item => item.id)
          }
        }), {});
    PubSub.publish(LIST_UPDATED(obj.itemType), belongData);
  }
}
