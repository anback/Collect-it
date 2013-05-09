var Bookmarklet = {
    boardHtmlSnippet : function(value, name) {return '<option value="' + value + '">' + name + '</option>'},
    checkKeyInput: function(event) {
        // If event is enter
        if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();

            if ($('#newBoardForm input[name=new-sheet-name]').is(":visible") ) {
                this.confirmNewBoardName();
            } else if ($('#newGroupForm input[name=new-sheet-name]').is(":visible") ) {
                this.confirmNewGroupName();
            }
        }
    },
    boardSelected: function(){
        var selectedBoard = $('select[name=save_into_user_board]');
        var selectedBoardId = selectedBoard.val();


        // We want to
        if(selectedBoardId==="create-new-board")
        {
            $('#new-board-name').show();
            $('#newBoardForm input[name=new-board-name]').focus();
        } else {

            var res = "";
            var sheetsAttachedToBoard = collectablyBoardSheets[selectedBoardId].groups;
            if (sheetsAttachedToBoard != null &&  sheetsAttachedToBoard != undefined) {
                sheetsAttachedToBoard.map(function(item) {
                    res = res + '<option value="' + item._id + '">' + item.name + '</option>'
                });
            }
            $('select[name=save_into_user_sheet]', this.$el).html(res);
        }
    },
    confirmNewBoardName : function() {
        $('#new-board-name').hide();


        var boards = $('select[name=save_into_user_board] option').length;
        $($('select[name=save_into_user_board] option')[boards - 1]).html($('#newBoardForm input[name=new-board-name]').val());
        $($('select[name=save_into_user_board] option')[boards - 1]).attr("selected", "selected");

        var newGroupName = $('#newBoardForm input[name=new-sheet-name]').val();
        Bookmarklet._addNewGroupNameToOption(newGroupName);
    },
    cancelNewBoardName : function() {

        $('#newBoardForm input[name=new-board-name]').val('');
        $('#newBoardForm input[name=new-sheet-name]').val('');

        var selectOptions = $('select[name=save_into_user_board] option');
        selectOptions.removeAttr("selected");

        $(selectOptions[0]).attr("selected", "selected");



        $('#new-board-name').hide();


    },

    groupSelected : function() {
        var selectedSheet = $('select[name=save_into_user_sheet]').val();

        if(selectedSheet==="new-sheet" && $("select[name=save_into_user_sheet] option[value=new-sheet]").html() == "+ Create new group")
        {
            $('#new-sheet-name').show();
            $('#newGroupForm input[name=new-sheet-name]').focus();
        }
    },

    confirmNewGroupName : function() {

        var newGroupName = $('#newGroupForm input[name=new-sheet-name]').val();
        Bookmarklet._addNewGroupNameToOption(newGroupName);

        $('#new-sheet-name').hide();

    },
    cancelNewGroupName : function() {

        $('#newGroupForm input[name=new-sheet-name]').val('');

        var selectOptions = $('select[name=save_into_user_sheet] option');
        selectOptions.removeAttr("selected");

        $(selectOptions[0]).attr("selected", "selected");
        $('#new-sheet-name').hide();
    },

    _addNewGroupNameToOption: function(newGroupName) {
        var selectOptions = $('select[name=save_into_user_sheet] option');
        selectOptions.removeAttr("selected");
        var numberOfGroupsInSelectedBoard = selectOptions.length;
        $(selectOptions[numberOfGroupsInSelectedBoard - 1]).html(newGroupName);
        $(selectOptions[numberOfGroupsInSelectedBoard - 1]).attr("selected", "true");
    },

    findImages : function() {
        var res = $(document.images).toArray();

        // Filter only the ones who are higher than 50 px
        res = res.filter(function(item) {
            return item.offsetHeight > 50;
        });

        // Sort the images
        return res.sort(function(a,b) {
            return a.offsetHeight < b.offsetHeight ? 1 : -1;
        });
    }
}

var collectablyBoardSheets = {
    "51544e0aa9e5910200000008" : {
        name : "Chrome extension for Collectably",
        groups : [
            {   _id : "51544e0aa9e5910200000007",
                name :"Gettings Started"
            },
            {   _id : "51544f85a9e591020000000b",
                name :"Permissions"
            },
            {   _id : "515451b50499140200000013",
                name :"Fancy Settings"
            }
        ]
    },
    "51544e0aa9e5910200000009" : {
        name : "Chrome for Collectably",
        groups : [
            {   _id : "51544e0aa9e5910200000007",
                name :"Gettings Started"
            },
            {   _id : "51544f85a9e591020000000b",
                name :"Permissions"
            },
            {   _id : "515451b50499140200000013",
                name :"Fancy Settings"
            }
        ]
    }    
};


$(document).ready(function() {

    // Add listeners
    $("select[name=save_into_user_board]").change(Bookmarklet.boardSelected);
    $("select[name=save_into_user_sheet]").change(Bookmarklet.groupSelected);
    $("#ok-new-board-name").click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        Bookmarklet.confirmNewBoardName();
    });
    $("#ok-new-group-name").click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        Bookmarklet.confirmNewGroupName();
    });
    $("#cancel-new-board-name").click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        Bookmarklet.cancelNewBoardName();
    });
    $("#cancel-new-group-name").click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        Bookmarklet.cancelNewGroupName();
    });

    $("#bookmarkpageRadio").click(function() {
        $("#bookmarkimageRadio").removeAttr('checked');

        $(".images-pane").removeClass("block");
        $(".page-pane").removeClass("hide");

        $(".images-pane").addClass("hide");
        $(".page-pane").addClass("block");
    });
    $("#bookmarkimageRadio").click(function() {
        $("#bookmarkpageRadio").removeAttr('checked');

        $(".page-pane").removeClass("block");
        $(".images-pane").removeClass("hide");

        $(".page-pane").addClass("hide");
        $(".images-pane").addClass("block");
    });

    $("#close-bookmarklet-button").click(function () {
        window.parent.postMessage("collectably.bookmarklet.close", "*");
    });

    $(".mini-thumbs-scroll-pic a img").click(function() {
        $(".chosenPhoto img").attr('src',$(this).attr('src'));
    });


    $("#submitBookmark").click(function() {

        var selectedBoards = $("select[name=save_into_user_board] option[selected=selected]");
        var selectedBoard;
        if(selectedBoards.length == 0)
            selectedBoard = $("select[name=save_into_user_board] option").first();
        else
            selectedBoard = $("select[name=save_into_user_board] option[selected=selected]").first();

        console.log("SelectedBoard: " + selectedBoard.html())
        $.ajax({
            type: "POST",
            url: "http://localhost:4000/demoforstingday",
            data: {boardname : selectedBoard.html()},
            success: $("#close-bookmarklet-button").trigger('click')
        });
    });


    //Add Create New Board Node and Sheet Node
    collectablyBoardSheets['create-new-board'] = {
        name : '+ Create new board'
    };

    for(var key in collectablyBoardSheets)
    {
        var board = collectablyBoardSheets[key];
        $("select[name=save_into_user_board]").append(Bookmarklet.boardHtmlSnippet(key, board.name));
        if(board.groups)
            collectablyBoardSheets[key].groups.push(
            {   _id : 'new-sheet',
                name :'+ Create new group'
            });
    }

    $("select[name=save_into_user_board]").trigger('change');

    //Populate Images
    Bookmarklet.findImages().forEach(function(item) {
        $(".mini-thumbs-scroll-pic").append(
            "<!--li class='mini-thumbs-scroll-pic'>" +
                "<a class='thumbnail'>" +
                "<img src=''" + $(item).attr('src') + "'>" +
            "</a>" +
            "</li>"
        );
    });
});

//desaturate links that are not included
 $(document).ready(function() {
	  $('.include-link-btn').click(function() {
	 $(this).closest('.single-tab-link-container').toggleClass('do-not-bookmark');
    });
});


