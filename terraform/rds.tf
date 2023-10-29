# ================================================================================================
# RDS subnet group
# ================================================================================================
resource "aws_db_subnet_group" "portfolio_rds_subnet_group" {
  description = "portfolio-rds-sg"
  name        = "portfolio-rds-sg"
  subnet_ids  = [
      "subnet-030c2ad71163c3d8e",
      "subnet-0eccc0ac6aad86dba",
  ]
  tags        = {}
  tags_all    = {}
}

/*
terraform import aws_db_subnet_group.<リソース名> <portfolio-rds-sg名>
実際の例：
terraform import aws_db_subnet_group.portfolio_rds_subnet_group portfolio-rds-sg
*/