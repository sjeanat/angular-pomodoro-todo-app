'use strict';

var pomodoroToDoApp = angular.module('pomodoroToDoApp', [
  'ngRoute',
  'pomodoroToDoAnimations',
  'pomodoroToDoControllers',
]);
pomodoroToDoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/todos', {
      templateUrl: 'partials/todos.html',
      controller: 'toDoCtrl'
    }).
    when('/pomodoros/:url', {
      templateUrl: 'partials/pomodoros.html',
      controller: 'toDoCtrl'
    }).
    otherwise({
      redirectTo: '/todos'
    });
  }
]);
