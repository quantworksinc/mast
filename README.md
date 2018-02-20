# MAST - Mock API Server for Testing
A RAML configurable API server with hot-reloading.


#### Develop
Create a [RAML API spec](https://raml.org/developers/raml-100-tutorial).

Save it as api.raml.

#### Build
```
docker build -t my-api:latest .
```

#### Use with hot-reloading
To leverage hot-reloading, mount your `api.raml` to `/srv/api/api.raml`.

```
docker run -it --rm -p 8080:8080 -v $(pwd)/api.raml:/srv/api/api.raml my-api:latest
```

#### Use without hot-reloading
Once the API is ready, rebuild and run.
```
docker run -it --rm -p 8080:8080 my-api:latest
```

### License
MIT
