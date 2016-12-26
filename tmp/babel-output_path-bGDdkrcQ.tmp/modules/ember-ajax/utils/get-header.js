
export default getHeader;
import Ember from 'ember';

var A = Ember.A;
var isNone = Ember.isNone;

/**
 * Do a case-insensitive lookup of an HTTP header
 *
 * @function getHeader
 * @private
 * @param {Object} headers
 * @param {string} name
 * @return {string}
 */
function getHeader(headers, name) {
  if (isNone(headers) || isNone(name)) {
    return; // ask for nothing, get nothing.
  }

  var matchedKey = A(Object.keys(headers)).find(function (key) {
    return key.toLowerCase() === name.toLowerCase();
  });

  return headers[matchedKey];
}