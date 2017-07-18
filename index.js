var app = angular.module('app', ['ngAnimate']);


app.directive('progressBar', function() {
    return {
        restrict: 'E',
        template: (`<div class="slice progress-bar" ng-if="progressBarAlive"></div>`),
        controller: function($scope, $timeout) {
            $scope.progressBarAlive = false
            $scope.$on('activateProgressBar', function(e) {
                console.log('hello')
                $scope.progressBarAlive = true;
            })
            $scope.$on('reset', function(e) {
                $scope.progressBarAlive = false;
            })
        }
    };
});

app.directive('inputField', function() {
    return {
        restrict: 'E',
        template: (`
            <label for="file-input" class="file-input-holder">
                <p>{{ getPath() }}</p>
                <input id="file-input" type="file" ng-click="onClick()" ng-focus="onFocus($event)" ng-model="_empty_"/>
                <label for="file-input">Browse</label>
            </label>
        `),
        controller: function($scope) {
            $scope.isOpened = false;
            $scope.path = null;

            $scope.onFocus = function(e) {
                paths = e.currentTarget.files;
                if ($scope.isOpened) {
                    $scope.isOpened = false;
                    $scope.path = paths.length ? paths[0].name : null;
                    $scope.path ? $scope.$broadcast('activateProgressBar') : $scope.$broadcast('generateMsg', ['File should be choosen', 'Warning'])
                }
            }
            $scope.onClick = () => ($scope.isOpened = true, $scope.path = $scope.default);
            $scope.getPath = () => $scope.path || 'Choose file...';
        }
    }
})

app.directive('fileInput', function() {
    return {
        restrict: 'E',
        template: (`
            <div>
                <header>File Browser:</header>
                <form>
                    <input-field></input-field>
                    <info-msgs></info-msgs>
                    <progress-bar></progress-bar>
                </form>
            </div>
        `)
    }
});


app.directive('infoMsgs', function() {
    return {
        restrict: 'E',
        template: `
            <ul class="info-msgs">
                <li class="info-msg" ng-click="onMessageClick($index)" ng-repeat="msg in messages track by $index">
                    <h2>{{msg.type}}</h2><p>{{msg.text}}</p>
                </li>
            </ul>
        `,
        controller: function($scope) {
            $scope.messages = [];
            $scope.$on('generateMsg', function(e, args) {
                $scope.generateMessage(args[0], args[1]);
                $scope.$broadcast('reset');
            })
            $scope.generateMessage = (text, type) => $scope.messages = [...$scope.messages, {type: type, text: text}];
            $scope.onMessageClick = (index) => $scope.messages = $scope.messages.filter((i, idx) => idx != index);
        }
    }
});
