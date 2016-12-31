export default function() {
//     this.namespace = '/api';

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
    
    this.post('/token', (schema, request) => {
        let params = request.requestBody;
        
        if (params.username === 'letme' && params.password === 'in') {
            return { "access_token": "567k345jsd1o34sdklsdf34534" };
        }
    }); //end post => /token
	
    this.get('/tools/:id', (schema, request) => {	
		return {
		  data: {
			type: "tool",
			id: request.params.id,
			attributes: {
				ownerfirstname: "Shaboygen",
				ownerlastname: "Cactapuss",
				datelastcheckout: "Stardate 0.12.4.12",
				purchasedate: "Stardate 020.2.3.23"
			}
		  }
		};
    }); //end get => /tools/:id	
    
    this.post('/tools', (schema, request) => {	
		console.log(request);
    }); //end post => /tools
    
    this.patch('/tools/:id', (schema, request) => {	
		console.log(request);
        console.log(params.id);
    }); //end post => /tools
    
}//end config
