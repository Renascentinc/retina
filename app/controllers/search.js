import Ember from 'ember';

export default Ember.Controller.extend({	
    queryParams: {
        status: "",
        brand: "",
        type: "",
        userID: ""
    },
    
    actions: {
        updateSearch( target ) {
            let params = this.queryParams.get('0');
            console.log( target.value );
            
            if( target.getAttribute('name') === "status" ) {
                params.status = target.value;
                
            } else if( target.getAttribute('name') === "brand" ) {
                params.brand = target.value;
                
            } else if( target.getAttribute('name') === "type" ) {
                params.type = target.value;
                
            } else if( target.getAttribute('name') === "owner" ) {
                params.userID = target.value;
            }
            
            console.log( params );
            
            var set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search', params ).then(set);
        }
    }
});
