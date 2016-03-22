# bttn-http-backend

Super simple [bt.tn](https://bt.tn) backend used to send delayed messages to Tammerforce Flowdock channel.


## `POST /`

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
