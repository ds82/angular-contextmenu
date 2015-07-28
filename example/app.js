(function(window) {
  'use strict';

  angular.module('app', [
    'io.dennis.contextmenu'
  ]).controller('MainCtrl', Main);

  Main.$inject = [];
  function Main() {
    var vm = this;
    vm.DATA = window.DATA;
    vm.version = angular.version;
    vm.remove = remove;

    function remove(what) {
      window.alert('REMOVE ' + what);
    }
  }
})(window);
