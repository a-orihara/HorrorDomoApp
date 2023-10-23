# ---------------------------------------------
# ALB
# ---------------------------------------------
# 1
# resource "aws_lb" "portfolio_alb_tf" {
# 読み込みの結果
# name                             = "portfolio-alb"
# internal                         = false
# load_balancer_type               = "application"
# security_groups                  = ["sg-0a8"]
# subnets                          = ["subnet-020", "subnet-092"]
# enable_deletion_protection       = false
# enable_cross_zone_load_balancing = true
# idle_timeout                     = 60
# enable_http2                     = true

# # access_logs {
# #     enabled = false
# # }

# subnet_mapping {
#     subnet_id = "subnet-020"
# }

# subnet_mapping {
#     subnet_id = "subnet-092"
# }

# timeouts {}
# }


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- terraform importでaws_lbリソースをインポートするコマンドの書式:
terraform import aws_lb.<your_resource_name> <load_balancer_arn>
*/