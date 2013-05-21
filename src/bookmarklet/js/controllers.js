var myApp = angular.module('bookmarklet', []);

myApp.factory('Cards', function() {
    return {};
});

myApp.factory('SelectedBoardGroup', function() {
    return {};
});

Utils.baseurl = 'http://localhost:3000';

function TabListCtrl($scope, Cards) {

    $scope.cards = Cards;
    var data = JSON.parse(decodeURIComponent(location.search).substring(1));

    data = data.filter(function(item) {
        return  item.url.indexOf('chrome-extension://') == -1;
    });

    var i = 0;
    var dataSet = {};
    data.forEach(function(item) {
        dataSet[i] = {index : i, url : item.url, title : item.title, thumbnail : item.favIconUrl }
        i++;
    });

    $scope.tabs = Utils.getValues(dataSet);
    Utils.getValues(dataSet).forEach(function(item) {
        $.get(Utils.baseurl + '/api/card/template/' + encodeURIComponent(item.url), function(card) {
            dataSet[item.index].description = card.description;
            dataSet[item.index].thumbnail = card.page.screenShotUrl;
            dataSet[item.index].title = card.name || dataSet[item.index].title;

            $scope.tabs = Utils.getValues(dataSet);
            $scope.cards = $scope.tabs;

            console.log($scope.cards);
            $scope.$digest();
        });
    });

    $scope.toggleCard = function(tab) {
        $scope.cards = $scope.cards.filter(function(item) {
            item.index != tab.index;
        });
    }
}

function AddButtonCtrl($scope, $http, Cards, SelectedBoardGroup) {

    $scope.Save = function() {

        console.log(Cards);
        var cards = Cards.map(function(item) {
            item.board = SelectedBoardGroup.board._id;
            return item;
        });

        console.log(cards);
        $http.post(Utils.baseurl + '/api/cards', cards).success(function() {
            $("#close-bookmarklet-button").trigger('click');
        });
    }
}

function BoardCtrl($scope, $http, SelectedBoardGroup) {

    $scope.selectedBoardGroup = SelectedBoardGroup;

    $http.get(Utils.baseurl + '/api/boards/my').success(function(data) {
        $scope.boards = [];

        data.forEach(function(item) {
            $scope.boards.push(item);
        });
        $scope.boards.push({_id : "create-new-board", name : '+ Create new board'});

        $scope.selectedBoardGroup.board = $scope.boards[0];

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
            console.log($scope.selectedBoardGroup.board);
        }

        updateBoardSelect({id : "new-board", name : $scope.newBoardName});
        $scope.showNewBoardForm = false;

        $http.post(Utils.baseurl + '/api/boards', $scope.selectedBoardGroup.board).success(function(board) {
            updateBoardSelect(board);
        });
    }
}