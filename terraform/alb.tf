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
  # このコンフィギュレーションを適用した結果に基づいて自動的に決定されます。
  # vpc_id   = aws_vpc.portfolio_vpc_tf.id
  # zone_id  = "Z14GRHDCWA56QT"
  # access_logs {
  #     enabled = false
  # }
  subnet_mapping {
    subnet_id = aws_subnet.portfolio_pub_subnet_a_tf.id
  }
  subnet_mapping {
    subnet_id = aws_subnet.portfolio_pub_subnet_c_tf.id
  }
  timeouts {}
}

# ---------------------------------------------
# alb_listener
# ---------------------------------------------
# 2
resource "aws_lb_listener" "portfolio_alb_listener_http" {
  load_balancer_arn = aws_lb.portfolio_alb_tf.arn
  port              = 80
  protocol          = "HTTP"
  tags              = {}
  tags_all          = {}
  default_action {
      # エラーになるので一旦コメントアウト
      # order            = 0
      target_group_arn = aws_lb_target_group.portfolio_alb_tg_tf.arn
      type             = "forward"
  }
  timeouts {}
}

resource "aws_lb_listener" "portfolio_alb_listener_https" {
  load_balancer_arn = aws_lb.portfolio_alb_tf.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = "arn:aws:acm:ap-northeast-1:283956208428:certificate/218fb7a9-efb2-4a7a-a18d-1748db66fa8c"
  tags              = {}
  tags_all          = {}
  default_action {
      # order            = 0
      target_group_arn = aws_lb_target_group.portfolio_alb_tg_tf.arn
      type             = "forward"
  }
  timeouts {}
}

# ---------------------------------------------
# frontend_alb
# ---------------------------------------------
resource "aws_lb" "portfolio_frontend_alb_tf" {
  desync_mitigation_mode           = "defensive"
  # dns_name                         = "portfolio-frontend-alb-1834571258.ap-northeast-1.elb.amazonaws.com"
  drop_invalid_header_fields       = false
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = false
  enable_http2                     = true
  enable_waf_fail_open             = false
  idle_timeout                     = 60
  internal                         = false
  ip_address_type                  = "ipv4"
  load_balancer_type               = "application"
  name                             = "portfolio-frontend-alb"
  security_groups                  = [
      aws_security_group.portfolio_alb_frontend_sg_tf.id,
  ]
  subnets = [
  aws_subnet.portfolio_pub_subnet_a_tf.id,
  aws_subnet.portfolio_pub_subnet_c_tf.id,
  ]
  tags                             = {}
  tags_all                         = {}
  # vpc_id                           = "vpc-0fd0788c8a372ee22"
  # zone_id                          = "Z14GRHDCWA56QT"
  # access_logs {
  #     enabled = false
  # }
  subnet_mapping {
      subnet_id = aws_subnet.portfolio_pub_subnet_a_tf.id
  }
  subnet_mapping {
      subnet_id = aws_subnet.portfolio_pub_subnet_c_tf.id
  }
  timeouts {}
}



/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- terraform importでaws_lbリソースをインポートするコマンドの書式:
terraform import aws_lb.<your_resource_name> <load_balancer_arn>

2
terraform import aws_lb_listener.<NAME> <LISTENER_ARN>
*/