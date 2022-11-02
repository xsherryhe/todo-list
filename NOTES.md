Composition Units
-Prioritizable
  -priorities private variable with array of priorities (low 0, medium 1, high 2)
  -sub changeTodoPriority, changePriority
  -changePriority: priority = Math.max(Math.min(priority + data, 0), priorities.length - 1); pub type + 'Changed'

-Statusable
  -statuses private variable with array of statuses (0 incomplete, 1 complete)
  -sub changeItemStatus, changeStatus
  -changeStatus: status = (status + 1) % statuses.length; pub type + 'Changed'

-Updatable
  -sub update + type, updateAttrs(details of update)
  -updateAttrs(details of update)
    -return if item type and item index don't match the data
    -for each detail in update, set the attribute; pub type + 'Changed' (if successful) or pub updateFailed with error message(s), item type + index, and failed attr (if failed)

-ParentChangeable(parent type)
  -sub change + 'parent type', changeParentIndex: pub type + 'Changed'

-Listable(type of item)
  -array of items
  -indexer (don't use array index, as this will be messed up by deleted items)
  -sub create + 'type', make and set index, then pub 'type' + Changed
  -sub delete + 'type', delete, then pub 'type' + Changed

Factories
-ChecklistItem: index, title, statusable, updatable, todoItem index

-ChecklistItemsList: Listable with item type of ChecklistItem

-TodoItem: index, title, description, dueDate, notes, prioritizable, statusable, updatable, project index, parentChangeable
  -checklistItems (initially populated from storage)
  -sub checklistItemChanged, update checklistItems variable: pub todoItemChanged

TodoItemsList: Listable with item type of TodoItem

-Project: index, title
  -todoItems (initially populated from storage)
  -sub todoItemChanged, update todoItems variable: pub projectChanged

-ProjectsList: Listable with item type of Project

-localStorageProvider
  -deal with API details of localStorage

Modules
-application (index.js)
  -initialize: pub initialize
  -sub dataInitialized, populateData
  -sub projectChanged, emitData
  -emitData: pub newData

-storage
  -sub initialize, initializeData
  -initializeData(storageProvider = localStorageProvider)
    -pub dataInitialized, storageData
  -sub newData, saveToStorage
  -saveToStorage(storageProvider = localStorageProvider)
    -update storageData

-DOMEvents
  -sub indexProjectsRendered
    -add new project button click: pub newProject
    -delete project button click: pub deleteProject, type of 'project' + project index
    -add new todo item button click: pub newTodoItem, project index = 0/default
    -project button click: pub showProject, project index
    -text (button) click: pub editText, type of item + item index + button class
  -sub showProjectRendered
    -add new todo item button click: pub newTodoItem, project index
    -delete todo item button click: pub deleteTodoItem, type of 'todoItem' + todoItemIndex
    -all projects button click: pub indexProjects
    -text (button) click: pub editText, type of item + item index + button class
    -for each todo item:
      -expand button click: pub showTodoItem, todoItem data
      -shrink button click: pub hideTodoItem, todoItem index
  -sub showTodoItemRendered
    -add new checklist item button click: pub newChecklistItem, todoItem index
    -delete checklist item button click: pub deleteChecklistItem, type of 'checklistItem' + checklistItemIndex
    -project select change: pub changeProject
    -change status button/checkbox click: pub changeItemStatus, item type + item index
    -change priority button click: pub changeItemPriority, item type + item index + button data-direction property (1 or -1)
     -text (button) click: pub editText, type of item + item index + button class
    -date (button) click: pub editDate
  -sub new(type)Rendered, other buttons (e.g. show new checklistItem input field) + submit button click: pub create(type), item type + item index + details of create
  -sub editInputRendered, enter key or update button click: pub update + type of item, item index + details of update

-views
  *todos and projects have datasets with type of item (todo or project) and index
  private renderingData variable
  currPageView variable that changes with each new render -- this variable is a fn that calls the last applicable rendered page view function; default set to indexProjectsView

  -sub newData, updateData, updateView
  -updateData
    -update private data variable with new data
  -updateView
    -re-render currPageView
  -sub updateFailed, renderError
    -render error message under relevant DOM dataset attribute

  -sub indexProjects, indexProjectsView
  -indexProjectsView
    -render using private data variable
    -pub indexProjectsRendered
  -sub newProject, newProjectView: pub newProjectRendered
  -sub showProject, showProjectView(project)
  -showProjectView(project)
    -pub showProjectRendered, project index

  -sub newTodoItem, newTodoItemView: pub newTodoItemRendered
  -sub showTodoItem, showTodoItemView(todoItem)
  -showTodoItemView(todoItem)
    -pub showTodoItemRendered, todoItem index
  -sub hideTodoItem, hideTodoItemView(todoItem)
  -sub editText, editTextView
  -sub editDate, editDateView
  -editTextView(item index, type)
    -pub editInputRendered, item type + index
  -editDateView(item index, type)
    -pub editInputRendered, item type + index
  -sub newChecklistItem, newChecklistItemView: pub newChecklistItemRendered

  -getColors(array, color1, color2): split color range evenly and divide between number of items in array, return array items mapped to colors
