export { AjaxError };
export { InvalidError };
export { UnauthorizedError };
export { ForbiddenError };
export { BadRequestError };
export { NotFoundError };
export { TimeoutError };
export { AbortError };
export { ConflictError };
export { ServerError };
export { isAjaxError };
export { isUnauthorizedError };
export { isForbiddenError };
export { isInvalidError };
export { isBadRequestError };
export { isNotFoundError };
export { isTimeoutError };
export { isAbortError };
export { isConflictError };
export { isServerError };
export { isSuccess };
import Ember from 'ember';

var EmberError = Ember.Error;

/**
 * @class AjaxError
 * @private
 */

function AjaxError(errors) {
  var message = arguments.length <= 1 || arguments[1] === undefined ? 'Ajax operation failed' : arguments[1];

  EmberError.call(this, message);

  this.errors = errors || [{
    title: 'Ajax Error',
    detail: message
  }];
}

AjaxError.prototype = Object.create(EmberError.prototype);

/**
 * @class InvalidError
 * @public
 * @extends AjaxError
 */

function InvalidError(errors) {
  AjaxError.call(this, errors, 'Request was rejected because it was invalid');
}

InvalidError.prototype = Object.create(AjaxError.prototype);

/**
 * @class UnauthorizedError
 * @public
 * @extends AjaxError
 */

function UnauthorizedError(errors) {
  AjaxError.call(this, errors, 'Ajax authorization failed');
}

UnauthorizedError.prototype = Object.create(AjaxError.prototype);

/**
 * @class ForbiddenError
 * @public
 * @extends AjaxError
 */

function ForbiddenError(errors) {
  AjaxError.call(this, errors, 'Request was rejected because user is not permitted to perform this operation.');
}

ForbiddenError.prototype = Object.create(AjaxError.prototype);

/**
 * @class BadRequestError
 * @public
 * @extends AjaxError
 */

function BadRequestError(errors) {
  AjaxError.call(this, errors, 'Request was formatted incorrectly.');
}

BadRequestError.prototype = Object.create(AjaxError.prototype);

/**
 * @class NotFoundError
 * @public
 * @extends AjaxError
 */

function NotFoundError(errors) {
  AjaxError.call(this, errors, 'Resource was not found.');
}

NotFoundError.prototype = Object.create(AjaxError.prototype);

/**
 * @class TimeoutError
 * @public
 * @extends AjaxError
 */

function TimeoutError() {
  AjaxError.call(this, null, 'The ajax operation timed out');
}

TimeoutError.prototype = Object.create(AjaxError.prototype);

/**
 * @class AbortError
 * @public
 * @extends AjaxError
 */

function AbortError() {
  AjaxError.call(this, null, 'The ajax operation was aborted');
}

AbortError.prototype = Object.create(AjaxError.prototype);

/**
 * @class ConflictError
 * @public
 * @extends AjaxError
 */

function ConflictError(errors) {
  AjaxError.call(this, errors, 'The ajax operation failed due to a conflict');
}

ConflictError.prototype = Object.create(AjaxError.prototype);

/**
 * @class ServerError
 * @public
 * @extends AjaxError
 */

function ServerError(errors) {
  AjaxError.call(this, errors, 'Request was rejected due to server error');
}

ServerError.prototype = Object.create(AjaxError.prototype);

/**
 * Checks if the given error is or inherits from AjaxError
 *
 * @method isAjaxError
 * @public
 * @param  {Error} error
 * @return {Boolean}
 */

function isAjaxError(error) {
  return error instanceof AjaxError;
}

/**
 * Checks if the given status code or AjaxError object represents an
 * unauthorized request error
 *
 * @method isUnauthorizedError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isUnauthorizedError(error) {
  if (isAjaxError(error)) {
    return error instanceof UnauthorizedError;
  } else {
    return error === 401;
  }
}

/**
 * Checks if the given status code or AjaxError object represents a forbidden
 * request error
 *
 * @method isForbiddenError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isForbiddenError(error) {
  if (isAjaxError(error)) {
    return error instanceof ForbiddenError;
  } else {
    return error === 403;
  }
}

/**
 * Checks if the given status code or AjaxError object represents an invalid
 * request error
 *
 * @method isInvalidError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isInvalidError(error) {
  if (isAjaxError(error)) {
    return error instanceof InvalidError;
  } else {
    return error === 422;
  }
}

/**
 * Checks if the given status code or AjaxError object represents a bad request
 * error
 *
 * @method isBadRequestError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isBadRequestError(error) {
  if (isAjaxError(error)) {
    return error instanceof BadRequestError;
  } else {
    return error === 400;
  }
}

/**
 * Checks if the given status code or AjaxError object represents a
 * "not found" error
 *
 * @method isNotFoundError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isNotFoundError(error) {
  if (isAjaxError(error)) {
    return error instanceof NotFoundError;
  } else {
    return error === 404;
  }
}

/**
 * Checks if the given status code or AjaxError object represents a
 * "timeout" error
 *
 * @method isTimeoutError
 * @public
 * @param  {AjaxError} error
 * @return {Boolean}
 */

function isTimeoutError(error) {
  return error instanceof TimeoutError;
}

/**
 * Checks if the given status code or AjaxError object represents an
 * "abort" error
 *
 * @method isAbortError
 * @public
 * @param  {AjaxError} error
 * @return {Boolean}
 */

function isAbortError(error) {
  return error instanceof AbortError;
}

/**
 * Checks if the given status code or AjaxError object represents a
 * conflict error
 *
 * @method isConflictError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isConflictError(error) {
  if (isAjaxError(error)) {
    return error instanceof ConflictError;
  } else {
    return error === 409;
  }
}

/**
 * Checks if the given status code or AjaxError object represents a server error
 *
 * @method isServerError
 * @public
 * @param  {Number | AjaxError} error
 * @return {Boolean}
 */

function isServerError(error) {
  if (isAjaxError(error)) {
    return error instanceof ServerError;
  } else {
    return error >= 500 && error < 600;
  }
}

/**
 * Checks if the given status code represents a successful request
 *
 * @method isSuccess
 * @public
 * @param  {Number} status
 * @return {Boolean}
 */

function isSuccess(status) {
  var s = parseInt(status, 10);
  return s >= 200 && s < 300 || s === 304;
}