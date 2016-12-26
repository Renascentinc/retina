function stripClassCallCheck(babel) {
  return new babel.Plugin('strip-class-call-check', {
    visitor: {
      ExpressionStatement: function(node, path) {
        if (node.expression.type === 'CallExpression' &&
          node.expression.callee &&
          node.expression.callee.type === 'MemberExpression' &&
          node.expression.callee.object.name === 'babelHelpers' &&
          node.expression.callee.property.name === 'classCallCheck') {
          if (path.body && path.body.length) {
            path.body = path.body.filter(function(item) {
              return item !== node;
            });
          }
        } else if (node.expression.type === 'CallExpression' &&
          node.expression.callee &&
          node.expression.callee.type === 'Identifier' &&
          node.expression.callee.name === '_classCallCheck'
        ) {
          if (path.body && path.body.length) {
            path.body = path.body.filter(function(item) {
              return item !== node;
            });
          }
        }
      }
    }
  });
}

stripClassCallCheck.baseDir = function() {
  return __dirname;
};


module.exports = stripClassCallCheck;
