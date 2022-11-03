import { Updatable, Statusable, Belongable, Listable } from './composition-units';

export function ChecklistItem(attributes) {
  const obj = Object.assign({ type: 'checklistItem' }, attributes);
  [Updatable, Statusable].forEach(compFn => compFn(obj));
  Belongable(obj, 'todoItem');

  return obj;
}

export function ChecklistItemsList(itemList) {
  const obj = { itemFactory: ChecklistItem, itemType: 'checklistItem' };
  Listable(obj, itemList);
  return obj;
}
