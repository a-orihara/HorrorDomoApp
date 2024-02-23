# 1
# ================================================================================================
# RDS subnet group
# ================================================================================================
# RDSのサブネットグループのリソース
resource "aws_db_subnet_group" "rds_subnet_group" {
  description = "portfolio-rds-sg"
  name        = "portfolio-rds-sg"
  subnet_ids = [
    aws_subnet.priv_subnet_a.id,
    aws_subnet.priv_subnet_c.id,
  ]
  tags     = {}
  tags_all = {}
}

# ================================================================================================
# RDS "aws_db_instance"
# ================================================================================================
# 2 RDSインスタンスのリソース
resource "aws_db_instance" "mysql-rds-instance" {
  # RDSインスタンスに割り当てられたストレージのサイズを指定。5GBを割り当て。
  allocated_storage = 5
  # 2.1 デフォルトはfalse（しかしrds削除時はtrueにする）
  apply_immediately = false
  # マイナーバージョンの自動アップグレードを有効
  auto_minor_version_upgrade = true
  # RDSインスタンスをデプロイする利用可能なゾーン（Availability Zone）を指定
  availability_zone = "ap-northeast-1a"
  # バックアップの保持期間を指定。7日間の保持期間を設定。
  backup_retention_period = 7
  # バックアップの実行ウィンドウを指定。"13:13-13:43"の期間内にバックアップがスケジュール。
  backup_window = "13:13-13:43"
  # RDSインスタンスに使用するCA証明書の識別子を指定
  ca_cert_identifier = "rds-ca-2019"
  # インスタンスから作成されるスナップショットにタグをコピーするかどうかを指定
  copy_tags_to_snapshot = true
  # カスタマー所有のIP（Customer-Owned IP）を有効にするかどうかを指定
  customer_owned_ip_enabled = false
  # 作成した"aws_db_subnet_group"を指定。idではなくnameを指定
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  # 自動バックアップを削除するかどうかを指定
  delete_automated_backups = true
  # インスタンスの削除防止を有効にするかどうかを指定（しかし削除時はfalseにする）
  deletion_protection = true
  # クラウドウォッチログエクスポートを有効にするログの種類のリスト
  enabled_cloudwatch_logs_exports = []
  # データベースエンジンを指定
  engine = "mysql"
  # データベースエンジンのバージョンを指定
  engine_version = "8.0.33"
  # IAMデータベース認証を有効にするかどうかを指定
  iam_database_authentication_enabled = false
  # このidentifierがこのrdsインスタンスの名前。変数使用時はvar.を付ける。
  identifier = var.rds_instance_name
  # RDSインスタンスのインスタンスタイプを指定
  instance_class = "db.t3.micro"
  # インスタンスのプロビジョンドIOPSを指定。0：プロビジョンドIOPSは割り当てなし
  iops = 0
  # データベースのライセンスモデルを指定
  license_model = "general-public-license"
  # メンテナンスウィンドウを指定
  maintenance_window = "thu:19:58-thu:20:28"
  # 最大割り当てストレージサイズを指定
  max_allocated_storage = 0
  # モニタリングインターバルを指定。 60秒を指定
  monitoring_interval = 60
  # マルチAZ展開を有効にするかどうかを指定
  multi_az = false
  # オプショングループの名前を指定
  option_group_name = "default:mysql-8-0"
  # 2.2
  # password                              = var.mysql_db_password
  # パラメータグループの名前を指定
  parameter_group_name = "default.mysql8.0"
  # パフォーマンスインサイトを有効にするかどうかを指定
  performance_insights_enabled = false
  #  パフォーマンスインサイトのデータの保持期間を指定
  performance_insights_retention_period = 0
  # データベースにアクセスするためのポート番号を指定
  port = 3306
  # インターネットからのアクセスを有効にするかどうかを指定
  publicly_accessible = false
  # 2.3 インスタンスを削除する際に最終スナップショットをスキップするかどうかを指定。（rds削除時はtrueにする）。
  skip_final_snapshot = true
  # ストレージの暗号化を有効にするかどうかを指定
  storage_encrypted = true
  # ストレージのタイプを指定
  storage_type = "standard"
  tags         = {}
  tags_all     = {}
  # RDSインスタンスのではなく、MySQLデータベースに接続するためのMySQLのユーザー名を指定
  username = var.mysql_db_username
  # インスタンスに関連付けるセキュリティグループのIDのリスト
  vpc_security_group_ids = [
    # "セキュリティグループ：rds-ec2-1",
    aws_security_group.priv_sg.id,
  ]
  # リソースのタイムアウト設定
  timeouts {}
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
RDS作成に必要なリソースは、resource "aws_db_instance"の他、サブネットグループ。
必要であれば他にパラメーターグループ、オプショングループ。
------------------------------------------------------------------------------------------------
terraform import aws_db_subnet_group.<リソース名> <portfolio-rds-sg名>
実際の例：
terraform import aws_db_subnet_group.portfolio_rds_subnet_group portfolio-rds-sg

================================================================================================
2
"aws_db_instance"は、DB 識別子でimport

================================================================================================
2.1
apply_immediately:
パラメーターグループやセキュリティグループの変更など、RDSインスタンスに対する変更を即座に適用するかどうかを指定しま
す。true に設定されている場合、変更が即座に適用されます。これにより、変更が適用される前にインスタンスが再起動される
可能性があります。

================================================================================================
2.2
作成済みawsのrdsインスタンスをimportした場合、passwordは自動で取り込まない。
なので、改めてterraform applyする場合、こちらででpasswordを作成する必要がある。

================================================================================================
2.3
skip_final_snapshot:
RDSインスタンスを削除する際に、最終スナップショットを作成せずに削除するかどうかを指定します。true に設定されている
場合、最終スナップショットは作成されず、インスタンスが削除されます。この設定はデータのバックアップをスナップショット
として残すかどうかを制御します。最終スナップショットをスキップする場合、データは永久に失われる可能性があります。
*/