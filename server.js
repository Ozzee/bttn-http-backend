var Hapi = require('hapi');
var Joi = require('joi');
var superagent = require('superagent-bluebird-promise');
var Promise = require('bluebird');
var server = new Hapi.Server();

// Server config.
server.connection({port: process.env.PORT || 8080});

// Helpers for timeout.
var TIMEOUT_DELAY = 1000 * 60; // Minutes
var timeout = null;

// Routing.
server.route({
  method: 'POST',
  path: '/',
  config: {
    validate: {
      // Validate body.
      payload: {
        url: Joi.string().uri({scheme: ['http', 'https']}).required(),
        event: Joi.string().valid('message').required(),
        content: Joi.string().required(),
        external_user_name: Joi.string().required(),
        thread_id: Joi.string(),
        delay: Joi.number().integer().min(0).max(60),
        gif: Joi.string()
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

      // Request data.
      var data = {
        event: request.payload.event,
        content: request.payload.content,
        external_user_name: request.payload.external_user_name,
        thread_id: request.payload.thread_id || ''
      };

      // New promise for fetching gif.
      new Promise(function(resolve, reject) {
        // No gif keyword given, resolve promise.
        if (!request.payload.gif) {
          resolve(false);
        }

        superagent
          .get('http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=coffee&limit=0')
          .then(function(result) {
            var index = Math.floor(Math.random() * result.body.pagination.total_count);
            // Fetch gif and resolve with its URL.
            superagent
              // Using public beta key: https://github.com/Giphy/GiphyAPI#public-beta-key
              .get('http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + request.payload.gif + '&limit=1&offset=' + index)
              .then(function(result) {
                resolve(result.body.data[0].images.downsized.url);
              });
          })
          .catch(function(err) {
            resolve(false);
          });
      })
      .then(function(image_url) {
        // If got gif, append to message content.
        if (image_url) {
          data.content += ' ' + image_url;
        }

        // Send request to given url.
        return superagent.post(request.payload.url).send(data);
      })
      .then()
      .catch(function(err) {
        console.log(err);
      })
      .finally(function() {
        timeout = null;
      });
    }, request.payload.delay ? TIMEOUT_DELAY * request.payload.delay : 100);

    return reply('success');
  }
});

// Start server.
server.start(function(err) {
  if (err) {
    throw err;
  }
});
