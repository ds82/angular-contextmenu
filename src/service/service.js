'use strict';

angular.module('io.dennis.contextmenu')
    .service('ContextmenuService', Contextmenu);

function Contextmenu() {
  var selected = [];
  var menu;

  return {
    menu: menu,
    selected: selected,

    setMenu: setMenu,
    add: add,
    remove: remove,
    isSelected: isSelected,
    get: get,
    num: getNumberOf,
    open: open,
    close: close,
    toggle: toggle,
    clear: clear,
    listOfIds: getListOfIds
  };

  function setMenu(ctrl) {
    menu = ctrl;
  }

  function add(entry) {
    if (!isSelected(entry)) {
      selected.unshift(entry);
      toggleSelected(entry.element, true);
    }
  }

  function remove(entry) {
    var index = selected.indexOf(entry);
    if (index > -1) {
      selected.splice(index, 1);
    }
    toggleSelected(entry.element, false);
  }

  function isSelected(entry) {
    return (selected.indexOf(entry) > -1);
  }

  function get() {
    return selected[0];
  }

  function getNumberOf() {
    return selected.length || 0;
  }

  function open(entry, x, y) {
    x = x || 0;
    y = y || 0;

    if (!isSelected(entry)) {
      clear();
    }
    add(entry);
    menu.open.apply(null, arguments);
  }

  function close() {
    menu.close.apply(null, arguments);
  }

  function toggle(entry, multi) {
    multi = multi || false;
    var isEntrySelected = isSelected(entry);

    if (isEntrySelected) {
      remove(entry);

    } else {

      if (!multi) { clear(); }
      add(entry);
    }
  }

  function clear() {
    angular.forEach(selected, function(entry) {
      toggleSelected(entry.element, false);
    });
    selected = [];
  }

  function getListOfIds(limit, path) {
    path = path || 'item.id';
    limit = Math.min(limit || selected.length, selected.length);
    var list = selected.slice(0, limit).map(function(entry) {
      return safeGet(entry, path, '');
    });
    var asString = list.join(', ');
    return (limit < selected.length) ? asString + '..' : asString;
  }

  function toggleSelected(element, forceState) {
    element.toggleClass('selected', forceState);
  }

  function safeGet(obj, path, _default) {

    if (!obj) {
      return _default;
    }

    if (!path || !String(path).length) {
      return obj;
    }

    var keys = (angular.isArray(path)) ? path : path.split('.');
    var next = keys.shift();
    return get(obj[next], keys, _default);
  }
}
