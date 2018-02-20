var fs = require('fs');
var osprey = require('osprey');
var express = require('express');
var chokidar = require('chokidar');
var parser = require('raml-1-parser');
var mock = require('raml-mock-service');


var config = {
    port: 8080,
    parser: {
        rejectOnErrors: true
    },
    api: {
        serializeMetadata: false
    }
};
var server = null;

function startServer(filename) {
    console.log(`parsing RAML file ${filename}...`);
    parser.loadRAML(filename, config.parser)
        .then(api => {
            var raml = api.expand(true).toJSON(config.api);
            var app = express();
            app.use(osprey.server(raml));
            app.use(mock(raml));
            server = app.listen(config.port);
            console.log(`server up, listening on ${config.port}`);
        })
        .catch(err => {
            console.log(err);
        });
}

function fsEventHandler(filename) {
    if (server) {
        server.close(() => {
            startServer(filename);
        });
    } else {
        startServer(filename);
    }
}

var defaultSpec = '/srv/api.raml'
var customSpec = '/srv/api/api.raml'
var apiSpec = fs.existsSync(customSpec) ? customSpec : defaultSpec
var watcher = chokidar.watch(apiSpec);
watcher.on('ready', () => {
    fsEventHandler(apiSpec);
});

watcher.on('change', () => {
    console.log(`RAML file ${apiSpec} changed, reloading...`);
    fsEventHandler(apiSpec);
});
