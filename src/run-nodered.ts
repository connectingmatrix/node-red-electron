const http = require('http');
const express = require("express");
const WebSocket = require('ws');
const RED = require("../node_modules/node-red");


export default function startNodeRED(){

    // Create an Express app
    var app = express();
    
    // Create a server
    var REDserver = http.createServer(app);

    // Create the settings object - see default settings.js file for other options
    var settings = {
        httpAdminRoot: process.env.adminPath || "/red",
        httpNodeRoot: process.env.nodePath || "/api",
        userDir:".",
        httpStatic:"public",
        contextStorage: {
            default: {
                module:"localfilesystem",
                config: {
                    dir: "context"
                }
            }
        }
    };

    // Initialise the runtime with a server and settings
    RED.init(REDserver,settings);
    
    // Add a simple route for static content served from 'public'
    app.use("/",express.static(settings.httpStatic));
    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot,RED.httpAdmin);
    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot,RED.httpNode);
    
    REDserver.listen(process.env.NODE_PORT || 1880);
    
    // Start the runtime
    RED.start();
};