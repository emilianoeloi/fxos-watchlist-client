setup:
	@npm install
	@sudo npm install -g http-server
	@sudo npm install -g gulp
	@sudo npm install -g bower
	@npm install
	@cd src;@bower install

run:
	ifconfig | grep 255
	@http-server ./build & node server.js

watch:
	@gulp

compile:
	@gulp compile
