import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  host: config.APP.api_url,
  namespace: config.APP.api_namespace,
  session: Ember.inject.service(),

  ajaxOptions: function ajaxOptions() {
    let hash = this._super(...arguments);

    if (hash.contentType) {
      hash.contentType = 'application/json';
    }

    let { beforeSend } = hash;
    hash.beforeSend = function(xhr) {
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('AUTH_TOKEN', this.get('session.data.currentUserID'));
      if (beforeSend) {
        beforeSend(xhr);
      }
    };

    return hash;
  }
});
