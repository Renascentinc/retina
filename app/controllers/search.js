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
			    Ember.$(".search-box").val('');
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

            let set = this.set.bind(this, 'model.tool');
            this.get('store').query('tool', params).then(set);
        },

        fuzzySearch(value) {
          let set = this.set.bind(this, 'model.tool');
          if( value !== "" ) {
            this.get('store').query('tool', {parameter: value}).then(set);

          } else {
            this.get('store').query('tool', {status: '', userID: '', type: '', brand: ''}).then(set);
          }
        },

		    currentUser() {
			    return this.get('session').get('data.currentUserID');
		    }
    }
});
