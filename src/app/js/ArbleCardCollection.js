var ArbleCardCollection = Backbone.Collection.extend( {
    model: ArbleCard,
    initialize: function() {
        this.bind('add', this.added, this);
        this.bind('remove', this.removed, this);
    },
    
    added: function(model) {
        var sortOrder = model.get('sortOrder');
        if (sortOrder == undefined) {
            model.set('sortOrder', this.models.length);
        }
        model.inflate();
    },
    removed: function(model) {
    	/*model.set('destroy', 'yea');
    	model.save({},
                {
                    success: function (model1, response) {
                        model.trigger('update:refreshCards');
                        model.callingBoard.save();
                    },
                    error: function (model1, response) {
                        console.log("error");
                    }
                });
    	*/
    },
    inflateCollection: function() {
        var models = this.get('nodes');
        for(var i=0; i < models.length; i++) {
            models[i].inflate();
        }
    },
    saveMe: function() {
        this.save();
    },
    comparator: function(model){
        return model.get('sortOrder');
    }   
});

