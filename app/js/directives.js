'use strict';

pomodoroToDoApp.directive('editInPlace', function() {
  return {
    restrict: 'E',
    scope: {
      value: '=',
      data: '=info'
    },
    template: '<span class="todoName" ng-dblclick="edit()" ng-bind="value"></span><input class="todoField" ng-model="value"></input>',
    link: function($scope, element, attrs) {
      var inputElement = angular.element(element.children()[1]);

      element.addClass('edit-in-place');

      $scope.editing = false;

      $scope.edit = function() {
        $scope.editing = true;

        element.addClass('active');

        inputElement.focus();
      };

      inputElement.on("blur", function() {
        $scope.editing = false;
        element.removeClass('active');
      });

    }
  };
});
