function stripNode(node, path, removeNode) {
  if (node.type === 'CallExpression' &&
    node.callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.name === 'heimdall') {

    // strips anything like `heimdall.stop(token)`
    // except for within switch statements
    if (path.body && path.body.length) {
      var index = path.body.indexOf(removeNode);

      if (index !== -1) {
        path.body.splice(index, 1);
      }

      // strips `heimdall.stop(token);` within switch statements
    } else if (path.type === 'SwitchCase' && path.consequent && path.consequent.length) {
      var index = path.consequent.indexOf(removeNode);

      if (index !== -1) {
        path.consequent.splice(index, 1);
      }
    } else {
      // debugger;
    }

  // catch things like `token = heimdall.start('<id>')
  } else if (node.type === 'AssignmentExpression') {
    if (node.right) {
      stripNode(node.right, path, removeNode);
    }
  }
}

function stripHeimdall(babel) {
  return new babel.Plugin('strip-heimdall', {
    visitor: {
      ExpressionStatement: function(node, path) {
        // strip stops
        stripNode(node.expression, path, node);
      },

      VariableDeclaration: function(node, path) {
        //strip `let token = heimdall.start('<id>');`
        if (node.declarations && node.declarations.length === 1) {
          var d = node.declarations[0];

          if (d.init) {
            stripNode(d.init, path, node);
          }
        }
      }
    }
  });
}

stripHeimdall.baseDir = function() {
  return __dirname;
};

module.exports = stripHeimdall;
