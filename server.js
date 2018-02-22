var fs = require('fs');
var http = require('http');
var https = require('https');
var osprey = require('osprey');
var express = require('express');
var chokidar = require('chokidar');
var parser = require('raml-1-parser');
var mock = require('raml-mock-service');


var config = {
    ports: {
        http: 8080,
        https: 8443
    },
    parser: {
        rejectOnErrors: true
    },
    api: {
        serializeMetadata: false
    },
    https: {
        requestCert: false,
        rejectUnauthorized: false,
        key: fs.readFileSync('./cert/ssl.key'),
        cert: fs.readFileSync('./cert/ssl.cert')
    }
};
var started = false;
var http_server = null;
var https_server = null;
var defaultSpec = '/srv/api.raml'
var customSpec = '/srv/api/api.raml'
var apiSpec = fs.existsSync(customSpec) ? customSpec : defaultSpec
var watcher = chokidar.watch(apiSpec);

function startServer(filename) {
    console.log(`parsing RAML file ${filename}...`);
    parser.loadRAML(filename, config.parser)
        .then(api => {
            var raml = api.expand(true).toJSON(config.api);
            var app = express();
            app.use(osprey.server(raml));
            app.use(mock(raml));
            http_server = http.createServer(app);
            https_server = https.createServer(config.https, app);
            http_server.listen(config.ports.http);
            https_server.listen(config.ports.https);
            console.log('server up, listening on:');
            console.log(` http:  ${config.ports.http}`);
            console.log(` https: ${config.ports.https}`);
            started = true;
        })
        .catch(err => {
            console.log(err);
        });
}

function fsEventHandler(filename) {
    if (started) {
        http_server.close(() => {
            https_server.close(() => {
                startServer(filename);
            });
        });
    } else {
        startServer(filename);
    }
}

function main() {
    watcher.on('ready', () => {
        fsEventHandler(apiSpec);
    });

    watcher.on('change', () => {
        console.log(`RAML file ${apiSpec} changed, reloading...`);
        fsEventHandler(apiSpec);
    });
}

main();
