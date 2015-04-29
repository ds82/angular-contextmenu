'use strict';

var pointerEvents = 'contextmenu';

angular.module('io.dennis.contextmenu', [])
  .directive('contextmenu', Contextmenu)
  .directive('contextmenuContainer', ContextmenuContainer)
  .directive('contextmenuItem', ContextmenuItem);

Contextmenu.$inject = ['$parse'];
function Contextmenu($parse) {

  return {
    restrict: 'A',
    scope: false,
    controller: ContextmenuCtrl,
    link: function($scope, $element, $attrs, $ctrl) {
      $ctrl.$element = $element;
      $parse($attrs.contextmenu).assign($scope, $ctrl);
    }
  };
}

ContextmenuCtrl.$inject = ['$window'];
function ContextmenuCtrl(window) {
  var ctrl = this;
  var $window = angular.element(window);

  ctrl.$element = null;
  ctrl.$isOpen = false;

  ctrl.close = close;
  ctrl.open = open;

  function close() {
    ctrl.$element.toggleClass('open', false);
    ctrl.$isOpen = false;
  }

  function open(item, event) {

    ctrl.$item = item;

    var top = event.pageY - $window.scrollTop();
    ctrl.$element.css('left', event.pageX + 'px');
    ctrl.$element.css('top', top + 'px');
    ctrl.$element.toggleClass('open', true);
    ctrl.$isOpen = true;

    return ctrl.isOpen;
  }

  var closeEvents = pointerEvents + ' ' + 'click';
  $window.on(closeEvents, function() {
    if (ctrl.$isOpen) {
      ctrl.close();
    }
  });
}

ContextmenuContainer.$inject = ['$parse'];
function ContextmenuContainer($parse) {
  return {
    restrict: 'A',
    scope: false,
    controller: ['$scope', '$attrs', function($scope, $attrs) {
      return $parse($attrs.contextmenuContainer)($scope);
    }],
  };
}

ContextmenuItem.$inject = [];
function ContextmenuItem() {
  return {
    restrict: 'A',
    require: '^contextmenuContainer',
    scope: false,
    link: function($scope, $element, $attrs, contextMenuCtrl) {

      var iam = $scope[($attrs.contextmenuItem)];
      $element.on(pointerEvents, function(event) {
        $scope.$apply(function() {
          contextMenuCtrl.open(iam, event);
        });
        event.stopPropagation();
        return false;
      });
    }
  };
}
