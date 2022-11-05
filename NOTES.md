Composition Units
//-Prioritizable
  //-priorities private variable with array of priorities (low 0, medium 1, high 2)
  //-sub changeItemPriority, changePriority
  //-changePriority: priority = Math.max(Math.min(priority + data, 0), priorities.length - 1); pub type + updated

//-Statusable
  //-statuses private variable with array of statuses (0 incomplete, 1 complete)
  //-sub changeItemStatus, changeStatus
  //-changeStatus: status = (status + 1) % statuses.length; pub type + updated

//-Updatable
  //-sub update + type, updateAttrs(details of update)
  //-updateAttrs(details of update)
    //-return if item type and item id don't match the data
    -for each detail in update, set the attribute; pub type + 'updated' (if successful) or pub updateFailed with error message(s), item type + id, and failed attr (if failed)

//-Belongable
//-BelongUpdatable(belong type)
  //-sub update + 'belong type', updateBelong: pub type + 'BelongUpdated' with old and new parent ids

//-Collectionable(collection type)
  //-sub collectionType + ListChanged, updateCollectionItems: pub type + Changed?

//-Listable(type of item)
  //-array of items
  //-id assigner (don't use array index, as this will be messed up by deleted items)
  //-sub type + 'ParentChanged', pub type + 'ListChanged' with relevant parent types and parent indices
  //-sub create + 'type', make and set id, then pub type + 'ListChanged'
  //-sub delete + 'type', delete, then pub type + 'ListChanged'

Factories
//-ChecklistItem: id, title, statusable, updatable, belongable to todoItem id

//-ChecklistItemsList: Listable with item type of ChecklistItem

//-TodoItem: id, title, description, dueDate, notes, belongable to project id, belongUpdatable for project, prioritizable, statusable, updatable, collectionable with checklistItems

//TodoItemsList: Listable with item type of TodoItem

//-Project: id, title, collectionable with todoItems

//-ProjectsList: Listable with item type of Project

Modules
-application (index.js)
  //-initialize: pub initialize
  //-sub dataInitialized, populateData
  -sub any updated, emitData?
  -emitData: pub newData?

-PubSub event types (constants)

-storage
  //-sub initialize, initializeData
  -initializeData(storageProvider = localStorageProvider)
    -pub dataInitialized, storageData
  //-sub any updated, saveToStorage
  -saveToStorage(storageProvider = localStorageProvider)
    -update storageData

-localStorageProvider
  -deal with API details of localStorage

-DOMEvents
  //-sub indexProjectsRendered
    //-add new project button click: pub newProject
    //-delete project button click: pub deleteProject, type of 'project' + project id
    //-add new todo item button click: pub newTodoItem, project id = 0/default
    //-project button click: pub showProject, project id
  -sub showProjectRendered
    //-add new todo item button click: pub newTodoItem, project id
    //-delete todo item button click: pub deleteTodoItem, type of 'todoItem' + todoItemid
    //-all projects button click: pub indexProjects
    //-text (button) click: pub editText, type of item + item id + button class
    //-for each todo item:
      //-expand button click: pub showTodoItem, todoItem data
  -sub showTodoItemRendered
    -shrink button click: pub hideTodoItem, todoItem id
    -add new checklist item button click: pub newChecklistItem, todoItem id
    -delete checklist item button click: pub deleteChecklistItem, type of 'checklistItem' + checklistItemid
    -project select change: pub changeProject
    -change status button/checkbox click: pub changeItemStatus, item type + item id
    -change priority button click: pub changeItemPriority, item type + item id + button data-direction property (1 or -1)
     -text (button) click: pub editText, type of item + item id + button class
    -date (button) click: pub editDate
  -sub new(type)Rendered, other buttons (e.g. show new checklistItem input field) + submit button click: pub create(type), item type + item id + details of create
  -sub editInputRendered, enter key or update button click: pub update + type of item, item id + details of update

-views
  *todos and projects have datasets with type of item (todo or project) and id
  private renderingData variable -- export from application?

  //currPageView variable that changes with each new render -- this variable is a fn that calls the last applicable rendered page view function; default set to indexProjectsView

  -sub newData, updateData?, updateView
  -updateData?
    -update private data variable with new data?
  //-updateView
    //-re-render currPageView
  -sub updateFailed, renderError
    -render error message under relevant DOM dataset attribute

  //-sub indexProjects, indexProjectsView
  //-indexProjectsView
    //-render using renderData variable
    //-pub indexProjectsRendered
  //-sub newProject, newProjectView: pub newProjectRendered
  //-sub showProject, showProjectView(project)
  //-showProjectView(project)
    //-pub showProjectRendered, project id

  //-sub newTodoItem, newTodoItemView: pub newTodoItemRendered
  -sub showTodoItem, showTodoItemView(todoItem)
  -showTodoItemView(todoItem)
    -pub showTodoItemRendered, todoItem id
  -sub hideTodoItem, hideTodoItemView(todoItem)
  //-sub editText, editTextView
  //-sub editDate, editDateView
  //-editTextView(item id, type)
    //-pub editInputRendered, item type + id
  //-editDateView(item id, type)
    //-pub editInputRendered, item type + id
  -sub newChecklistItem, newChecklistItemView: pub newChecklistItemRendered (use replaceWith to replace the button -- and add a new button after)

  -getColors(array, color1, color2): split color range evenly and divide between number of items in array, return array items mapped to colors
