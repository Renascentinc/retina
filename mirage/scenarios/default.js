export default function(server) {
    server.createList('users', 10);
    server.createList('tool', 50);
    server.create('dropdowns');
}
