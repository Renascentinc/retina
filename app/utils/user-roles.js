import Ember from 'ember';

let rolesUtils = {
    isAdmin(user) {
        return user.currentUserRole === 'Administrator';
    }
}

export default rolesUtils;