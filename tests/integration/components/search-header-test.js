import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('search-header', 'Integration | Component | search header', {
    integration: true,

    beforeEach() {
        this.set('_query', { status: '', brand: '', type: '', userID: '' });
        this.set('_fuzzySearchParams', { parameter: '' });
    }
});

test('it renders', function(assert) {
    this.render(hbs`{{search-header fuzzySearchParams=_fuzzySearchParams}}`);

    assert.equal(this.$('.search-header').length, 1);
});

test('it uses the filter params when the fuzzy search is empty string', function(assert) {
    assert.expect(4);

    this.set('validate', (data) => {
        assert.equal(data.status, '', 'status was not set on the query. must not be the filter params');
        assert.equal(data.brand, '', 'brand was not set on the query. must not be the filter params');
        assert.equal(data.type, '', 'type was not set on the query. must not be the filter params');
        assert.equal(data.userID, '', 'userID was not set on the query. must not be the filter params');
    });

    this.render(hbs`{{search-header fuzzySearchParams=_fuzzySearchParams query=_query updateSearch=(action validate)}}`);

    this.$('.search-bar-input').trigger('keyup');

    return wait();
});

test('it uses the fuzzy params when the fuzzy search is not empty string', function(assert) {
    assert.expect(1);

    this.set('validate', (data) => {
        assert.equal(data.parameter, 'test', 'parameter was not set on the query. must not be the fuzzy params');
    });

    this.render(hbs`{{search-header fuzzySearchParams=_fuzzySearchParams query=_query updateSearch=(action validate)}}`);

    this.$('.search-bar-input').val('test');
    this.$('.search-bar-input').trigger('keyup');

    return wait();
});

test('it uses the filter params on filter search', function(assert) {
    assert.expect(4);

    this.set('validate', (data) => {
        assert.equal(data.status, '', 'status was not set on the query. must not be the filter params');
        assert.equal(data.brand, '', 'brand was not set on the query. must not be the filter params');
        assert.equal(data.type, '', 'type was not set on the query. must not be the filter params');
        assert.equal(data.userID, '', 'userID was not set on the query. must not be the filter params');
    });

    this.render(hbs`{{search-header fuzzySearchParams=_fuzzySearchParams query=_query updateSearch=(action validate)}}`);

    this.$('select[name="status"]').change();

    return wait();
});

test('it clears the fuzzy search on filter search', function(assert) {
    assert.expect(1);

    this.set('model', { dropdown: { status: [ 'Available' ] } });
    this.set('noop', () => { });

    this.render(hbs`{{search-header model=model fuzzySearchParams=_fuzzySearchParams query=_query updateSearch=(action noop)}}`);

    this.$('.search-bar-input').val('test');
    this.$('.search-bar-input').trigger('keyup');

    this.$('select[name="status"]').val('Available');
    this.$('select[name="status"]').change();

    return wait().then(() => {
        assert.equal(this.$('.search-bar-input').val(), '', 'searchbar was not cleared on filter search');
    });
});

test('it clears the filter search on fuzzy search', function(assert) {
    assert.expect(1);

    this.set('model', { dropdown: { status: [ 'Available' ], type: [ 'Drill' ], user: [ { userid: 1, username: 'bob' } ], brand: [ 'Bosch' ] } });
    this.set('noop', () => { });

    this.render(hbs`{{search-header model=model fuzzySearchParams=_fuzzySearchParams query=_query updateSearch=(action noop)}}`);

    this.$('select[name="status"]').val('Available');
    this.$('select[name="type"]').val('Drill');
    this.$('select[name="owner"]').val(1);
    this.$('select[name="brand"]').val('Bosch');
    this.$('.dropdown').change();

    this.$('.search-bar-input').val('test');
    this.$('.search-bar-input').trigger('keyup');

    return wait().then(() => {
        assert.equal(this.$('.dropdown').val(), '', 'search filters were not cleared on filter search');
    });
});
