function TabListCtrl($scope) {
    var data = JSON.parse(decodeURIComponent(location.search).substring(1));
    $scope.tabs = data;
}