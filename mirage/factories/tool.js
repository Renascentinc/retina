import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    brand() {
        return faker.list.random('Milwuake', 'DeWalt', 'Rigid', 'Bosch', 'Hitachi')();
    },

    year: 2015,

    purchasedate() {
        return faker.date.past();
    },

    purchasedfrom() {
        return faker.list.random('Lowes', 'Home Depot', 'Menards')();
    },

    price() {
        return faker.commerce.price();
    },

    modelnumber() {
        return faker.random.number();
    },

    serialnumber() {
        return faker.random.number();
    },

    status() {
        return faker.list.random('Available', 'Maintenance', 'In Use', 'Out of Service')();
    },

    type() {
        return faker.list.random('18v Drill', 'Hammer Drill', 'Sawzall', 'Chop Saw', 'Circular Saw')();
    },

    afterCreate(tool, server) {
        let userid = parseInt(Math.random() * 10 + 1);
        let owner = server.schema.users.find(userid);

        tool.update({ 'username': owner.username, 'userid': owner.userid, 'email': owner.email, 'phonenumber': owner.phonenumber });
    }
});
