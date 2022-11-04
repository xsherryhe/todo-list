import { Updatable, Statusable, Prioritizable, Collectionable, Belongable, Listable, BelongUpdatable } from './composition-units';

export function TodoItem(attributes) {
  const obj = Object.assign({ type: 'todoItem' }, attributes);
  [Updatable, Statusable, Prioritizable].forEach(compFn => compFn(obj));
  [Belongable, BelongUpdatable].forEach(compFn => compFn(obj, 'project'));
  Collectionable(obj, 'checklistItem');

  return obj;
}

export function TodoItemsList(rawItemList) {
  const obj = { itemFactory: TodoItem, itemType: 'todoItem' };
  Listable(obj, rawItemList);
  return obj;
}
