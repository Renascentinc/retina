import { moduleForModel, skip } from 'ember-qunit';

moduleForModel('tool', 'Unit | Model | tool', {
    // Specify the other units that are required for this test.
    needs: []
});

skip('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
