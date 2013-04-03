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
    }
};


$(document).ready(function() {
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

    //Add Create New Board Node
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
});