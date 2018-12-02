const Hapi = require('hapi'),
      Path = require('path');

// Create a server with a host and port
var server = new Hapi.Server({
});
server.connection({ port: 80 });

server.register(require('vision'), function(err) { if(err) throw err; });
server.register(require('inert'), function(err) { if(err) throw err; });

server.views({
  engines: {
    html: require('handlebars'),
  },
  path: __dirname,
  compileOptions: { pretty: true }
});

server.route({
    method: 'GET',
    path:'/{location*}',
    handler: (request, reply) => {
       reply.view('react/index');
    }
});

server.route({
  method: 'GET',
  path: '/assets/img/{param*}',
  handler: {
    directory: {
        path: Path.normalize(__dirname + '/../../assets/img')
    }
  }
});

server.route({
  method: 'GET',
  path: '/dist/{param*}',
  handler: {
    directory: {
        path: Path.normalize(__dirname + '/../../dist')
    }
  }
});


server.start(function(err) {
  console.log('Server listening...')
  if(err) throw err;
});
