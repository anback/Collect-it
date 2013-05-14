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
        $.get('http://localhost:3000/api/card/template/' + encodeURIComponent(item.url), function(card) {
            console.log(card);
            dataSet[item.index].description = card.description;
            dataSet[item.index].thumbnail = card.page.screenShotUrl;

            $scope.tabs = Utils.getValues(dataSet);
            $scope.$digest()
        });
    });
}