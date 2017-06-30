import Ember from 'ember';
import roleUtils from '../utils/user-roles';

export default Ember.Mixin.create({
    session: Ember.inject.service(),

    data: Ember.computed(function() {
        Ember.Logger.info('ok so we made it this far');
        if (this.get('_data')) {
            return this.get('_data');
        } else {
            let data = Ember.RSVP.hash({
                tools: this.get('store').query('tool', this.get('query')),
                dropdown: this.get('store').queryRecord('dropdown', {
                    currentUser: this.get('session').get('data.currentUserID'),
                    brand: true,
                    type: true,
                    provider: false,
                    status: true,
                    user: true,
                    restricteduser: !roleUtils.isAdmin(this.get('session').get('data'))
                })
            });

            return data.then((response) => {
                this.set('_data', response);
                return response;
            });
        }
    }),

    _data: null,

    dropdown: Ember.computed(function() {
        let data = this.get('data');
        debugger;
        return data.get('dropdown');
    }),

    tools: Ember.computed.alias('data.tools'),

    init() {
        this._super(...arguments);

        this.set('query',  {
            status: '',
            brand: '',
            type: '',
            userID: ''
        });

        this.set('fuzzySearchParams', {
            parameter: ''
        });
    },

    updateSearch(body) {
        this.get('store').query('tool', body).then((response) => {
            this.set('_data.tools', response);
        });
    }
});
