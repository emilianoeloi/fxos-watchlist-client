setup:
	@npm install
	@sudo npm install -g http-server
	@sudo npm install -g gulp
	@sudo npm install -g bower
	@npm install
	@cd src;@bower install
	@cd src;@git clone git@github.com:mdn/gaia-2.0-bb.git

run:
	ifconfig | grep 255
	@http-server ./build & node server.js

watch:
	@gulp clear;gulp

compile:
	@gulp clear;gulp compile
