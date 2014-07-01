var app = angular.module('io.dennis.contextmenu', []);
var pointerEvents = 'contextmenu';

app.directive('contextmenu', ['$parse', function( $parse ) {
  
  var $window = angular.element( window );

  return {
    restrict: 'A',
    scope: false,
    controller: ['$scope', '$attrs', function( $scope, $attrs ) {
      var ctrl = {};

      ctrl.$element = null;
      ctrl.$isOpen = false;

      ctrl.close = function() {
        ctrl.$element.toggleClass( 'open', false );
        ctrl.$isOpen = false;
      };

      ctrl.open = function( item, event ) {

        ctrl.$item = item;

        var top = event.pageY - $window.scrollTop();
        ctrl.$element.css( 'left', event.pageX + 'px' );
        ctrl.$element.css( 'top', top + 'px' );
        ctrl.$element.toggleClass( 'open', true );
        ctrl.$isOpen = true;

        return ctrl.isOpen;
      };

      var closeEvents = pointerEvents + ' ' + 'click';
      $window.on( closeEvents, function() {
        if ( ctrl.$isOpen ) {
          ctrl.close();
        }
      });

      return ctrl;
    }],
    link: function( $scope, $element, $attrs, $ctrl ) {
      $ctrl.$element = $element;
      $parse( $attrs.contextmenu ).assign( $scope, $ctrl );
    }
  }
}]);

app.directive('contextmenuContainer', ['$parse', function( $parse ) {
  return {
    restrict: 'A',
    scope: false,
    controller: ['$scope', '$attrs', function( $scope, $attrs ) {
      return $parse( $attrs.contextmenuContainer )( $scope );
    }],
//    link: function( $scope, $element, $attrs ) {
//      
//    }
  }
}]);

app.directive('contextmenuItem', [function() {
  return {
    restrict: 'A',
    require: '^contextmenuContainer',
    scope: false,
    link: function( $scope, $element, $attrs, contextMenuCtrl ) {

      var iam = $scope[( $attrs.contextmenuItem )];
      $element.on( pointerEvents, function( event ) {
        $scope.$apply(function() {
          contextMenuCtrl.open( iam, event );
        });
        event.stopPropagation();
        return false;
      });
    }
  }
}]);
