import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
    type: [ '18v Drill', 'Hammer Drill', 'Sawzall', 'Chop Saw', 'Circular Saw' ],

    brand: [ 'Milwuake', 'DeWalt', 'Rigid', 'Bosch', 'Hitachi' ],

    provider: [ 'Lowes', 'Home Depot', 'Menards' ],

    status: [ 'Available', 'Maintenance', 'In Use', 'Out of Service' ],

    afterCreate(dropdowns, server) {
        let users = [];
        let restrictedusers = [];
        let userModels = server.schema.users.all().models;

        for (let i = 0; i < userModels.length; i++) {
            users.push({ username: userModels[i].username, userid: userModels[i].userid });
        }

        let loggedInUser = server.schema.users.find(1);
        restrictedusers.push({ username: loggedInUser.username, userid: loggedInUser.userid });

        dropdowns.update({ user: users, restricteduser: restrictedusers });
    }
});
