import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),

    toolList: [],

    _transferTo: "",
    
    _status: null,
    
    _brand: null,
    
    _type: null,
    
    _userID: null,

    _query: Ember.computed(function () {
        return { 
                currentUser: this.get('session').get('data.currentUserID'), 
                status: this.getWithDefault('_status', ''), 
                brand: this.getWithDefault('_brand', ''),
                type: this.getWithDefault('_type', ''),
                userID: this.getWithDefault('_userID', '')
               };
    }).volatile(),

    clearFilterParams() {
        this.set('_status', null);
        this.set('_brand', null);
        this.set('_type', null);
        this.set('_userID', null);
    },

    actions: {
        goToInfoPage() {
            let toolid = Ember.$("#toolid").val();
            this.get('target').transitionTo('info', toolid);
        },

		addToList(toolid) {
            if (!this.toolList.includes(toolid)) {
                this.get('toolList').pushObject(toolid);
            }
		},

		deleteToolList() {
			this.set('toolList', []);
		},

        transferTools() {
			Ember.$("#user-to-transfer-to").css("border-style", "none");
			Ember.$("#list-title").css("border-style", "none");

			if (this._transferTo === ""){
				Ember.$("#user-to-transfer-to").css("border-style", "solid");
				Ember.$("#user-to-transfer-to").css("border-color", "#e30000");
			}

			if (this.toolList.length === 0) {
				Ember.$("#list-title").css("border-style", "solid");
				Ember.$("#list-title").css("border-color", "#e30000");
			}

			if (Ember.$("#user-to-transfer-to").val() !== null && this.toolList.length !== 0) {
                var userid = parseInt(Ember.$("#user-to-transfer-to").val());
                let _this = this;

                const options = {
                    url: config.APP.api_url + config.APP.api_namespace + '/transfer',
                    data: { userid: userid, toolids: this.toolList},
                    type: 'PUT',
                    crossDomain: true,
                    success: function() {
                        alert("Transaction success.");
                    },

                    error: function() {
                        alert("Tranaction failed.");
                    }
                };

                Ember.$.ajax(options).then(function() {
                    var set = _this.set.bind(_this, 'model.tools');
                    Ember.$.getJSON(`${config.APP.api_url}${config.APP.api_namespace}/search`, _this.get('_query')).then(set);
                });

                this.set('toolList', []);
			}
        },

        updateSearch(target) {
			Ember.$(".search-box").val('');

            if (target.getAttribute('name') === "status") {
                this.set('_status', target.value);

            } else if (target.getAttribute('name') === "brand") {
                this.set('_brand', target.value);

            } else if (target.getAttribute('name') === "type") {
                this.set('_type', target.value);

            } else if (target.getAttribute('name') === "owner") {
                this.set('_userID', parseInt(target.value));
            }

            var set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON(`${config.APP.api_url}${config.APP.api_namespace}/search`, this.get('_query')).then(set);
        },

        fuzzySearch(value) {
            this.clearFilterParams();
            var set = this.set.bind(this, 'model.tools');
            let currentUser = this.get('session').get('data.currentUserID');

            if (value !== "") {
                Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search', { currentUser: currentUser, parameter: value } ).then(set);
            } else {
                Ember.$.getJSON(config.APP.api_url + config.APP.api_namespace + '/search?currentUser=' + currentUser + '&status=&userID=&type=&brand=').then(set);
            }
        },

        updateTransferTo(target) {
            this.set('_transferTo', parseInt(target.value));
        }
    }
});
