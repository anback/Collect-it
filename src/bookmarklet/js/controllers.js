var myApp = angular.module('bookmarklet', []);

myApp.factory('Cards', function() {
    return {};
});

myApp.factory('SelectedBoardGroup', function() {
    return {};
});

Utils.baseurl = 'http://localhost:3000';

function TabListCtrl($scope, $rootScope) {
    var data = JSON.parse(decodeURIComponent(location.search).substring(1));

    data = data.filter(function(item) {
        return  item.url.indexOf('chrome-extension://') == -1;
    });

    var i = 0;
    var dataSet = {};
    data.forEach(function(item) {
        dataSet[i] = {index : i, origin : item.url, name : item.title}
        i++;
    });

    $scope.tabs = Utils.getValues(dataSet);
    Utils.getValues(dataSet).forEach(function(item) {
        $.get(Utils.baseurl + '/api/card/template/' + encodeURIComponent(item.origin), function(card) {
            console.log(card);

            if(!card.name)
                card.name = dataSet[item.index].name;
            card.isChosen = true;
            dataSet[item.index] = card;

            $scope.tabs = Utils.getValues(dataSet);
            $rootScope.cards = $scope.tabs;
            console.log($rootScope.cards);
            $scope.$digest();
        });
    });

    $scope.toggleCard = function(tab) {
        $scope.tabs = $scope.tabs.map(function(item) {
            if(item._id == tab._id)
                item.isChosen = !item.isChosen;
            return item;
        });
        $rootScope.cards = $scope.tabs;
    }
}

function AddButtonCtrl($scope, $http, $rootScope) {

    $scope.Save = function() {

        var cards = $rootScope.cards.filter(function(item) {
            return item.isChosen;
        });

        cards = cards.map(function(item) {
            item.board = $rootScope.selectedBoardGroup.board._id;
            return item;
        });

        console.log(cards);


        $http.post(Utils.baseurl + '/api/cards', cards).success(function() {
            $("#close-bookmarklet-button").trigger('click');
        });
    }
}

function BoardCtrl($scope, $http, $rootScope) {

    $http.get(Utils.baseurl + '/api/boards/my').success(function(data) {
        $scope.boards = [];
        $scope.selectedBoardGroup = {};
        $rootScope.selectedBoardGroup = {};

        data.forEach(function(item) {
            $scope.boards.push(item);
        });
        $scope.boards.push({_id : "create-new-board", name : '+ Create new board'});

        $scope.selectedBoardGroup.board = $scope.boards[0];
        $rootScope.selectedBoardGroup.board = $scope.selectedBoardGroup.board;

        $scope.$watch('selectedBoardGroup.board', function() {

            if($scope.selectedBoardGroup.board._id==="create-new-board")
                $scope.showNewBoardForm = true;;
        });
    });

    $scope.createBoard = function() {

        var updateBoardSelect = function(board) {
            $scope.boards.pop();
            $scope.boards.push(board);
            $scope.selectedBoardGroup.board = $scope.boards[$scope.boards.length - 1];
            $rootScope.selectedBoardGroup.board = $scope.selectedBoardGroup.board;

            console.log($scope.selectedBoardGroup.board);
        }

        updateBoardSelect({id : "new-board", name : $scope.newBoardName});
        $scope.showNewBoardForm = false;

        $http.post(Utils.baseurl + '/api/boards', $scope.selectedBoardGroup.board).success(function(board) {
            updateBoardSelect(board);
        });
    }
}