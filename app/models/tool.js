import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const { attr } = DS;

const Validations = buildValidations({
    brand: {
        description: 'Brand',
        validators: [
            validator('presence', true)
        ]
    },

    year: {
        description: 'Year',
        validators: [
            validator('date', {
                allowBlank: true,
                onOrBefore: 'now',
                precision: 'year',
                format: 'YYYY',
                errorFormat: 'YYYY'
            })
        ]
    },

    type: {
        description: 'Type',
        validators: [
            validator('presence', true)
        ]
    },

    purchasedate: {
        description: 'Purchase Date',
        validators: [
            validator('date', {
                allowBlank: true,
                onOrBefore: 'now',
                after: '01/01/1970',
                precision: 'day',
                format: 'M/D/YYYY',
                errorFormat: 'M/D/YYYY'
            })
        ]
    },

    modelnumber: {
        description: 'Model Number',
        validators: [
            validator('presence', true),
            validator('length', {
                min: 3,
                message: '{description} must be valid'
            }),
            validator('format', {
                regex: '^[0-9A-Za-z]*$',
                message: '{description} must have only letters and numbers'
            })
        ]
    },

    serialnumber: {
        description: 'Serial Number',
        validators: [
            validator('presence', true),
            validator('length', {
                min: 4,
                message: '{description} must be valid'
            }),
            validator('format', {
                regex: '^[0-9A-Za-z]*$',
                message: '{description} must have only letters and numbers'
            })
        ]
    },

    userid: {
        description: 'Assignee',
        validators: [
            validator('presence', true)
        ]
    },

    price: {
        description: 'Price',
        validators: [
            validator('number', {
                allowBlank: true,
                allowString: true
            })
        ]
    },

    status: {
        description: 'Status',
        validators: [
            validator('presence', true)
        ]
    }
});

export default DS.Model.extend(Validations, {
    brand: attr(),
    year: attr(),
    type: attr(),
    username: attr(),
    purchasedate: attr(),
    purchasedfrom: attr(),
    price: attr(),
    modelnumber: attr(),
    serialnumber: attr(),
    status: attr(),
    toolclass: attr(),
    userid: attr(),
    email: attr(),
    phonenumber: attr()
});
