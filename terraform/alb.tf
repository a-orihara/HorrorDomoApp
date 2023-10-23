# ---------------------------------------------
# alb
# ---------------------------------------------
# 1
resource "aws_lb" "portfolio_alb_tf" {
  desync_mitigation_mode           = "defensive"
  # dns_name                         = "portfolio-alb-741782418.ap-northeast-1.elb.amazonaws.com"
  drop_invalid_header_fields       = false
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = false
  enable_http2                     = true
  enable_waf_fail_open             = false
  idle_timeout                     = 60
  internal                         = false
  ip_address_type                  = "ipv4"
  load_balancer_type               = "application"
  name                             = "portfolio-alb"
  security_groups = [
    aws_security_group.portfolio_alb_sg_tf.id,
  ]
  subnets = [
    aws_subnet.portfolio_pub_subnet_a_tf.id,
    aws_subnet.portfolio_pub_subnet_c_tf.id,
  ]
  tags     = {}
  tags_all = {}
  # vpc_id   = aws_vpc.portfolio_vpc_tf.id
  # zone_id  = "Z14GRHDCWA56QT"
  # access_logs {
  #     enabled = false
  # }
  subnet_mapping {
    subnet_id = "subnet-02014c0834197d87c"
  }
  subnet_mapping {
    subnet_id = "subnet-09213ebf10410a7d3"
  }
  timeouts {}
}

# resource "aws_lb_listener" "alb_listener_http" {

# }
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- terraform importでaws_lbリソースをインポートするコマンドの書式:
terraform import aws_lb.<your_resource_name> <load_balancer_arn>


*/