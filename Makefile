# 1
dud:
	docker-compose -f docker-compose.dev.yml up --force-recreate

dbd:
	docker-compose -f docker-compose.dev.yml build

dbdn:
	docker-compose -f docker-compose.dev.yml build --no-cache

dup:
	docker-compose -f docker-compose.prod.yml up --force-recreate

dbp:
	docker-compose -f docker-compose.prod.yml build

dbpn:
	docker-compose -f docker-compose.prod.yml build --no-cache

ds:
	docker system prune

# @          @@          @@          @@          @@          @@          @@          @
# 1
# {簡略化コマンド}:
# 	{実行コマンド(コマンドは1つ以上)}
# make {簡略化コマンド}