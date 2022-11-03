import { Updatable, Statusable, Prioritizable, Collectionable, Belongable, Listable } from './composition-units';

export function TodoItem(attributes) {
  const obj = Object.assign({ type: 'todoItem' }, attributes);
  [Updatable, Statusable, Prioritizable].forEach(compFn => compFn(obj));
  Belongable(obj, 'project');
  Collectionable(obj, 'checklistItem');

  return obj;
}

export function TodoItemsList(itemList) {
  const obj = { itemFactory: TodoItem, itemType: 'todoItem' };
  Listable(obj, itemList);
  return obj;
}
