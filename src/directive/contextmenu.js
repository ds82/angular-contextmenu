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
  $windowElement.on('contextmenu scroll', broadcastClose);


  // only close contextmenu on window.click if not on firefox
  // due to bug #5
  // https://github.com/ds82/angular-contextmenu/issues/5
  //
  // TODO browser sniffing sucks :/
  if (!isFirefox()) {
    $windowElement.on('click', broadcastClose);
  }

  return {
    scope: {
      contextmenu: '='
    },
    restrict: 'A',
    controller: ['$scope', '$window', '$rootScope', CotextmenuCtrl],
    link: link,
    priority: 100
  };

  function broadcastClose() {
    $rootScope.$broadcast('contextmenu.close');
  }

  function link(scope, element, attrs, ctrl) {
    scope.contextmenu = $contextmenu.$get();
    scope.contextmenu.setMenu(ctrl);
    ctrl.setElement(element);
  }
}

function CotextmenuCtrl($scope, $window, $rootScope) {

  var pub = this;
  var $element;
  $scope.$on('contextmenu.close', close);

  pub.open = open;
  pub.close = close;
  pub.setElement = setElement;

  function open(item, x, y) {
    $rootScope.$broadcast('contextmenu.close');
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

function isFirefox() {
  return !!window.navigator.userAgent.match(/firefox/i);
}
