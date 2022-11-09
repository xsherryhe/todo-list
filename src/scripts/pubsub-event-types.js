export const INITIALIZE = 'initialize';
export const DATA_INITIALIZED = 'dataInitialized';

export const BACK = 'back';
export const INDEX = type => `index.${type}`;
export const NEW = type => `new.${type}`;
export const CREATE = type => `create.${type}`;
export const CREATE_COLLECTION_ITEMS = (type, id, collectionType) => `create.collection.${collectionType}.${type}.${id}`;
export const SHOW = type => `show.${type}`;
export const HIDE = type => `hide.${type}`;
export const ANY_EDIT_ATTRIBUTE = 'edit.attribute';
export const EDIT_ATTRIBUTE = type => `edit.attribute.${type}`;
export const ANY_EDIT_BELONG = 'edit.belong';
export const EDIT_BELONG = type => `edit.belong.${type}`;
export const DESTROY = type => `destroy.${type}`;

export const COLLECTION_ITEMS_CREATED = collectionType => `created.collection.${collectionType}`;

export const VALIDATION_ERROR = 'error.validation';

export const UPDATE = (type, id) => `update.${type}.${id}`;
export const UPDATE_STATUS = (type, id) => `update.${type}.status.${id}`;
export const UPDATE_PRIORITY = (type, id) => `update.${type}.priority.${id}`;
export const UPDATE_BELONG = (type, id, belongType) => `update.${type}.belong.${belongType}.${id}`;

export const ANY_UPDATED = 'updated';
export const DATA_UPDATED = 'updated.data';
export const ITEM_UPDATED = (type, id) => `updated.data.item.${type}.${id}`;
export const LIST_UPDATED = type => `updated.data.list.${type}`;
export const BELONG_UPDATED = type => `updated.${type}.belong`;
export const COLLECTION_UPDATED = type => `updated.${type}.collection`;

export const PAGE_RENDERED = 'rendered.page';
export const VIEW_RENDERED = 'rendered.view';
export const ANY_INDEX_RENDERED = 'rendered.view.index';
export const INDEX_RENDERED = type => `rendered.view.index.${type}`;
export const ANY_NEW_RENDERED = 'rendered.view.new';
export const NEW_RENDERED = type => `rendered.view.new.${type}`;
export const ANY_NEW_COLLECTION_ITEM_RENDERED = 'rendered.view.collection.new';
export const NEW_COLLECTION_ITEM_RENDERED = type => `rendered.view.collection.new.${type}`;
export const ANY_SHOW_RENDERED = 'rendered.view.show';
export const SHOW_RENDERED = type => `rendered.view.show.${type}`;
export const ANY_EDIT_ATTRIBUTE_RENDERED = 'rendered.view.edit.attribute';
export const EDIT_ATTRIBUTE_RENDERED = type => `rendered.view.edit.attribute.${type}`;
export const ANY_EDIT_BELONG_RENDERED = 'rendered.view.edit.belong';
export const EDIT_BELONG_RENDERED = type => `rendered.view.edit.belong.${type}`;
