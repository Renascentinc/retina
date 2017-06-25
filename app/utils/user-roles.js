const rolesUtils = {
    isAdmin(user) {
        return user.currentUserRole === 'Administrator';
    }
};

export default rolesUtils;
