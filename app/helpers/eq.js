import Ember from 'ember';

export function eq(params/*, hash*/) {
    let [arg1, arg2] = params;
    return arg1 === arg2;
}

export default Ember.Helper.helper(eq);
