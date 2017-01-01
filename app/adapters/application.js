import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';


export default DS.JSONAPIAdapter.extend({
//	host: 'https://retina-api-develop.azurewebsites.net',
//	namespace: 'api',
    authorizer: 'authorizer:oauth2'
});
