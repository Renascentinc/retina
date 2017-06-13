import DS from 'ember-data';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
    host: config.APP.API_URL,
    namespace: config.APP.API_NAMESPACE,
    authorizer: 'authorizer:oauth2',

    ajaxOptions() {
        let hash = this._super(...arguments);

        if (hash.contentType) {
            hash.contentType = 'application/json';
        }

        let { beforeSend } = hash;
        hash.beforeSend = function(xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
            if (beforeSend) {
                beforeSend(xhr);
            }
        };

        return hash;
    }
});
