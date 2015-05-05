'use strict';

angular.module('io.dennis.contextmenu')
    .directive('contextmenu', Contextmenu);

Contextmenu.$inject = [
  '$window',
  '$rootScope',
  'ContextmenuService'
];

function Contextmenu($window, $rootScope, $contextmenu) {

  var $windowElement = angular.element($window);
  $windowElement.on('click contextmenu scroll', broadcastClose);

  return {
    scope: {
      contextmenu: '='
    },
    restrict: 'A',
    controller: CotextmenuCtrl,
    link: link,
    priority: 100
  };

  function broadcastClose() {
    $rootScope.$broadcast('contextmenu.close');
  }

  function link(scope, element, attrs, ctrl) {
    scope.contextmenu = $contextmenu;
    scope.contextmenu.setMenu(ctrl);
    ctrl.setElement(element);
  }
}

CotextmenuCtrl.$inject = ['$scope', '$window'];
function CotextmenuCtrl($scope, $window) {

  var pub = this;
  var $element;
  $scope.$on('contextmenu.close', close);

  pub.open = open;
  pub.close = close;
  pub.setElement = setElement;

  function open(item, x, y) {
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
