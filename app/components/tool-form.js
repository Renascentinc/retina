import Ember from 'ember';

export default Ember.Component.extend({
    showErrorMessage: false,
    actions: {
        saveNewTool(tool) {
            let _this = this;

            return new Ember.RSVP.Promise(function(resolve, reject) {
                tool.validate().then(({ validations }) => {
                    if (validations.get('isValid')) {
                        _this.set('model.tool.userid', _this.get('model.tool.userid').userid);
                        _this.set('showErrorMessage', false);

                        tool.save().then(function(tool) {
                            resolve('save successful');
                            let toolid = tool.get('id');
                            _this.get('successfulAdd')(toolid);

                        }).catch(function(e) {
                            reject('save failed');
                            Ember.Logger.info(e);
                        });

                    } else {
                        _this.set('showErrorMessage', true);
                        reject('validation failed');
                    }
                });
            });
        },

        hideCreateOptionOnSameName(whichModel, term) {
            let existingOption = this.get(`model.dropdown.${whichModel}`).includes(term);
            return !existingOption;
        }
    }
});
