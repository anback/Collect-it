var ArbleCard =  Backbone.Model.extend({
    isInflated : false,
    initialize: function() {
        this.bind('change:name', this.saveMe, this);
        this.bind('change:description', this.saveMe, this);
        this.bind('change:sortOrder', this.saveMe, this);
        this.bind('remove', this.removeMe, this);
    },
    url: function()  {
        return '/api/card/' + this.get('_id');
    },
    defaults: {
        name: 'Card',
        description: 'desc',
        origin: '',
        thumbnail: '',
        type: '',
        media: {
            mediaUrl: 'https://www.google.se/images/srpr/logo3w.png'
        },
        user: {
            displayName: ''
        }
    },
    parse: function(response) {
        return response;
    },
    setTopLeft: function(x, y) {
        this.set({x:x, y:y});
    },
    setDim: function(w, h) {
        this.set({width:w, height:h});
    },
    saveMe: function() {
        if (this.isInflated) {
            this.save();
        }
    },
    removeMe: function() {
        var that = this;
        this.id = this.get('_id');
        this.destroy({
            success: function(model) {
                model.callingSheet.saveMe();
            }

        });
    },
    inflate: function(){
        var that = this;
        this.fetch({success: function() {
                that.isInflated = true;
            }
        });
    }
 });