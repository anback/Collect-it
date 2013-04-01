var ArbleSheet =  Backbone.Model.extend({
    isInflated : false,
    initialize: function() {
        //this.bind('change:gridY', this.saveMe, this);
        
        this.bind('change:name', this.saveMe, this);
        this.bind('change:backgroundcolor', this.saveMe, this);
        this.bind('change:cardsInRow', this.saveMe, this);
        this.bind('remove', this.removeMe, this);
        (function(sheet) {
            sheet.set({'nodes': new ArbleCardCollection()});
        })(this);

    },
    url: function() {
        var id = this.get('_id') || '';
        return '/api/sheet/' + id;
    },
    defaults: {
        name: 'Untitled Group',
        gridX: 0,
        gridY: 0,
        backgroundcolor: '',
        cardsInRow: 1
    },
    parse: function(response) {
        
        var self = this;
        
        var coll = this.get('nodes');
        _.each(response.nodes, function(card) {

            var newDoc = new ArbleCard();
            newDoc.set('_id', card._id);
            newDoc.set('id', card._id);
            newDoc.callingSheet = self;
            coll.add(newDoc);
        });


		if (this.get('cardsInRow') == response.cardsInRow) {
            this.trigger('init:cardsInRow');
        }
        return {
            'id': response._id,
            '_id': response._id,
            'gridX': response.gridX,
            'gridY': response.gridY,
            'name': response.name,
            'backgroundcolor': response.backgroundcolor,
            'cardsInRow': response.cardsInRow,
            'sortOrder': response.sortOrder,
            'nodes': coll
        };
        
    },
    reorderNodes: function(newOrder) {
    	var cards = this.get('nodes');

    	for(var i=0; i < newOrder.length; i++) {
    		cards.getByCid(newOrder[i]).set('sortOrder', i+1);
    	}
    	cards.sort();
        this.saveMe();
    },

    addDropped: function(droppedCardId) {
        var cards = this.get('nodes');
        var newCard = new ArbleCard();
        newCard.set('_id', droppedCardId);
        newCard.callingSheet = this;
        cards.add(newCard);

        var numberOfCards = cards.models.length;
        cards.length = numberOfCards;
    },
    saveWithCallback: function(callback) {
        this._save(callback);
    },
    saveMe: function() {
        if (this.isInflated) {
            this._save(function(m) {
                console.log('---> SAVED AN')
            });
        }
    },

    _save: function(successCallback) {
        if (this.get('backgroundcolor') == '' || this.get('backgroundcolor') == undefined) {
            this.set('backgroundcolor', arble.ColorChooser.getRandomBoardColor());
        }
        this.save({}, {
            success: successCallback
        });
    },
    removeMe: function() {
        var that = this;
        this.id = this.get('_id');
        this.destroy({
            success: function(model) {
                console.log("now remove myself from my parent ad save it");

                // TODO: Change this so it calls an attribute which is attached to the backbone rather than calling the app-object
                arbleApp.saveMe();
            }

        });
    },
    setPosition: function(gridX, gridY) {
        this.set({
                'gridX': gridX,
                'gridY': gridY
                });
        
    },
    inflate: function() {
        var that = this;
        this.fetch({success: function() {
        	that.isInflated = true;
        }});
    }
 });