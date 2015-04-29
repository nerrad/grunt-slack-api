/*
 * grunt-slack-api
 * https://github.com/nerrad/grunt-slack-api
 *
 * Copyright (c) 2015 Darren Ethier
 * Licensed under the MIT license.
 */

'use strict';

var request = require( 'superagent' );
var querystring = require('querystring');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('slack_api', 'A more comprehensive slack api integration using grunt.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();
        var done = this.async();
        var data = {
            type : ! options.type ? 'message' : options.type,
            text : options.text
        }

        /** verify there is a token **/
        if ( ! options.token ) {
            grunt.log.error( 'Token is required for Slack API requests' );
            return;
        } else {
            data.token = options.token;
        }


        /** channel? **/
        if ( options.channel) {
            data.channel = options.channel;
        } else {
            data.channel = '#general';
        }

        /** set up options and defaults **/
        if ( ! options.endpoint ) {
            options.endpoint = 'https://slack.com/api/';
        }


        /** setup various data depending on type of api request **/
        switch ( data.type ) {
            case 'getChannelInfo' :
                options.endpoint += 'channels.info';
                if ( ! options.callback ) {
                    grunt.log.error( 'Callback is required for handling the response of a channel info call.' );
                    return;
                }
                break;
            case 'topic' :
                options.endpoint += 'channels.setTopic';
                data.topic = data.text;
                break;
            case 'message' :
                options.endpoint += 'chat.postMessage';
                /**
                 * attachment?
                 * todo: need to do some validation of the attachment(s) coming in
                 **/
                if ( options.attachments ) {
                    data.attachments = JSON.stringify(options.attachments);
                }
                if ( typeof options.as_user !== 'undefined' ) {
                    data.as_user = options.as_user;
                }
                if ( options.username ) {
                    data.username = options.username;
                } else {
                    data.as_user = true;
                }
                if ( options.parse ) {
                    data.parse = options.parse;
                }
                if ( typeof options.link_names !== 'undefined' ) {
                    data.link_names = options.link_names;
                }
                if ( typeof options.unfurl_links !== 'undefined' ) {
                    data.unfurl_links = options.unfurl_links;
                }
                if ( typeof options.unfurl_media !== 'undefined' ) {
                    data.unfurl_media = options.unfurl_media;
                }
                if ( options.icon_url ) {
                    data.icon_url = options.icon_url;
                }
                if ( options.icon_emoji ) {
                    data.icon_emoji = options.icon_emoji
                }

                if ( options.fields ) {
                    data.fields = JSON.stringify( options.fields );
                }
                break;
        }

        console.log(data);
        var stringified = querystring.stringify(data);


        request.post( options.endpoint )
            .type('form')
            .send( stringified )
            .end( function(res ) {
                console.log(res.text);
                if ( ! res.ok ) {
                    grunt.log.error( 'Error with slack api: ', res.text );
                    return done(false);
                }
                grunt.log.writeln( "Finished communicating with slack." );
                if ( options.callback ) {
                    options.callback( JSON.parse( res.text ) );
                }
                done();
            })
            .on( 'error', function(err) {
                //handling network error
                grunt.log.error( 'Error communicating with slack: ', err.message );
                done(false);
            });
    });
};
