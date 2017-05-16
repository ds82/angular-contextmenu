'use strict';

describe('io.dennis.contextmenu', function() {
  var mock = angular.mock;
  var ae = angular.element;

  describe('directive:contextmenu', function() {
    var $injector, $compile, $rootScope;
    var $scope;
    var elementSpy;

    beforeEach(mock.module('io.dennis.contextmenu'));
    beforeEach(inject(function(_$injector_, _$compile_, _$rootScope_) {
      $injector = _$injector_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      var configService = $injector.get('$contextmenu');
      configService.set('DEBOUNCE_BROADCAST_TIME', 0);

      $scope = $rootScope.$new();
    }));

    describe('with angular.element() spy', function() {

      beforeEach(function() {
        elementSpy = spyOn(angular, 'element');
      });

      afterEach(function() {
        elementSpy.and.callThrough();
      });

      it('should register $window.(click|contextmenu|scroll)', function() {
        var $window = $injector.get('$window');
        var $windowElementStub = jasmine.createSpyObj('we', ['on']);

        var onEventFn;
        $windowElementStub.on.and.callFake(function(event, fn) {
          onEventFn = fn;
        });

        elementSpy.and.callFake(function(_element) {
          return (_element === $window) ?
            $windowElementStub : ae(_element);
        });

        var html = '<div contextmenu="menu"></div>';
        var element = angular.element(html);
        $compile(element)($scope);

        expect($windowElementStub.on).toHaveBeenCalledWith(
          'contextmenu scroll click', jasmine.any(Function)
        );

      });

      it('should broadcast contextmenu.close on <event>', function(done) {
        var $window = $injector.get('$window');
        var $windowElementStub = jasmine.createSpyObj('we', ['on']);

        $windowElementStub.on.and.callFake(onRegisterEvent);

        elementSpy.and.callFake(function(_element) {
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


    it('should be able to register two independant menus', function() {
      var html = '<div contextmenu="some.menu"></div>';
      html += '<div contextmenu="other.menu"></div>';

      var element = angular.element(html);
      $compile(element)($scope);

      $rootScope.$apply();
      expect($scope.some.menu).not.toEqual($scope.other.menu);
    });

    it('should close other menus before opening current', function(done) {
      var html = '<div contextmenu="some.menu"></div>';
      html += '<div contextmenu="other.menu"></div>';

      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      $rootScope.$apply();

      var first = ae(compiled['0']);
      var second = ae(compiled['1']);

      first.controller('contextmenu').open();

      setTimeout(function() {
        second.controller('contextmenu').open();

        expect(first.hasClass('ng-hide')).toEqual(true);
        done();
      }, 1);
    });

  });

});
