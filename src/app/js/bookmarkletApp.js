$(function() {

    var appGlobal = {};

    // Model

    var UserModel =  Backbone.Model.extend({
        url: '/api/login',
        defaults: {
            name: 'Untitled collection'
        }
    });

    var BookmarkContentModel =  Backbone.Model.extend({
        url: function() {
            return '/api/bookmarkcontent/' + encodeURIComponent(this.get('origin'));
        },
        parse: function(response){
            if (response == null)
                return;

            // Set all properties that can be changed by the user
            this.set('name', response.title);
            this.set('description', response.description);
            this.set('type', "page");

            if (response.type == 'video') {
                this.set('video', response.video);
                this.set('thumbnail', response.thumbnail_url);
                this.set('type', "video");
            } else if (response.type == 'link') {
                this.set('page', response.page);
            }

            // The media is only there for us to fetch information from
            this.set('media', response);


        }
    });


    var SheetModel =  Backbone.Model.extend({

    });

    var BoardSheetCollection = Backbone.Collection.extend( {


    });

    var BoardSheetModel =  Backbone.Model.extend({

    });



    var BoardSheetCollection = Backbone.Collection.extend( {
        url: "/api/my/boardsheet",
        model: BoardSheetModel,
        parse: function(response) {
            var that = this;
            console.log(response);

            // Enrich the response with the option of a new sheet
            _.each(response, function(board) {
                // Add the new sheet functionality
                board.nodes.push({
                    _id: 'new-sheet',
                    name: '+ Create new group'
                });
                that.add(board);

                // Loop over the enriched response and add the sheets
                collectablyBoardSheets[board._id] = board.nodes;
            });

            // Add the new board option
            var newBoardDoc = new BoardSheetModel();
            newBoardDoc.set({
                _id: 'create-new-board',
                name: '+ Create new board',
                isCollaborative: false,
                userCanAdd: true
            });
            that.add(newBoardDoc);

            this.trigger('init:listLoaded');

            return;
        },

        initialize: function() {
            this.bind('add', this.added, this);
        },

        added: function(model) {
            //model.inflate();
        }
    });



    // View
    var LoginView = Backbone.View.extend( {
        model: UserModel,
        initialize: function() {
            this.model.bind('change', this.render, this);
        },
        render: function() {
            this.$el.show();
            return this;
        },
        events: {
            'submit form' : 'doLogIn'
        },
        doLogIn: function() {
            var that = this;
            var username = $('input[name=username]', this.$el).val();
            var password = $('input[name=password]', this.$el).val();
            this.model.set('username', username);
            this.model.set('password', password);

            console.log('logging in...');

            this.model.save({}, {
                success: function(model) {
                    console.log('OK');
                    boardSheetCollectionView.load();
                    that.$el.hide();
                },
                error: function(model, ajaxRequest) {
                    console.log('ERROR');
                    $('#login-message', this.$el).show();
                }
            });
            return false;
        }
    });



    var BoardSheetCollectionView = Backbone.View.extend( {

        views: {},
        initialize: function() {
            this.collection.bind('add', this.added, this);
            this.collection.bind('remove', this.removed, this);
            this.collection.bind('init:listLoaded', this.boardSelected, this);
        },

        //template: _.template($("#arble-collection-template").html()),

        render: function() {

            var that = this;
            _.each(this.views, function(view){
                view.render();
                that.$el.append(view.el);
            });
            return this;
        },
        events: {
            'change select[name=save_into_user_arbleboard]': 'boardSelected',
            'change select[name=save_into_user_sheet]': 'groupSelected',

            'click #ok-new-board-name': 'confirmNewBoardName',
            'click #cancel-new-board-name': 'cancelNewBoardName',

            'click #ok-new-group-name': 'confirmNewGroupName',
            'click #cancel-new-group-name': 'cancelNewGroupName',
            'keypress': 'checkKeyInput',

            'submit #newBoardForm': 'preventFormSubmit',
            'submit #newGroupForm': 'preventFormSubmit'

        },

        preventFormSubmit: function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        },

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
            var selectedBoard = $('select[name=save_into_user_arbleboard]', this.$el);
            var selectedBoardId = selectedBoard.val();


            // We want to
            if(selectedBoardId==="create-new-board")
            {
                $('#new-board-name').show();
                $('#newBoardForm input[name=new-board-name]').focus();
            } else {

                var res = "";
                var sheetsAttachedToBoard = collectablyBoardSheets[selectedBoardId];
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


            var boards = $('select[name=save_into_user_arbleboard] option').length;
            $($('select[name=save_into_user_arbleboard] option')[boards - 1]).html($('#newBoardForm input[name=new-board-name]').val());
            $($('select[name=save_into_user_arbleboard] option')[boards - 1]).attr("selected", "selected");

            var newGroupName = $('#newBoardForm input[name=new-sheet-name]').val();
            this._addNewGroupNameToOption(newGroupName);





        },
        cancelNewBoardName : function() {

            $('#newBoardForm input[name=new-board-name]').val('');
            $('#newBoardForm input[name=new-sheet-name]').val('');

            var selectOptions = $('select[name=save_into_user_arbleboard] option');
            selectOptions.removeAttr("selected");

            $(selectOptions[0]).attr("selected", "selected");



            $('#new-board-name').hide();


        },



        groupSelected : function() {
            var selectedSheet = $('select[name=save_into_user_sheet]', this.$el).val();

            if(selectedSheet==="new-sheet" && $("select[name=save_into_user_sheet] option[value=new-sheet]").html() == "+ Create new group")
            {
                $('#new-sheet-name').show();
                $('#newGroupForm input[name=new-sheet-name]', this.$el).focus();
            }
        },

        confirmNewGroupName : function() {

            var newGroupName = $('#newGroupForm input[name=new-sheet-name]').val();
            this._addNewGroupNameToOption(newGroupName);

            $('#new-sheet-name').hide();

        },
        cancelNewGroupName : function(event) {
            event.preventDefault();
            event.stopPropagation();

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

        added: function(m, context) {
            console.log(m);
            var boardOptionElement = '<option value="' + m.get('_id') + '"';
            boardOptionElement += (m.get('lastEdited') ? " selected" : "" );
            boardOptionElement += (m.get('userCanAdd') ? "" : " disabled" );

            boardOptionElement += '>';
            boardOptionElement += (m.get('isCollaborative') ? "" : "" );
            boardOptionElement += m.get('name') + '</option>'

            $('select[name=save_into_user_arbleboard]', this.$el).append($(boardOptionElement));
        },
        removed: function(m) {
            this.views[m.cid].remove();
            delete this.views[m.cid];
        },
        load: function() {
            this.collection.fetch();
        }
    });

    var BookmarkContentView = Backbone.View.extend( {
        model: BookmarkContentModel,
        isSaving: false,
        lastImageIndex: 0,
        initialize: function() {
            this.model.bind('change:name', this.changeName, this);
            this.model.bind('change:description', this.changeDescription, this);
            this.model.bind('change:media', this.renderLoaded, this);

            this.youtubeTemplate = _.template($("#youtube-template").html());
            this.pageImageTemplate = _.template($("#page-image-template").html());
        },
        render: function() {


            //this.renderMediaArea();

            return this;
        },
        renderLoaded: function() {
            this.renderMediaArea();

            // Hide the loading screen
            $('#bookmarklet-loading-panel').hide();

        },
        renderMediaArea: function() {
            var media = this.model.get('media') || {};
            var mediaDomEl = $('.left-side', this.$el);
            mediaDomEl.empty();
            if (media.type == 'video') {
                var youtubeHtml = this.youtubeTemplate(this.model.toJSON());
                mediaDomEl.append(youtubeHtml);

                var youtubeImageUrl = media.thumbnail_url;
                $('#youtubeThumbnail', this.$el).attr('src', youtubeImageUrl);

            } else {
                $('.pageImageChooser', this.$el).show();
                var pageImageHtml = this.pageImageTemplate(this.model.toJSON());
                mediaDomEl.append(pageImageHtml);
            }
        },
        checkMediaRenderAction: function() {
            this.renderMediaArea();
        },
        changeName: function() {
            $('input[name=title]', this.$el).val(this.model.get('name'));
        },
        changeDescription: function() {
            $('textarea[name=description]', this.$el).html(this.model.get('description'));
        },
        events: {
            'click input[name=optionsRadios]' : 'changeMediaType',
            'click .thumbnail' : 'chooseOtherPhoto',
            'click #bookmarklet-arble-it input': 'saveBookmark',
            'blur input[name=title]': 'updateTitleValue',
            'blur textarea[name=description]': 'updateDescriptionValue',
            'keypress': 'checkKeyInput'
        },
        checkKeyInput: function(event) {
            // If event is enter
            if (event.keyCode == 13) {


                // The create new group-panel is visible. prevent the bookmark from being saved
                if (
                    !$('#newBoardForm input[name=new-sheet-name]').is(":visible")  &&
                    !$('#newGroupForm input[name=new-sheet-name]').is(":visible") ){


                    // Get the active element, so we don't submit the card if the user is writing in a text box
                    var activeElement = $(document.activeElement);
                    if (activeElement.attr('name') !== 'description' ) {
                        this.saveBookmark();
                    }
                }
            }
        },
        updateTitleValue: function() {
            var titleValue =  $('input[name=title]', this.$el).val();
            this.model.set('name', titleValue);
        },
        updateDescriptionValue: function() {
            var descriptionValue =  $('textarea[name=description]', this.$el).val();
            this.model.set('description', descriptionValue);
        },
        setMediaType: function() {
            var mediaType = $('input[name=optionsRadios]:checked', this.$el).val();
            this.model.set('type', mediaType);
            if (mediaType == 'page') {
                $('.page-pane', this.$el).show();
                $('.images-pane', this.$el).hide();

                // Remove the image object from the card model
                this.model.set('image', '');
                this.model.set('thumbnail', '');

                // Copy the page object from the media
                this.model.set('page', this.model.get('media').page);
            } else {
                $('.page-pane', this.$el).hide();
                $('.images-pane', this.$el).show();

                // Remove the image object from the card model
                this.model.set('page', '');

                // Add an image object to the card model
                this.model.set('image', {});
            }
        },
        changeMediaType: function() {
            this.setMediaType();
            this.setDefaultMediaImgUrl();
        },
        setDefaultMediaImgUrl: function() {

            if (this.model.get('type') == 'image') {
                var firstImage = this.model.get('imagesToChooseFrom')[this.lastImageIndex].imgSrc;
                this.model.get('image').imageUrl = firstImage;
                this.model.set('thumbnail', firstImage);
            }

        },
        chooseOtherPhoto: function(event, ui) {
            var id = $(event.target).attr('id');
            this.lastImageIndex = id;

            var chosenImage = this.model.get('imagesToChooseFrom')[id].imgSrc;

            this.renderLargeImage(id);

            this.model.get('image').imageUrl = chosenImage;
            this.model.set('thumbnail', chosenImage);
        },
        renderLargeImage: function(index) {
            $('.chosenPhoto img', this.$el).attr('src', this.model.get('imagesToChooseFrom')[index].imgSrc);
        },
        saveBookmark: function() {
            var that = this;
            if (this.isSaving) {
                return;
            }
            this.isSaving = true;
            console.log('save Bookmark');

            // fetch the youtube start time
            if(this.model.get('type') == 'video') {
                var youtubeStartTimeElement = $('#ytStartTime');
                var youtubeStartTime = youtubeStartTimeElement.val();
                if(youtubeStartTime != undefined && youtubeStartTime != null && youtubeStartTime !== '') {
                    this.model.get('video').startTime = youtubeStartTime;
                }
            }

            // Add save target

            var boardsSelect = $('#userboards select[name=save_into_user_arbleboard]', this.$el); // the Select dom
            var selectedBoardId = boardsSelect.val(); // The ID of the board

            $.each(boardsSelect.children(), function(index, value){
                var option = $(value);

                if (option.val() == selectedBoardId) {
                    that.model.set('save_into_user_arbleboard_name', option.text() || '');
                }
            });

            this.model.set('save_into_user_arbleboard', selectedBoardId || '');



            var groupsSelect = $('#userboards select[name=save_into_user_sheet]', this.$el);
            var selectedSheetId = groupsSelect.val();

            this.model.set('save_into_user_sheet', selectedSheetId || '');

            $.each(groupsSelect.children(), function(index, value){
                var option = $(value);

                if (option.val() == selectedSheetId) {
                    that.model.set('save_into_user_sheet_name', option.text() || '');
                }
            });

            // Add the source of the Card
            this.model.set('source', appGlobal.source);


            this.showLoadingSpinner('#bookmarklet-arble-it .bookmarklet-form-submit');

            this.model.save({}, {
                success: function(model) {
                    this.isSaving = false;
                    parent.postMessage("collectably.bookmarklet.close", "*");
                },
                error: function(model, ajaxRequest) {
                    this.isSaving = false;
                }
            });
        },
        showLoadingSpinner: function(elementToAlignWith) {
            var alignmentElement = $(elementToAlignWith);
            var alignElementPosition = alignmentElement.position();
            var alignElementWidth = alignmentElement.outerWidth();

            var loaderElement = $('#bookmarklet-arble-it .loading');
            loaderElement.css('position', 'absolute');
            loaderElement.css('left', alignElementPosition.left + alignElementWidth);
            loaderElement.css('top', alignElementPosition.top);
            $('#bookmarklet-arble-it .loading').show();
        }
    });



    window.addEventListener("message", function (message) {

        // Check if the header should show or the link passed to the bookmarklet window
        if (message.data.bookmarkingContext === "GLOBAL-ADD") {
            $("#bookmarklet-url-header").html(message.data.url);
            $("#bookmarklet-url-header").show();
            $("#bookmarklet-header-logo img").hide();
            $("#bookmarkimageRadio").parent().hide();
            $("#bookmarkpageRadio").parent().hide();
            appGlobal.source = 'GLOBAL-ADD';
        } else {
            appGlobal.source = 'BOOKMARKLET';
        }

        //console.log(message.data);
        var bookmarkContent = new BookmarkContentModel();

        var bookmarkContentView = new BookmarkContentView({model: bookmarkContent, el: $('#bookmarkContent')});

        bookmarkContent.set({
            imagesToChooseFrom: message.data.images,
            origin: message.data.url
        });
        bookmarkContent.fetch();

    });

    window.collectablyBoardSheets = [];

    var userModel = new UserModel();
    var bookmarkletLoginView = new LoginView({model: userModel, el: $('#login-panel')});


    var boardSheetCollection = new BoardSheetCollection();
    var boardSheetCollectionView = new BoardSheetCollectionView({collection: boardSheetCollection, el: $('#userboards')});


    if (showLoginPanel){
        bookmarkletLoginView.render();
    } else {
        boardSheetCollectionView.render();
        boardSheetCollectionView.load();
    }

    mixpanel.track("Bookmarked");


});