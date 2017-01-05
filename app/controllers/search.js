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
            
            if( target.getAttribute('name') === "status" ) {
                params.status = target.value;
                
            } else if( target.getAttribute('name') === "brand" ) {
                params.brand = target.value;
                
            } else if( target.getAttribute('name') === "type" ) {
                params.type = target.value;
                
            } else if( target.getAttribute('name') === "owner" ) {
                params.userID = target.value;
            }
            
            var set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search', params ).then(set);
        },
        
        fuzzySearch(value) {
            var set = this.set.bind(this, 'model.tools');
            
            if( value !== "" ) {
                Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search', { parameter: value } ).then(set);
            } else {
                Ember.$.getJSON('https://retina-api-develop.azurewebsites.net/api/search?status=&userID=&type=&brand=').then(set);
            }
        }
    }
});
