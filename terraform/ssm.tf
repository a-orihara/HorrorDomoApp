# ================================================================================================
# SSM "aws_ecr_repository"
# ================================================================================================

# 1
resource "aws_ssm_parameter" "ssm_parameter" {
  data_type   = "text"
  description = "portfolio_asm_rails_master_key"
  name        = "portfolio_asm_rails_master_key"
  tags        = {}
  tags_all    = {}
  tier        = "Standard"
  type        = "String"
  value       = var.rails_master_key
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_ssm_parameter.<name> <パラメーター名>
実際の例：
terraform import aws_ssm_parameter.ssm_parameter portfolio_asm_rails_master_key
------------------------------------------------------------------------------------------------
aws_ssm_parameterでの略語はssmです。AWS Systems Managerは以前は「Simple Systems Manager（SSM）」と呼ば
れていました。
*/