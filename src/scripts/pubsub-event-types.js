export const INITIALIZE = 'initialize';
export const DATA_INITIALIZED = 'dataInitialized';

export const BACK = 'back';
export const INDEX = type => `index.${type}`;
export const NEW = type => `new.${type}`;
export const CREATE = type => `create.${type}`;
export const SHOW = type => `show.${type}`;
export const DESTROY = type => `destroy.${type}`;

export const UPDATE = type => `update.${type}`;
export const UPDATE_STATUS = type => `update.${type}.status`;
export const UPDATE_PRIORITY = type => `update.${type}.priority`;

export const ANY_UPDATED = 'updated';
export const UPDATED = type => `updated.${type}`;
export const BELONG_UPDATED = type => `updated.${type}.belong`;
export const LIST_UPDATED = type => `updated.${type}.list`;

export const PAGE_RENDERED = 'rendered.page';
export const ANY_INDEX_RENDERED = 'rendered.index';
export const INDEX_RENDERED = type => `rendered.index.${type}`;
export const ANY_NEW_RENDERED = 'rendered.new';
export const NEW_RENDERED = type => `rendered.new.${type}`;
export const SHOW_RENDERED = type => `rendered.show.${type}`;
