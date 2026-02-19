############################ VARIABLES ########################################
LOCAL_ENV_PATH	=	$(realpath .env)

DC				=	docker compose
DEV_COMPOSE		=	docker-compose.yml
PROD_COMPOSE	=	docker-compose.prod.yml
###############################################################################



############################ RULES ############################################
.PHONY: \
	all init install build launch-dev launch-prod \ # Local development
	dev-up dev-down dev-logs dev-restart \ # Development environment
	prod-up prod-down prod-logs prod-restart \ # Production environment
	clean fclean \ # Clean

###############################################################################



############################ LOCAL ############################################
all: install build

init:
	@rm -f client/.env
	@rm -f server/.env
	@ln -s $(LOCAL_ENV_PATH) client/.env
	@ln -s $(LOCAL_ENV_PATH) server/.env
	@echo "Environment files linked successfully."

install: init
	@echo "Installing dependencies"
	@pnpm install

build:
	@echo "Building the project..."
	@pnpm full-build

launch-dev:
	@echo "Starting the development server..."
	@pnpm dev

launch-prod:
	@echo "Starting the server..."
	@pnpm start
###############################################################################



############################ DEV ##############################################
dev-up:
	@$(DC) -f $(DEV_COMPOSE) up -d --build

dev-down:
	@$(DC) -f $(DEV_COMPOSE) down

dev-logs:
	@$(DC) -f $(DEV_COMPOSE) logs -f

dev-restart: dev-down dev-up
###############################################################################



############################ PROD #############################################
prod-up:
	@$(DC) -f $(PROD_COMPOSE) up -d --build

prod-down:
	@$(DC) -f $(PROD_COMPOSE) down

prod-logs:
	@$(DC) -f $(PROD_COMPOSE) logs -f

prod-restart: prod-down prod-up
###############################################################################



############################ CLEAN ############################################
clean: dev-down
	@pnpm clean
	@rm -f client/.env
	@rm -f server/.env
	@docker volume prune -f
	@docker image prune -f

fclean: clean
	@read -p "Are you sure you want to clean everything (the mongodb will be reset) ? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		$(DC) -f $(DEV_COMPOSE) down -v; \
		$(DC) -f $(PROD_COMPOSE) down -v; \
		echo "All volumes removed."; \
	else \
		echo "Aborted."; \
	fi
###############################################################################
