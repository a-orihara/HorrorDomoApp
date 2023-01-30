# 1
du:
	docker-compose up --force-recreate

db:
	docker-compose build --no-cache

ds:
	docker system prune

# @          @@          @@          @@          @@          @@          @@          @
# 1
# {簡略化コマンド}:
# 	{実行コマンド(コマンドは1つ以上)}
# make {簡略化コマンド}