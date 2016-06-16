var Hapi = require('hapi');
var server = new Hapi.Server();

// Server config.
server.connection({port: 9090});

server.route({
  method: 'POST',
  path: '/{param*}',
  handler: function(request, reply) {
    console.log('\n' + request.method + ' - ' + request.path);
    console.log(request.payload);
    return reply('OK');
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
