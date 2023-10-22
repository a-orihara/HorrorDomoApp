resource "aws_security_group_rule" "portfolio_pub_sg_in_http_ipv4_tf" {
  cidr_blocks = ["0.0.0.0/0"]
  from_port   = 80
  ipv6_cidr_blocks  = []
  protocol = "tcp"
  security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  to_port = 80
  type    = "ingress"
}