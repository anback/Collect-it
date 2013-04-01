var arble = arble || {};

/**
 * @namespace Arble tree module namespace.
 */
arble.Widgets = (function(widget) {

    widget.flashOkMessage = function(message) {
        var messageContainer = $('#ok-message-container');
        messageContainer.html(message);

        messageContainer.fadeIn('slow').delay(800).fadeOut('slow');
    };

    widget.showLoadingPane = function() {
        $('#loading-message').show();
    };

    widget.hideLoadingPane = function() {
        $('#loading-message').hide();
    };

    return widget;
})(arble.Widgets || {});



