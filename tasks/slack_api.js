/*
 * grunt-slack-api
 * https://github.com/nerrad/grunt-slack-api
 *
 * Copyright (c) 2015 Darren Ethier
 * Licensed under the MIT license.
 */

'use strict';

var request = require( 'superagent' );

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('slack_api', 'A more comprehensive slack api integration using grunt.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();
        var done = this.async();
        var data = {
            type : ! this.data.type ? 'message' : this.data.type,
            text : this.data.text
        }

        /** verify there is a token **/
        if ( ! options.token ) {
            grunt.log.error( 'Token is required for Slack API requests' );
            return;
        }

        /** channel? **/
        if ( this.data.channel) {
            data.channel = this.data.channel;
        } else {
            data.channel = '#general';
        }

        /** set up options and defaults **/
        if ( ! options.endpoint ) {
            options.endpoint = 'https://slack.com/api/';
        }


        /** setup various data depending on type of api request **/
        switch ( data.type ) {
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
                if ( this.data.attachments ) {
                    data.attachments = this.data.attachments;
                }
                if ( typeof this.data.as_user !== 'undefined' ) {
                    data.as_user = this.data.as_user;
                }
                if ( this.data.username ) {
                    data.username = this.data.username;
                } else {
                    data.as_user = true;
                }
                if ( this.data.parse ) {
                    data.parse = this.data.parse;
                }
                if ( typeof this.data.link_names !== 'undefined' ) {
                    data.link_names = this.data.link_names;
                }
                if ( typeof this.data.unfurl_links !== 'undefined' ) {
                    data.unfurl_links = this.data.unfurl_links;
                }
                if ( typeof this.data.unfurl_media !== 'undefined' ) {
                    data.unfurl_media = this.data.unfurl_media;
                }
                if ( this.data.icon_url ) {
                    data.icon_url = this.data.icon_url;
                }
                if ( this.data.icon_emoji ) {
                    data.icon_emoji = this.data.icon_emoji
                }
                break;
        }

        request.post( options.endpoint )
            .type( 'form' )
            .send( 'payload=' + JSON.stringify(data) )
            .end( function(res ) {
                if ( ! res.ok ) {
                    grunt.log.error( 'Error with slack api: ', res.text );
                    return done(false);
                }
                grunt.log.writeln( "Finished communicating with slack." );
                done();
            })
            .on( 'error', function(err) {
                //handling network error
                grunt.log.error( 'Error communicating with slack: ', err.message );
                done(false);
            });
    });
};
