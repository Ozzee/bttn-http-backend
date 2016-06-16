# bttn-http-backend

Super simple [bt.tn](https://bt.tn) backend used to send delayed messages to Tammerforce Flowdock channel.

## Getting started

Install npm packages: `npm install`

Run server: `node server.js`

### `POST /`

* `url` Valid target URL where request will be sent.
* `event` Event type. Currently only `message` is supported.
* `content` Message content.
* `external_user_name` Sender of the message
* `delay` Delay of minutes (between 0 and 60) after which to send the message.
* `gif` Keyword to search a random GIF from [Giphy](http://giphy.com)

## Example request
```
{
  "url": "http://api.flowdock.com/flows/acme/main/messages,
  "event": "message",
  "content": "Fresh coffee!",
  "external_user_name": "CoffeeBot",
  "gif": "coffee",
  "delay": 5
}
```

For debugging you can use `node debugger.js`. It will respond OK to all POST requests on port 9090 and console.log the request.

## Deployment

### now

This project can be deployed to [now](https://zeit.co/now) out of the box. Read the instruction to set it up [here](https://zeit.co/now#get-started). And then just run: `now` inside the project folder.