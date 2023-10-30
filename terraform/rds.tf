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
# 2
resource "aws_db_instance" "mysql-rds-instance" {
  allocated_storage          = 5
  auto_minor_version_upgrade = true
  availability_zone          = "ap-northeast-1a"
  backup_retention_period    = 7
  backup_window              = "13:13-13:43"
  ca_cert_identifier         = "rds-ca-2019"
  copy_tags_to_snapshot      = true
  customer_owned_ip_enabled  = false
  # 作成した"aws_db_subnet_group"を指定。idではなくnameを指定
  db_subnet_group_name                = aws_db_subnet_group.rds_subnet_group.name
  delete_automated_backups            = true
  # 削除防止するか
  deletion_protection                 = true
  enabled_cloudwatch_logs_exports     = []
  engine                              = "mysql"
  engine_version                      = "8.0.33"
  iam_database_authentication_enabled = false
  # このidentifierがこのrdsインスタンスの名前。変数使用時はvar.を付ける。
  identifier            = var.rds_instance_name
  instance_class        = "db.t3.micro"
  iops                  = 0
  license_model         = "general-public-license"
  maintenance_window    = "thu:19:58-thu:20:28"
  max_allocated_storage = 0
  monitoring_interval   = 60
  multi_az              = false
  option_group_name     = "default:mysql-8-0"
  # 2.1
  # password                              = var.mysql_db_password
  parameter_group_name                  = "default.mysql8.0"
  performance_insights_enabled          = false
  performance_insights_retention_period = 0
  port                                  = 3306
  publicly_accessible                   = false
  security_group_names                  = []
  # 削除時のスナップショットをスキップするか
  skip_final_snapshot                   = true
  storage_encrypted                     = true
  storage_type                          = "standard"
  tags                                  = {}
  tags_all                              = {}
  # usernameはRDSインスタンスのではなく、RDSインスタンスで使用されるMySQLのユーザー名。
  username = var.mysql_db_username
  vpc_security_group_ids = [
    # "セキュリティグループ：rds-ec2-1",
    aws_security_group.priv_sg.id,
  ]
  timeouts {}
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_db_subnet_group.<リソース名> <portfolio-rds-sg名>
実際の例：
terraform import aws_db_subnet_group.portfolio_rds_subnet_group portfolio-rds-sg

================================================================================================
2
"aws_db_instance"は、DB 識別子でimport

================================================================================================
2.1
作成済みawsのrdsインスタンスをimportした場合、passwordは自動で取り込まない。
なので、改めてterraform applyする場合、こちらででpasswordを作成する必要がある。
*/