var ArbleBoard =  Backbone.Model.extend({
    isInflated: false,
    initialize: function(){
        this.bind('change:name', this.verifyNameChanged, this);
        this.bind('added:board', this.saveMe, this);

        this.bind('change:publishState', this.saveMe, this);
        this.bind('change:related', this.saveMe, this);

        (function(board) {
            board.set({'nodes': new ArbleSheetCollection()});
            board.get('nodes').callingCollection = board;
        })(this)

    },
    defaults: {
        name: ''
    },
    url: function() {
        var id = this.get('_id') || '';
        return '/api/board/' + id;
    },
    
    parse: function(response) {

        var groups = this.get('nodes');
        _.each(response.nodes, function(sheet) {

            groups.add([{
                id: sheet._id,
                _id: sheet._id
            }]);
        });
        
        return {
            'id': response._id,
            '_id': response._id,
            'name': response.name,
            'related': response.related,
            'publishState': response.publishState,
            'mediaThumbnails': response.mediaThumbnails,
            'user': response.user,
            'collaborator': response.collaborator,
            'nodes': groups,
            'thumbnail': response.thumbnail
        };
    },
    verifyNameChanged: function() {
        var nameIsEmpty = false;
        if (this.get('name') == "") {
            nameIsEmpty = true;
        }

        if (!nameIsEmpty) {
            this.saveMe();
        } else {
            this.set('name', "Untitled");
        }
    },
    saveMe: function() {
        
        if (this.isInflated) {
            this.save({}, {
            	success: function() {
            		console.log('--> saved ARBLE');
            	}
            });
        }
    },
    inflate: function() {
    	var that = this;
        this.fetch({
        	success: function(model) {
                that.isInflated = true;
                var text = model.get('name');
                mixpanel.track("Landed on page",  {mp_note: text});
                //mixpanel.track("Pageview");
        	}
        });
    }
 });