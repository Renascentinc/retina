import Ember from 'ember';

export default Ember.Controller.extend({
    selectedStatus: '',

    selectedBrand: '',

    selectedType: '',

    _userID: null,

    _query: Ember.computed(function() {
        return {
            status: this.getWithDefault('selectedStatus', ''),
            brand: this.getWithDefault('selectedBrand', ''),
            type: this.getWithDefault('selectedType', ''),
            userID: this.getWithDefault('_userID', '')
        };
    }).volatile()
});
