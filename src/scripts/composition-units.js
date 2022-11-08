import PubSub from 'pubsub-js';
import { CREATE, DESTROY, UPDATE, ITEM_UPDATED, UPDATE_STATUS, UPDATE_PRIORITY, 
         UPDATE_BELONG, BELONG_UPDATED, CREATE_COLLECTION_ITEMS, COLLECTION_UPDATED, LIST_UPDATED } from './pubsub-event-types';
import { applicationSettings as settings } from './application'

export function Updatable(obj) {
  PubSub.subscribe(UPDATE(obj.type, obj.id), update);
  function update(_, data) {
    for(const attribute in data) obj[attribute] = data[attribute];
    PubSub.publish(ITEM_UPDATED(obj.type, obj.id));
  }
}

export function Statusable(obj) {
  const statuses = settings.statuses;
  PubSub.subscribe(UPDATE_STATUS(obj.type, obj.id), incrementStatus)
  function incrementStatus() {
    obj.status = statuses[(statuses.indexOf(obj.status )+ 1) % statuses.length];
    PubSub.publish(ITEM_UPDATED(obj.type, obj.id));
  }
}

export function Prioritizable(obj) {
  const priorities = settings.priorities;
  PubSub.subscribe(UPDATE_PRIORITY(obj.type, obj.id), updatePriority)
  function updatePriority(_, data) {
    obj.priority = priorities[Math.min(Math.max(priorities.indexOf(obj.priority) + +data.direction, 0), priorities.length - 1)];
    PubSub.publish(ITEM_UPDATED(obj.type, obj.id));
  }
}

export function Collectionable(obj, collectionType) {
  const collection = collectionType + 's';
  obj[collection] ||= [];

  PubSub.subscribe(COLLECTION_UPDATED(collectionType), updateCollectionItems);
  function updateCollectionItems(_, data) {
    const newCollectionItems = data?.[obj.type]?.[obj.id];
    if(newCollectionItems) obj[collection] = newCollectionItems;
    PubSub.publish(ITEM_UPDATED(obj.type, obj.id));
  }

  function createCollectionItems(data) {
    Object.values(data[collectionType + 'sCollectionData'] || {}).forEach(itemData => {
      PubSub.publish(CREATE(collectionType),
        Object.assign(itemData, { [`belongs[${obj.type}]`]: obj.id }));
    })
  }
  createCollectionItems(obj);
  delete obj[collectionType + 'sCollectionData'];

  PubSub.subscribe(CREATE_COLLECTION_ITEMS(obj.type, obj.id, collectionType), createCollectionItemsFromData);
  function createCollectionItemsFromData(_, data) {
    _assignNested(data);
    createCollectionItems(data);
  }
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
    PubSub.publish(ITEM_UPDATED(obj.type, obj.id));
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

  PubSub.subscribe(BELONG_UPDATED(obj.itemType), publishCollectionsUpdate);
  function publishCollectionsUpdate(_, data) {
    const belongType = data.belongType, oldBelongId = data.oldBelongId, newBelongId = data.newBelongId;
    const item = obj[list].find(item => item.id == data.id);
    item.belongs[belongType] = newBelongId;
    PubSub.publish(COLLECTION_UPDATED(obj.itemType), 
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
    _publishCollectionUpdate(newListItem);
    PubSub.publish(LIST_UPDATED(obj.itemType));
  }

  PubSub.subscribe(DESTROY(obj.itemType), destroyListItem);
  function destroyListItem(_, data) {
    if(data.id == 0) return;
    
    const item = obj[list].find(item => item.id == data.id);
    obj[list].splice(obj[list].indexOf(item), 1);
    _publishCollectionUpdate(item);
    PubSub.publish(LIST_UPDATED(obj.itemType));
  }

  function _publishCollectionUpdate(item) {
    const belongData = Object.entries(item.belongs || {}).reduce((data, [belongType, belongId]) =>
      Object.assign(data,
        {
          [belongType]: {
            [belongId]: obj[list].filter(item => item.belongs[belongType] == belongId).map(item => item.id)
          }
        }), {});
    PubSub.publish(COLLECTION_UPDATED(obj.itemType), belongData);
  }
}

function _assignNested(data) {
  const reg = /(.+)\[(.+)\]/;
  let keys, targetKeys = () => Object.keys(data).filter(key => reg.test(key));
  while ((keys = targetKeys()).length > 0) {
    keys.forEach(key => {
      const [outer, inner] = key.match(reg).slice(1);
      data[outer] ||= {};
      data[outer][inner] = data[key];
      delete data[key];
    })
  }
}
