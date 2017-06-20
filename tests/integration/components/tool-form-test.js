import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tool-form', 'Integration | Component | tool form', {
    integration: true
});

skip('it renders', function(assert) {
    this.render(hbs`{{tool-form}}`);

    assert.equal(this.$().text().trim(), '');
});
