console.log("I am Clicked!");
$.get("../app/app.html", function (data) {
    $("body").append(data);
});
