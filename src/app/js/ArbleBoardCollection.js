var ArbleCollection = Backbone.Collection.extend( {
    url: "/api/my/board",
    model: ArbleDisplay,
    parse: function(response) {

        var that = this;
        _.each(response, function(doc) { 
            var newDoc = new ArbleDisplay();
            newDoc.set({
                _id: doc._id,
                name: doc.name,
                description: doc.description,
                user: doc.user,
                collaborator: doc.collaborator || []
            });
            
            that.add(newDoc);
        });
        return ;
    },
    
    initialize: function() {
        this.bind('add', this.added, this);
    },
    
    added: function(model) {
        //model.inflate();
    },

    search : function(letters){
        if(letters == "") return this;

        var pattern = new RegExp(letters,"gi");
        return _(this.filter(function(data) {
            return pattern.test(data.get("name"));
        }));
    }
});