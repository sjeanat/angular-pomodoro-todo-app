'use strict';

var pomodoroToDoControllers = angular.module('pomodoroToDoControllers', []);

pomodoroToDoControllers.controller('toDoCtrl', ['$scope', '$location', '$interval', function($scope, $location, $interval) {
    $scope.saved = localStorage.getItem('todos');

    if (localStorage.getItem('todos')) {
      $scope.todos = JSON.parse($scope.saved);
    } else {
      $scope.todos = [{
        task: 'Make AngularJS Todo App',
        complete: false,
        url: 'Make-AngularJS-Todo-App',
        pomodoros: ['25:00', '10:29', '00:04']
      }];
    }

    localStorage.setItem('todos', JSON.stringify($scope.todos));

    $scope.addTodo = function() {
      var duplicate = false;
      if ($scope.todoEntered) {
        for (var i in $scope.todos) {
          if ($scope.todos[i]["task"] == $scope.todoEntered) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          var spaceless = $scope.todoEntered.split(' ').join('-');
          $scope.todos.push({
            task: $scope.todoEntered,
            complete: false,
            url: spaceless,
            pomodoros: []
          });
          $scope.todoEntered = '';
          localStorage.setItem('todos', JSON.stringify($scope.todos));
        }
      }
    };

    $scope.removeComplete = function() {
      $scope.todos = $scope.todos.filter(function(todo) {
        return !todo.complete;
      });
      localStorage.setItem('todos', JSON.stringify($scope.todos));
    };

    $scope.updateComplete = function() {
      for (var i in $scope.todos) {
        var task = $scope.todos[i]["task"];
        var spaceless = task.split(' ').join('-');
        $scope.todos[i]["url"] = spaceless;
      }
      localStorage.setItem('todos', JSON.stringify($scope.todos));
    };

    $scope.timeLength = "";

    $scope.pomodoroList = function() {
      var url = $location.path().split("/")[2];
      var pomodoros = "";
      for (var i in $scope.todos) {
        if ($scope.todos[i]["url"] == url) {
          $scope.taskName = $scope.todos[i]["task"];
          $scope.pomodoros = $scope.todos[i]["pomodoros"];
        }
      }
    }

    $scope.newPomodoro = function() {
      $scope.pomodoros.push("25:00");
      localStorage.setItem('todos', JSON.stringify($scope.todos));
    }

    $scope.timeRemaining = $scope.timeLength;
    $scope.green = '100%';
    $scope.red = '0%';
    $scope.startTime = $scope.timeLength;
    var runTimer = false;

    function timerUnits(d) {
      d = Number(d);
      var min = Math.floor(d % 3600 / 60);
      var sec = Math.floor(d % 3600 % 60);
      var time = "";
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      time = min + ":" + sec;
      return time;
    }

    var index;
    var pomodoros;
    
    $scope.setTimer = function(pomodoro, pomodoroIndex, pomodorosArray) {
      if (pomodoro == "00:00") {
        $scope.timeRemaining = pomodoro;
        $scope.timerCompleted = "Timer Completed!";
        $('#play').addClass('hide');
        $('#addPomodoro').removeAttr('disabled');
        $('#addPomodoro').removeClass('disabled');
        $('#back').removeAttr('disabled');
        $('#back').removeClass('disabled');
        $('#backLink').attr('href', '#/todos');
      } else {
        $scope.timeRemaining = pomodoro;
        $scope.timerCompleted = "";
        index = pomodoroIndex;
        pomodoros = pomodorosArray;
        $('#play').removeClass('hide');
        $('#addPomodoro').removeClass('disabeld');
        $('#addPomodoro').removeAttr('disabeld');
        $('#back').removeClass('disabled');
        $('#back').removeAttr('disabled');
        $('#backLink').attr('href', '#/todos');
      }
    }

    var secs;
    var audio = $('#alarm')[0];

    $scope.toggleTimer = function() {
      $scope.timeLength = $scope.timeRemaining;
      if (!runTimer) {
        $('#addPomodoro').addClass('disabled');
        $('#addPomodoro').attr('disabled', 'disabeld');
        $('#back').addClass('disabled');
        $('#back').attr('disabled', 'disabeld');
        $('.times').addClass('disabled');
        $('.times').attr('disabled', 'disabled');
        $('#backLink').removeAttr('href');
        var splitTime = $scope.timeLength.split(":");
        secs = splitTime[0] * 60 + splitTime[1] * 1;
        updateTimer();
        runTimer = $interval(updateTimer, 1000);
      } else {
        $('.times').removeAttr('disabled');
        $('.times').removeClass('disabled');
        $('#addPomodoro').removeAttr('disabled');
        $('#addPomodoro').removeClass('disabled');
        $('#back').removeAttr('disabled');
        $('#back').removeClass('disabled');
        $('#backLink').attr('href', '#/todos');
        $interval.cancel(runTimer);
        runTimer = false;
        $scope.pomodoros[index] = $scope.timeRemaining;
        localStorage.setItem('todos', JSON.stringify($scope.todos));
      }
    }

    $scope.stop = function() {
      $('.times').removeAttr('disabled');
      $('.times').removeClass('disabled');
      $('#addPomodoro').removeClass('disabled');
      $('#addPomodoro').removeAttr('disabled');
      $('#back').removeClass('disabled');
      $('#back').removeAttr('disabled');
      $('#backLink').attr('href', '#/todos');
      $('#stop').addClass('hide');
      $('#play').addClass('hide');
      audio.pause();
    }

    function updateTimer() {
      secs -= 1;
      if (secs == -1) {
        audio.play();
        $('.times').attr('disabled', 'disabled');
        $('.times').addClass('disabled');
        $('#play').addClass('hide');
        $('#stop').removeClass('hide');
        $scope.pomodoros[index] = $scope.timeRemaining;
        localStorage.setItem('todos', JSON.stringify($scope.todos));
        $scope.timerCompleted = "Timer Completed!";
      } else if (secs >= 0) {
        $scope.timeRemaining = timerUnits(secs);
        var denominator = 1500;
        var percentage = Math.floor(Math.abs((secs / denominator) * 100 -
          100));
        $scope.red = percentage + '%';
        $scope.green = (100 - percentage) + '%';
        var circle = document.getElementsByTagName("circle")[0];
        circle.style.fill = "rgb(" + $scope.red + ", " + $scope.green +
          ", 0%)";
      }
    }
  }
]);
