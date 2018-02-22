# MAST - Mock API Server for Testing
A configurable API server for mocking.

MAST was created to facilitate rapid mocking of APIs. This supports:

- unit/integration testing of external APIs
- frontend development against yet-to-be-developed services

Get the image at [Docker Hub](https://hub.docker.com/r/quantworks/mast/).

#### Develop an API
Create an `api.raml` file compliant with the [RAML API spec](https://raml.org/developers/raml-100-tutorial).

Pull the MAST container.
```
docker pull quantworks/mast
```

Run the container with your `api.raml` mounted to `/srv/api/api.raml`. This allows you to edit/save your `api.raml` and the server will hot-reload the API.
```
docker run -it --rm \
    -p 8080:8080 \
    -p 8443:8443 \
    -v $(pwd)/api.raml:/srv/api/api.raml \
    quantworks/mast:latest
```

Test it!
```
curl -s http://0.0.0.0:8080/endpoint | jq .
curl -sk https://0.0.0.0:8080/endpoint | jq .
```


#### Create a new mock service
Create a `Dockerfile`.
```
FROM quantworks/mast:latest
```
Write an `api.raml` file. Then build and run your container.
```
docker build -t my-api:latest .
docker run -it --rm \
    -p 8080:8080 \
    -p 8443:8443 \
    my-api:latest
```
Test it!
```
curl -s http://0.0.0.0:8080/endpoint | jq .
curl -sk https://0.0.0.0:8080/endpoint | jq .
```

### License
MIT
