'use strict';

angular.module('io.dennis.contextmenu')
.directive('contextmenuContainer', Container);

function Container() {
  return {
    scope: {
      contextmenu: '=contextmenuContainer'
    },
    restrict: 'A',
    controller: ['$scope', ContainerCtrl]
  };

}

function ContainerCtrl($scope) {
  var pub = this;
  pub.get = get;

  function get() {
    return $scope.contextmenu;
  }
}
