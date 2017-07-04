export default function() {
    this.namespace = 'api';
    this.urlPrefix = 'https://retina-api-develop.azurewebsites.net';

    this.post('/token', (schema, request) => {
        let { requestBody } = request;
        let sections = requestBody.split('&');

        let [ , username ] = sections[1].split('=');
        let [ , password ] = sections[2].split('=');

        if (username === 'username' && password === 'password') {
            return { ACCESS_TOKEN: '567k345jsd1o34sdklsdf34534', userid: 1, role: 'user', data: {} };
        } else {
            return { errors: { message: 'Invalid Username/Password' } };
        }
    });

    this.post('/tools', (schema, request) => {
        let { requestBody } = request;
        let { attributes } = JSON.parse(requestBody).data;
        let owner = schema.users.find(attributes.userid);

        attributes.username = owner.username;
        attributes.email = owner.email;
        attributes.phonenumber = owner.phonenumber;

        let newTool = schema.tools.new(attributes);
        newTool.save();
        return newTool;
    });

    this.put('/transfer', () => {
        // just leaving this empty for now
    });

    this.get('/tools/:id', (schema, request) => {
        return schema.tools.find(request.params.id);
    });

    this.get('/tools', (schema) => {
        return schema.tools.all();
    });

    this.get('/search', (schema, request) => {
        let query = {};
        let { queryParams } = request;

        (queryParams.currentUser !== '' && queryParams.currentUser) ? query.userid = queryParams.currentUser : '';
        (queryParams.status !== '') ? query.status = queryParams.status : '';
        (queryParams.userID !== '') ? query.userid = queryParams.userID : '';
        (queryParams.type !== '') ? query.type = queryParams.type : '';
        (queryParams.brand !== '') ? query.brand = queryParams.brand : '';

        if (Object.keys(query).length !== 0) {
            return schema.tools.where(query);
        }

        return schema.tools.all();
    });

    this.get('/users', (schema) => {
        return schema.users.all();
    });

    this.get('/dropdowns', (schema) => {
        return schema.dropdowns.first();
    });
}
