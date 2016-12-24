export default function() {
//     this.namespace = '/api';
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.x/shorthands/
  */
  
//    this.post('/token', function(req, res) {
//        return { "access_token": "secret token!", "account_id": 1 };
//    });  
    
    this.post('/token', (schema, request) => {
//        if (!params.title) {
//            return new Mirage.Response(422, {some: 'header'}, {errors: {title: ['cannot be blank']}});
//        } else {
//            return schema.messages.create(params);
//        }

//        if (params.username === 'letme' && params.password === 'in') {
//            return { "access_token": "secret token!", "account_id": 1 };
//
//        } else {
//            return new Mirage.Response(403, {}, {errors: {title: ['Invalid Username Or Password']}});
//        }
    }); //end post => /token
    
}//end config
