export const INITIALIZE = 'initialize';
export const DATA_INITIALIZED = 'dataInitialized';

export const BACK = 'back';
export const INDEX = type => `index.${type}`;
export const NEW = type => `new.${type}`;
export const CREATE = type => `create.${type}`;
export const SHOW = type => `show.${type}`;
export const HIDE = type => `hide.${type}`;
export const ANY_EDIT_ATTRIBUTE = 'edit.attribute';
export const EDIT_ATTRIBUTE = type => `edit.attribute.${type}`;
export const DESTROY = type => `destroy.${type}`;

export const UPDATE = (type, id) => `update.${type}.${id}`;
export const UPDATE_STATUS = (type, id) => `update.${type}.status.${id}`;
export const UPDATE_PRIORITY = (type, id) => `update.${type}.priority.${id}`;
export const UPDATE_BELONG = (type, id, belongType) => `update.${type}.belong.${belongType}.${id}`;

export const ANY_UPDATED = 'updated';
export const UPDATED = (type, id) => `updated.${type}.${id}`;
export const BELONG_UPDATED = type => `updated.${type}.belong`;
export const LIST_UPDATED = type => `updated.${type}.list`;

export const PAGE_RENDERED = 'rendered.page';
export const VIEW_RENDERED = 'rendered.view';
export const ANY_INDEX_RENDERED = 'rendered.view.index';
export const INDEX_RENDERED = type => `rendered.view.index.${type}`;
export const ANY_NEW_RENDERED = 'rendered.view.new';
export const NEW_RENDERED = type => `rendered.view.new.${type}`;
export const ANY_SHOW_RENDERED = 'rendered.view.show';
export const SHOW_RENDERED = type => `rendered.view.show.${type}`;
export const ANY_EDIT_RENDERED = 'rendered.view.edit';
export const EDIT_RENDERED = type => `rendered.view.edit.${type}`;
export const ANY_EDIT_ATTRIBUTE_RENDERED = 'rendered.view.edit.attribute';
export const EDIT_ATTRIBUTE_RENDERED = type => `rendered.view.edit.attribute.${type}`
