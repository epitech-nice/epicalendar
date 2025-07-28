ENV_PATH := $(realpath .env)

.PHONY: init install launch default

all: install launch

init:
	@rm -f client/.env
	@rm -f server/.env
	@ln -s $(ENV_PATH) client/.env
	@ln -s $(ENV_PATH) server/.env
	@echo "Environment files linked successfully."

install: init
	@echo "Installing dependencies for server..."
	@cd server && npm install

	@cd ..

	@echo "Installing dependencies for client..."
	@cd client && npm install

launch:
	@echo "Starting the server..."
	@cd server && npm run build && npm run start &

	@echo "Starting the client..."
	@cd client && npm run build && npm run start
