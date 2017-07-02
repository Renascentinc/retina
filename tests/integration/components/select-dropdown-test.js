import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('select-dropdown', 'Integration | Component | select dropdown', {
    integration: true
});

test('it renders', function(assert) {
    this.render(hbs`{{select-dropdown}}`);

    assert.equal(this.$('.search-filter').length, 1);
});

test('it renders all options passed to it plus the header', function(assert) {
    this.set('testOptions', [ 'one', 'two', 'three' ]);

    this.set('noop', () => { });

    this.render(hbs`{{select-dropdown headerName="Test" options=testOptions onUpdate=(action noop)}}`);

    assert.equal(this.$('.dropdown option').length, 4);
});

test('it fires an action when you click an option and passes the one that was clicked', function(assert) {
    assert.expect(2);

    this.set('testOptions', [ 'one', 'two', 'three' ]);

    this.set('validate', (target) => {
        assert.equal(target.value, 'one');
        assert.equal(target.name, 'test');
    });

    this.render(hbs`{{select-dropdown formName="test" headerName="Test" options=testOptions onUpdate=(action validate)}}`);

    this.$('select[name="test"]').val('one');
    this.$('select[name="test"]').change();

    return wait();
});
