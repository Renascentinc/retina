import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tool-form', 'Integration | Component | tool form', {
    integration: true
});

skip('it renders', function(assert) {
    this.render(hbs`{{tool-form}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#tool-form}}
      template block text
    {{/tool-form}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
