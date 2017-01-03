import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';


export default DS.JSONAPIAdapter.extend({
	host: 'https://retina-api-develop.azurewebsites.net',
	namespace: 'api',
    authorizer: 'authorizer:oauth2',
    
    ajaxOptions: function ajaxOptions(url, type, options) {
      var hash = this._super.apply(this, arguments);

      if (hash.contentType) {
        hash.contentType = 'application/json';
      }

      var beforeSend = hash.beforeSend;
      hash.beforeSend = function (xhr) {
        xhr.setRequestHeader('Accept', 'application/json');
        if (beforeSend) {
          beforeSend(xhr);
        }
      };

      return hash;
    },
    
    pathForType: function(type) {
        console.log(type);
        return Ember.String.underscore(type);
    }
});
