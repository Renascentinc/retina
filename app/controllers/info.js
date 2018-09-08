import Ember from "ember";

export default Ember.Controller.extend({
    session: Ember.inject.service("session"),

    ableToTransfer: Ember.computed("model", function () {
        const isOwnedByUser = this.get("session").get("data.currentUserID") === this.get("model.tool").get("userid");
        const isShopManager = this.get("session").get("data.currentUserRole") === "Administrator";

        return isOwnedByUser || isShopManager;
    }),

    actions: {
        updateStatus (tool) {
            const newStatus = Ember.$("#status").val();

            if (newStatus !== "") {
                tool.set("status", newStatus);
                tool.save();
            }

        }
    },


    goToInfoPage (toolId) {
        this.get("target").transitionTo("info", toolId);
    },

    encodeNFCTag() {
      window.console.log("encoding...");
    }
});
