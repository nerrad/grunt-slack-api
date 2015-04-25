# grunt-slack-api

> A more comprehensive slack api integration using grunt.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-slack-api --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-slack-api');
```

## The "slack_api" task

### Overview
In your project's Gruntfile, add a section named `slack_api` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  slack_api: {
    options: {
      token : 'api-token-from-slack',
    },
    your_target: {
      type : 'message',
      channel : '#general',
      text : 'Your message',
      attachments: [
        {
                    "fallback": "Required plain-text summary of the attachment.",
                    "color": "#36a64f",
                    "pretext": "Optional text that appears above the attachment block",
                    "author_name": "Bobby Tables",
                    "author_link": "http://flickr.com/bobby/",
                    "author_icon": "http://flickr.com/icons/bobby.jpg",
                    "title": "Slack API Documentation",
                    "title_link": "https://api.slack.com/",
                    "text": "Optional text that appears within the attachment",
                    "fields": [
                        {
                            "title": "Priority",
                            "value": "High",
                            "short": false
                        }
                    ],
                    "image_url": "http://my-website.com/path/to/image.jpg"
                }
      ],
      as_user : false,
      username : 'GruntSlackBot',
      parse : 'full',
      link_names : 1,
      unfurl_links : true,
      unfurl_media : false,
      icon_url : '',
      icon_emoji : ':chart_with_upwards_trend:'
    },
  },
});
```

### Options

#### options.token
type: `String`
Default value: '',

This is the authorization token for Slack API requests.  Get your token from here -> https://api.slack.com/web#basics

#### options.endpoint
Type: `String`
Default value: `https://slack.com/api/`

This option is not required and is the base endpoint for the api requests to slack.  Only use this if the slack endpoint changes form the default.

### Custom Options

The below are options you add to "your_target" object for what you want to do.

#### your_target.type
Type: `String`
Default value: `message`

The default type of slack api request you are making. Currently there are only two types available:

- `message` : Uses the Slack `chat.postMessage` endpoint (see https://api.slack.com/methods/chat.postMessage)
- `topic` : Uses the Slack `channels.setTopic` endpoint (see https://api.slack.com/methods/channels.setTopic)

#### your_target.channel
Type: `String`
Default value: `#general`

The channel to send the request to.  If not set `#general` is the default.

#### your_target.text
Type: `String`
Default value: ''

When "topic" is the `your_target.type`, the content of this string is used for the topic.  Otherwise, this is the content posted to the channel. Follow the formatting guidelines here: https://api.slack.com/docs/formatting

#### your_target.attachments
Type: `Array`
Default value: null

This is optional.  You can follow guidelines on attachment setup here: https://api.slack.com/docs/attachments

#### Other keys

For all of the below keys, see https://api.slack.com/methods/chat.postMessage, these are only used when `your_target.type` is set to "message".

- your_target.as_user
- your_target.username
- your_target.parse
- your_target.link_names
- your_target.unfurl_links
- your_target.unfurl_media
- your_target.icon_url
- your_target.icon_emoji
