import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tool-form', 'Integration | Component | tool form', {
    integration: true
});

test('it renders', function(assert) {
    this.render(hbs`{{tool-form}}`);

    assert.equal(this.$('#form').length, 1);
});
