'use strict';

describe('io.dennis.contextmenu', function() {
  var mock = angular.mock;

  describe('directive:contextmenu', function() {
    var $injector, $compile, $rootScope;
    var $scope;

    beforeEach(mock.module('io.dennis.contextmenu'));
    beforeEach(inject(function(_$injector_, _$compile_, _$rootScope_) {
      $injector = _$injector_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
    }));

    it('should register $window.(click|contextmenu|scroll)', function() {
      var ae = angular.element;

      var $window = $injector.get('$window');
      var $windowElementStub = jasmine.createSpyObj('we', ['on']);

      var onEventFn;
      $windowElementStub.on.and.callFake(function(event, fn) {
        onEventFn = fn;
      });

      spyOn(angular, 'element').and.callFake(function(_element) {
        return (_element === $window) ?
          $windowElementStub : ae(_element);
      });

      var html = '<div contextmenu="menu"></div>';
      var element = angular.element(html);
      $compile(element)($scope);

      expect($windowElementStub.on).toHaveBeenCalledWith(
        'click contextmenu scroll', jasmine.any(Function)
      );

    });

    it('should broadcast contextmenu.close on <event>', function(done) {

      var ae = angular.element;

      var $window = $injector.get('$window');
      var $windowElementStub = jasmine.createSpyObj('we', ['on']);

      $windowElementStub.on.and.callFake(onRegisterEvent);

      spyOn(angular, 'element').and.callFake(function(_element) {
        return (_element === $window) ?
          $windowElementStub : ae(_element);
      });

      var broadcastSpy = spyOn($rootScope, '$broadcast');

      var html = '<div contextmenu="menu"></div>';
      var element = angular.element(html);
      $compile(element)($scope);

      function onRegisterEvent(event, fn) {
        fn();
        expect(broadcastSpy).toHaveBeenCalledWith('contextmenu.close');
        done();
      }

    });

  });

});
