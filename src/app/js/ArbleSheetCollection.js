var ArbleSheetCollection = Backbone.Collection.extend( {
    
    initialize: function() {
        this.bind('add', this.added, this);
    },
    model: ArbleSheet,
    
    added: function(model, context) {

        var anId = model.get('_id');
        if (model.get('_id') == undefined) {

            model.set('backgroundcolor', arble.ColorChooser.getRandomBoardColor());

            model.save({},
                {
                    success: function (model1, response) {
                        
                        console.log('collection created');
                        
                        context.callingCollection.save({}, {
                        	success: function(model){
                        		console.log('collection created');
                        	}, 
                        	error: function(error, par1, par2) {
                        		//window.location.reload();
                        	}
                        });
                    },
                    error: function (model1, response) {
                        console.log("error");
                    }
                });
        } else {
            model.set('sortOrder', this.models.length);
            model.inflate();
            
        }
    },
    inflateCollection: function() {
        
        for(var i=0; i < this.models.length; i++) {
            this.models[i].inflate();
        }
    },
    comparator: function(model){
        return model.get('sortOrder');
    }
});