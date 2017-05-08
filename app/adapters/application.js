import DS from 'ember-data';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
	host: config.APP.api_url,
	namespace: config.APP.api_namespace,
    authorizer: 'authorizer:oauth2',

    ajaxOptions: function ajaxOptions() {
      let hash = this._super.apply(this, arguments);

      if (hash.contentType) {
        hash.contentType = 'application/json';
      }

      let beforeSend = hash.beforeSend;
      hash.beforeSend = function (xhr) {
        xhr.setRequestHeader('Accept', 'application/json');
        if (beforeSend) {
          beforeSend(xhr);
        }
      };

      return hash;
    }
});
