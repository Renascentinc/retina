import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
    userid(i) {
        return i;
    },

    username() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    },

    email() {
        return faker.internet.email();
    },

    phonenumber() {
        return faker.phone.phoneNumber();
    }
});
