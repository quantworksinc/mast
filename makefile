.PHONY: build push

build:
	docker build -t quantworks/mast:latest .
push:
	docker push quantworks/mast:latest
