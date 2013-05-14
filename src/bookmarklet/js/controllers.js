Utils.baseurl = 'http://localhost:3000';

function TabListCtrl($scope) {
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

            $scope.tabs = Utils.getValues(dataSet);
            $scope.$digest();
        });
    });
}

function BoardCtrl($scope, $http) {

    $http.get(Utils.baseurl + '/api/boards/my').success(function(data) {
        $scope.boards = [];

        data.forEach(function(item) {
            $scope.boards.push(item);
        });
        $scope.boards.push({name : '+ Create new board'});
    });


    $scope.boardSelected = function(){

        var selectedBoard = $('select[name=save_into_user_board]');
        var selectedBoardId = selectedBoard.val();

        if(selectedBoardId==="create-new-board")
        {
            $('#new-board-name').show();
            $('#newBoardForm input[name=new-board-name]').focus();
        }
    }
}