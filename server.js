var Hapi = require('hapi');
var Joi = require('joi');
var superagent = require('superagent');
var server = new Hapi.Server();

// Server config.
server.connection({ port: process.env.PORT || 8080 });

// Helpers for timeout.
var TIMEOUT_DURATION = 1000 * 60 * 5; // 5mins
var timeout = null;

// Routing.
server.route({
  method: 'POST',
  path: '/',
  config: {
    validate: {
      // Validate body.
      payload: {
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
        event: Joi.string().valid('message').required(),
        content: Joi.string().required(),
        external_user_name: Joi.string().required(),
        instant: Joi.boolean().valid(true)
      }
    }
  },
  handler: function(request, reply) {
    // Allow only one timeout set. Poor mans throttling ;(
    if (timeout) {
      return reply('ignored').code(429);
    }

    // Set timeout.
    timeout = setTimeout(function() {
      // Logging.
      console.log('Executing', request.payload);

      // Send request to given url.
      superagent.post(request.payload.url)
      .send({
        event: request.payload.event,
        content: request.payload.content,
        external_user_name: request.payload.external_user_name
      })
      .end();

      // Reset timeout.
      timeout = null;
    }, request.payload.instant ? 100 : TIMEOUT_DURATION);

    return reply('success');
  }
});

// Start server.
server.start(function(error) {
  if (error) {
    throw error;
  }
});
