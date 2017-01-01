import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('transfer');
  this.route('search');
  this.route('add');
  this.route('scan');
  this.route('login');
  this.route('info', { path: "tool/:id" });
  this.route('transfer', { path: "transfer/:id" })
});

export default Router;
