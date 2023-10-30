# ================================================================================================
# RDS subnet group
# ================================================================================================
# RDSのサブネットグループのリソース
resource "aws_db_subnet_group" "rds_subnet_group" {
  description = "portfolio-rds-sg"
  name        = "portfolio-rds-sg"
  subnet_ids  = [
      aws_subnet.priv_subnet_a.id,
      aws_subnet.priv_subnet_c.id,
  ]
  tags        = {}
  tags_all    = {}
}

/*
terraform import aws_db_subnet_group.<リソース名> <portfolio-rds-sg名>
実際の例：
terraform import aws_db_subnet_group.portfolio_rds_subnet_group portfolio-rds-sg
*/