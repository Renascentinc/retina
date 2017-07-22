import { validator, buildValidations } from 'ember-cp-validations';

const TransferValidations = buildValidations({
    'transferInfo.userid': validator('presence', true),

    'transferInfo.toolids.length': validator('exclusion', { range: [0, 0] })
});

export default TransferValidations;
