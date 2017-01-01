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
            return { "access_token": "567k345jsd1o34sdklsdf34534", userid: 189823748 };
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
	
	this.get('/tools', function() {
    return {
      data: [{
        type: 'tool',
        id: '1',
        attributes: {
          brand: 'Bosch',
          ownerfirstname: 'George',
          ownerlastname: 'Boole',
		  type: 'hammer drill',
		  status: 'in use'
        }
      }, {
        type: 'tool',
        id: '2',
        attributes: {
          brand: 'DeWalt',
          ownerfirstname: 'Mike',
          ownerlastname: 'Flag',
		  type: 'impact driver',
		  status: 'in use'
        }
      }, {
        type: 'tool',
        id: '3',
        attributes: {
          brand: 'Milwaukee',
          ownerfirstname: 'Charlie',
          ownerlastname: 'Delta',
		  type: 'reciprocating saw',
		  status: 'available'
        }
      }, {
        type: 'tool',
        id: '3',
        attributes: {
          brand: 'Milwaukee',
          ownerfirstname: 'Charlie',
          ownerlastname: 'Delta',
		  type: 'reciprocating saw',
		  status: 'available'
        }
      }, {
        type: 'tool',
        id: '234',
        attributes: {
          brand: 'Milwaukee',
          ownerfirstname: 'Charlie',
          ownerlastname: 'Delta',
		  type: 'reciprocating saw',
		  status: 'available'
        }
      }, {
        type: 'tool',
        id: '10',
        attributes: {
          brand: 'Milwaukee',
          ownerfirstname: 'Charlie',
          ownerlastname: 'Delta',
		  type: 'reciprocating saw',
		  status: 'available'
        }
      }, {
        type: 'tool',
        id: '5',
        attributes: {
          brand: 'Milwaukee',
          ownerfirstname: 'Charlie',
          ownerlastname: 'Delta',
		  type: 'reciprocating saw',
		  status: 'available'
        }
      }]
    };
  });
	
	this.get('/status', function() {
    return ['in-use', 'available', 'out of service'];
  	});
	
	this.get('/owners', function() {
    return {
      data: [{
        type: 'owner',
        id: '1',
        attributes: {
          ownerid: '12345',
		  firstname: 'george',
		  lastname: 'boole'
        }
      }, {
        type: 'owner',
        id: '2',
        attributes: {
          id: '43215',
		  firstname: 'charlie',
		  lastname: 'delta'
        }
	  },
	  {
        type: 'owner',
        id: '3',
        attributes: {
          id: '54326',
		  firstname: 'mike',
		  lastname: 'flag'
        }
      }]
    };
  });
	
  this.get('/type', function() {
    return ["hammer drill", "reciprocating saw", "impact driver"];
  });
    
  this.get('/providers', function() {
    return ["jobsite supply", "home depot", "ace hardware", "lowes"];
  });  
    
  this.get('/brands', function() {
    return ["milwuake", "black & decker", "dewalt", "bosch"];
  });      
    
  this.put('/transfer', (schema, request) => {
    console.log( request.requestBody );
  }); //end post => /token    
}//end config