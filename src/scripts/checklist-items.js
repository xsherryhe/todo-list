import { Validatable, PresenceValidatable, Updatable, Statusable, Belongable, Listable } from './composition-units';

export function ChecklistItem(attributes) {
  const obj = Object.assign({ type: 'checklistItem' }, attributes);
  [Validatable, Updatable, Statusable].forEach(compFn => compFn(obj));
  PresenceValidatable(obj, ['title']);
  Belongable(obj, 'todoItem');

  return obj;
}

export function ChecklistItemsList(rawItemList) {
  const obj = { itemFactory: ChecklistItem, itemType: 'checklistItem' };
  Listable(obj, rawItemList);
  return obj;
}
