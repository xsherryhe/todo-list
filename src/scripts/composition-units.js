import PubSub from 'pubsub-js';
import { CREATE, DESTROY, UPDATE, ITEM_UPDATED, UPDATE_STATUS, UPDATE_PRIORITY, 
         UPDATE_BELONG, BELONG_UPDATED, CREATE_COLLECTION_ITEMS, COLLECTION_ITEMS_CREATED, 
         COLLECTION_UPDATED, LIST_UPDATED, VALIDATION_ERROR } from './pubsub-event-types';
import { applicationSettings as settings } from './application'

export function Validatable(obj) {
  obj.validations ||= {};
  obj.errors ||= [];

  obj.validate = function(data = obj) {
    obj.errors = [];
    for(const attribute in data)
      obj.errors.push(..._attrErrors(attribute, obj[attribute]));
    if(data.associatedValidations) 
      obj.errors.push(..._associatedErrors(data.associatedValidations));
  }

  obj.validateAssociated = function (associatedValidations) {
    obj.errors = [];
    obj.errors.push(..._associatedErrors(associatedValidations));
  }

  function _attrErrors(attribute, value, errors = []) {
    obj.validations?.[attribute]?.forEach(validation => {
      if (!validation.fn(value)) 
        errors.push({ objAttribute: attribute, objType: obj.type, 
                      attribute, message: validation.message });
    })
    return errors;
  }

  function _associatedErrors(associatedValidations, errors = []) {
    associatedValidations.forEach(validation => {
      if(!validation.obj.valid())
        errors.push(...validation.obj.errors.map(error =>
          Object.assign({}, error,
            { attribute: validation.attrWrapper ?
              validation.attrWrapper(error.attribute) : error.attribute })));
    })
    return errors;
  }

  obj.valid = function() {
    obj.validate();
    return obj.errors.length == 0;
  }
}

export function PresenceValidatable(obj, attrs) {
  attrs.forEach(attr => {
    obj.validations[attr] ||= [];
    obj.validations[attr].push({ fn: value => value, message: 'cannot be blank' });
  })
}

export function Updatable(obj) {
  PubSub.subscribe(UPDATE(obj.type, obj.id), update);
  function update(_, data) {
    obj.validate(data);
    if(obj.errors.length) 
      return PubSub.publish(VALIDATION_ERROR, { type: obj.type, id: obj.id, errors: obj.errors });

    for(const attribute in data) {
      obj[attribute] = data[attribute];
    }
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

export function Collectionable(obj, collectionType, collectionTypeFactory) {
  const collection = collectionType + 's';
  obj[collection] ||= [];

  PubSub.subscribe(COLLECTION_UPDATED(collectionType), updateCollectionItems);
  function updateCollectionItems(_, data) {
    const newCollectionItems = data?.[obj.type]?.[obj.id];
    if(newCollectionItems) {
      obj[collection] = newCollectionItems.map(collectionItem => collectionItem.id);
      const objIndex = obj.type + 'Index';
      newCollectionItems.sort((a, b) => +a[objIndex] - +b[objIndex])
                        .forEach((collectionItem, i) => collectionItem[objIndex] = i + 1);
    }
    PubSub.publish(ITEM_UPDATED(obj.type, obj.id));
  }

  function createCollectionItems(data, validateSelf = false) {
    const collectionItems = 
      Object.values(data[collectionType + 'sCollectionData'] || {})
            .map(itemData => collectionTypeFactory(Object.assign(itemData, { belongs: { [obj.type]: obj.id } })));
    
    const collectionItemValidations = collectionItems.map(item => {
      return { obj: item, attrWrapper: attr => `${collectionType + 'sCollectionData'}[${item[obj.type + 'Index']}][${attr}]` }
    })
    
    if(validateSelf) {
      if(!obj.valid()) return;
      obj.associatedValidations = collectionItemValidations;
    }

    obj.validateAssociated(collectionItemValidations);
    if(obj.errors.length) return PubSub.publish(VALIDATION_ERROR, { type: obj.type, errors: obj.errors });
    
    PubSub.publish(COLLECTION_ITEMS_CREATED(collectionType), { collectionItems });
  }
  createCollectionItems(obj, true);
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
                      [oldBelongId]: obj[list].filter(item => item.belongs[belongType] == oldBelongId),
                      [newBelongId]: obj[list].filter(item => item.belongs[belongType] == newBelongId)
                  } })
  }

  PubSub.subscribe(CREATE(obj.itemType), createListItem);
  function createListItem(_, data) {
    console.log(data);
    _assignNested(data);
    const newListItem = obj.itemFactory(Object.assign({ id: nextId++ }, data));
    if(!newListItem.valid())
      return PubSub.publish(VALIDATION_ERROR, { type: obj.itemType, errors: newListItem.errors });

    obj[list].unshift(newListItem);
    _publishCollectionUpdate([newListItem]);
    PubSub.publish(LIST_UPDATED(obj.itemType));
  }

  PubSub.subscribe(COLLECTION_ITEMS_CREATED(obj.itemType), createListItemsFromCollectionItems)
  function createListItemsFromCollectionItems(_, data) {
    const newListItems = data.collectionItems.map(item => {
      const listItem = Object.assign({ id: nextId++ }, item);
      obj[list].unshift(listItem);
      return listItem;
    })

    _publishCollectionUpdate(newListItems);
    PubSub.publish(LIST_UPDATED(obj.itemType));
  }

  PubSub.subscribe(DESTROY(obj.itemType), destroyListItem);
  function destroyListItem(_, data) {
    if(data.id == 0) return;
    
    const item = obj[list].find(item => item.id == data.id);
    obj[list].splice(obj[list].indexOf(item), 1);
    _publishCollectionUpdate([item]);
    PubSub.publish(LIST_UPDATED(obj.itemType));
  }

  function _publishCollectionUpdate(items) {
    const belongData = {};
    items.forEach(item => {
      Object.entries(item.belongs || {}).forEach(([belongType, belongId]) => {
        belongData[belongType] ||= {};
        belongData[belongType][belongId] ||= obj[list].filter(listItem => listItem.belongs[belongType] == belongId);
      })
    })
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
