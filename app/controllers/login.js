import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),

    actions: {
        authenticate() {
            this.set('errorMessage', "authenticating...");

            let {identification, password} = this.getProperties('identification', 'password');

            this.get('session').authenticate('authenticator:oauth2', identification, password).catch(() => {
                this.set('errorMessage', 'Invalid Username/Password');
            });
        },

        clearError(){
            this.set('errorMessage', "");
        }
    }
});
