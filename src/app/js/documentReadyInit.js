
$(document).ready(function() {


    if (typeof($.reject) !== 'undefined') {
        $.reject({
            reject: {
                msie: true, // Microsoft Internet Explorer
                opera: true, // Opera
                konqueror: true, // Konqueror (Linux)
                unknown: true // Everything else
            }
        }); // Customized Browsers
    }

    /*tooltip*/
    // Match all <A/> links with a title tag and use it as the content (default).
    $('a[title]').qtip({
            position: {
                my: 'bottom center',
                at: 'top center',
                adjust: {
                    y: -3
                }
            },
            style: {
                //classes: '...',
                tip: {
                    width: 10,
                    height: 5
                }
            }
        }
    );


    $('.Blue-button').click(function() {
        $('#inviteMe').fadeIn('fast');
        mixpanel.track("Request invite");
    });
    $('.close-inviteMe,#inviteMe-modal').click(function() {
        $('#inviteMe').hide();
    });




    /* Bookmarklet and What is Arble guide */



    $('.get-started').click(function() {
        $('#bookmarklet-install-modal').fadeIn('fast');
    });
    $('.close-guide').click(function() {
        $('#bookmarklet-install-modal').hide();
        $('#what-is-arble-modal').hide();
    }); 
    $('#what-is-arble').click(function() {
        $('#what-is-arble-modal').show();
        $('#bookmarklet-install-modal').fadeOut('fast');

    });    
    $('#get-started-link').click(function() {
        $('#bookmarklet-install-modal').show();
        $('#what-is-arble-modal').fadeOut('fast');

    });

    $('#invite-user-menu').click(function() {
        $('#invite-user').show();
    });
    $('.close-invite-user,#invite-user-modal').click(function() {
        $('#invite-user').hide();
    });

    $('#add-link-global-menu').click(function(event) {

        event.preventDefault();
        event.stopPropagation();

        var modalDimentions = {
                width: 850,
                height: 580
        };
        var modalPosition = {
            left: window.innerWidth / 2 - modalDimentions.width / 2,
            top: 75 + window.scrollY
        };

        var closeButtonLeft = modalPosition.left + modalDimentions.width - 58;
        var loadingIconLeft = closeButtonLeft - 100;

        var addLinkElement = $('#add-link-global');
        addLinkElement.css('left', modalPosition.left);
        //addLinkElement.css('top', modalPosition.top);

        $('input[name=link]', addLinkElement).val('');
        addLinkElement.show();
        $('input[name=link]', addLinkElement).focus();
    });
    $('#add-link-global .close').click(function() {
        $('#add-link-global').hide();
        $('#add-link-global .loading').hide();
    });

    window.addEventListener("message", function (message) {

        if (message.data === "collectably.bookmarklet.loaded") {
            $('#add-link-global').hide();
            $('#add-link-global .loading').hide();
        }
    })



    $('#add-link-global-form').submit(function() {
        // Show the loading spinner
        $('#add-link-global .loading').show();

        var url = $('input[name=link]', $(this)).val();

        // TODO: Add validation on URL
        var windowLocation = window.location;
        var environment = "";
        if (windowLocation.hostname === "localhost") {
            environment = "dev";
        } else if (windowLocation.hostname === "secret-sierra-3406.herokuapp.com") {
            environment = "staging";
        } else if (windowLocation.hostname === "afternoon-brook-2137.herokuapp.com") {
            environment = "collaborate";
        }


        (function(){
            var el=document.createElement("script");
            var t=(new Date).getTime();
            t-t%(60*1E3);
            el.setAttribute("charset","UTF-8");el.setAttribute("type","text/javascript");
            el.setAttribute("src","/javascripts/arble/clipper/bookmarkletmodal.js?t="+t);
            document.body.appendChild(el);

            if (environment !== "") {
                collectablyEnvironment=environment;
            }

            collectablyUrlToAdd=url;
        })();

        //$('#add-link-global').hide();
        return false;
    });





    $('#invite-form').submit(function(event) {
        var srcElement = $(event.srcElement);
        event.preventDefault();
        event.stopPropagation();

        var friendsEmail = $("#inviteUser").val();
        var serializedFormData = { email: friendsEmail};

        console.log("SUBMIT");

        var url = "/api/user/invite/"; // the script where you handle the form input.

        $.ajax({
            type: "POST",
            url: url,
            data: serializedFormData, // serializes the form's elements.
            success: function(data)
            {
                mixpanel.track("Invited User");
                $('#invite-user').hide();
            },
            error: function(error) {
                console.log("error");
            }
        });

        return false; // avoid to execute the actual submit of the form.
    });



            /*live is used to put the function on things created after page load*/
    $('#share-this-collectably').live("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('#share-this-modal').show();
    });

    $('.addLinksBoardHelp').live("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        window.open("http://youtu.be/HGeXc12XSi8?t=45s", "_blank");
    });




    $('#share-this-modal').live("click", function(event) {
        var srcElement = $(event.srcElement);
        event.preventDefault();
        event.stopPropagation();
        if (srcElement.attr('id') == 'share-email-submit') {
            //var serializedFormData = $("#email-share-form").serialize()
            var friendsEmail = $("#shareEmailFriendEmail").val();
            var myName = $("#shareEmailMyName").val()
            var serializedFormData = { email: friendsEmail, myName: myName };

            console.log("SUBMIT");

            var url = "/api/board/share/email/" + BOARD_ID; // the script where you handle the form input.

            $.ajax({
                type: "POST",
                url: url,
                data: serializedFormData, // serializes the form's elements.
                success: function(data)
                {
                    mixpanel.track("Shared via email", {mp_note: BOARD_ID});
                    $('#share-this-modal').hide();
                },
                error: function(error) {
                    console.log("error");
                }
            });

            return false; // avoid to execute the actual submit of the form.


        } else if (srcElement.attr('id') == 'shareEmailFriendEmail' || srcElement.attr('id') == 'shareEmailMyName') {
            console.log("FRIENDINPUT");
        } else {

            //$('#share-this-modal').hide();
        }
    });
    $('#close-share-this').live("click", function(event) {
        $('#share-this-modal').hide();
    });


    $('a.invite-box,.invite-box').live("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('#inviteMe').show();
    });

    $('#mc-embedded-subscribe').live("click", function() {
        var signupEmail = $('#mce-EMAIL').val();

        // This sends us an event every time a user clicks the button
        mixpanel.track("Request invite button clicked", { mp_note: signupEmail});
    });

    $('.cardDropArea a').live("click", function() {
        window.location = "/introduction/button?ref=ms/" + BOARD_ID;
        return false;
    });

    $('.follow-this-board').live("click", function(event) {

        var boardId = $(this).attr('data');

        var followButton = $(this);
        if (followButton.hasClass('follow')) {
            followButton.removeClass('follow');
            followButton.addClass('unfollow');
            followButton.html('Unfollow');
        } else {
            followButton.removeClass('unfollow');
            followButton.addClass('follow');
            followButton.html('Follow');
        }


        if (boardId != undefined && boardId != null && boardId !== "") {
            var url = "/api/board/follow/" + boardId; // the script where you handle the form input.

            $.ajax({
                type: "GET",
                url: url,
                success: function(data)
                {
                    arble.Widgets.flashOkMessage("Followed");
                    self._toggleFollowing();
                },
                error: function(error) {
                    //arble.Widgets.flashOkMessage("Please sign up!");
                    $('.Blue-button').click();
                }
            });
        }

        return false;
    });



    // Forgot password
    $('#forgot-password-link').click(function() {
        $('#forgot-password-modal').show();
    });
    $('.close-forgot-password').click(function() {
        $('#forgot-password-modal').hide();
    });



    $("#copy-board .user-unknown").live("click", function(){

        $("#sign-up-copy-board").show();

        var signupForm = $("#signup-form");

        // Attach a listener for the submit event
        signupForm.submit(function(event) {
            var srcElement = $(event.srcElement);
            event.preventDefault();
            event.stopPropagation();

            /*var serializedFormData = $("#signup-form").serialize()*/

            var fullName = $("input[name=fullName]", signupForm).val();
            var email = $("input[name=email]", signupForm).val();
            var password = $("input[name=password]", signupForm).val();
            var serializedFormData = { fullName: fullName, email: email, password: password, copyboard: BOARD_ID };

            var url = "/api/user/signup"; // the script where you handle the form input.

            $.ajax({
                type: "POST",
                url: url,
                data: serializedFormData, // serializes the form's elements.
                success: function(data)
                {
                    //mixpanel.track("Shared via email", {mp_note: BOARD_ID});

                    // Send mixpanel event

                    window.location = '/autologin?username=' + email + '&password=' + password + '&copyboard=/ms/' + data.createdBoard._id;
                    //$('#share-this-modal').hide();
                },
                error: function(error) {
                    console.log("error");
                }
            });

            return false;

        });
    });
    

    var setDarkerHeader = function() {
    $('#header').addClass('darker-header');
    $('body').addClass('white-bg');
    
    }
    var removeDarkerHeader = function() {
    $('#header').removeClass('darker-header');
    $('body').removeClass('white-bg');
    }
    
    if($('#cardFeedContainer').is(':visible')) {
    setDarkerHeader();
    }

    $('.show-video-concept-modal').click(function(event) {
        event.stopPropagation();
        event.preventDefault();

        var modalElement = $('#video-concept-modal');

        var videoPlayer = $('<iframe width="560" height="315" src="http://www.youtube.com/embed/HGeXc12XSi8?hd=1&amp;autoplay=1&amp;rel=0" frameborder="0" allowfullscreen="1"></iframe>');
        modalElement.append(videoPlayer);

        $('#video-concept-modal').modal({});


    });

    $('.modal-backdrop').live('click', function(event, modal) {
        $('#video-concept-modal iframe').remove();
    });





    return false;
});


