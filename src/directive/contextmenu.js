'use strict';

angular.module('io.dennis.contextmenu')
  .provider('$contextmenu', ContextmenuProvider)
  .directive('contextmenu', Contextmenu);

var config = {
  DEBOUNCE_BROADCAST_TIME: 200
};
var contextmenuConfig = new ContextmenuConfig();

function ContextmenuConfig() {
  this.set = function(key, value) {
    if (config[key]) {
      config[key] = value;
    }
    return config[key];
  };

  this.get = function(key) {
    return config[key];
  };
}

function ContextmenuProvider() {
  this.$get = function() {
    return contextmenuConfig;
  };
}

Contextmenu.$inject = [
  '$window',
  '$rootScope',
  'ContextmenuService'
];

var canBroadcast = true;
var broadcastClose;

function Contextmenu($window, $rootScope, $contextmenu) {

  broadcastClose = (function($rootScope) {
    return function _broadcastClose() {
      if (canBroadcast) {
        $rootScope.$broadcast('contextmenu.close');
        canBroadcast = false;
        setTimeout(function() {
          canBroadcast = true;
        }, config.DEBOUNCE_BROADCAST_TIME);
      }
    }
  })($rootScope);

  var $windowElement = angular.element($window);
  $windowElement.on('contextmenu scroll click', broadcastClose);

  return {
    scope: {
      contextmenu: '='
    },
    restrict: 'A',
    controller: ['$scope', '$window', '$rootScope', CotextmenuCtrl],
    link: link,
    priority: 100
  };


  function link(scope, element, attrs, ctrl) {
    scope.contextmenu = $contextmenu.$get();
    scope.contextmenu.setMenu(ctrl);
    ctrl.setElement(element);
  }
}

function CotextmenuCtrl($scope, $window, $rootScope) {
  console.log('init contextmenu ctrl');

  var pub = this;
  var $element;
  $scope.$on('contextmenu.close', close);

  pub.open = open;
  pub.close = close;
  pub.setElement = setElement;

  function open(item, x, y) {
    broadcastClose();
    $element.css({top: y, left: x})
      .toggleClass('dropup', isDropup(y))
      .toggleClass('open', true)
      .toggleClass('ng-hide', false);
  }

  function close() {
    $element.toggleClass('ng-hide', true);
  }

  function setElement(element) {
    $element = element;
  }

  function isDropup(y) {
    var mid = $window.innerHeight / 2;
    return (y > mid);
  }
}
