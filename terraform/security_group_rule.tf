# ================================================================================================
# portfolio_pub in
# ================================================================================================
# 1
resource "aws_security_group_rule" "portfolio_pub_sg_in_http_ipv4_tf" {
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 80
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "portfolio_pub_sg_in_http_ipv6_tf" {
  cidr_blocks = []
  # 送信元ポートの設定
  from_port = 80
  ipv6_cidr_blocks = [
    # "::/0"はIPv6の全てのアドレスを表すCIDRブロックで、すべてのIPv6トラフィックを許可
    "::/0",
  ]
  # TCPプロトコルのトラフィックを許可
  protocol = "tcp"
  # このプロパティはIPv6のCIDRブロックを指定
  security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  to_port           = 80
  # インバウンドルール
  type = "ingress"
}

# ================================================================================================
# portfolio_pub out
# ================================================================================================
# 2 アウトバウンドはデフォルトの設定
resource "aws_security_group_rule" "portfolio_pub_sg_out_all_tf" {
  cidr_blocks = ["0.0.0.0/0"]
  # 送信元ポートの設定です。この値が0の場合、すべてのポートを許可することを意味します。
  from_port = 0
  # トラフィックのプロトコルを指定。"-1"はすべてのプロトコルを許可（制限しない）。
  ipv6_cidr_blocks  = []
  protocol          = "-1"
  security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  # 送信先ポートの設定です。同様に、この値も0の場合、すべてのポートを許可することを示しています。
  to_port = 0
  # アウトバウンドルール
  type = "egress"
}
resource "aws_security_group_rule" "portfolio_pub_sg_out_rds_tf" {
  # 競合する為、cidr_blocksとsource_security_group_idと同時に設定しない
  # cidr_blocks              = []
  from_port = 3306
  # 競合する為、cidr_blocksとsource_security_group_idと同時に設定しない
  # ipv6_cidr_blocks         = []
  protocol                 = "tcp"
  security_group_id        = aws_security_group.portfolio_pub_sg_tf.id
  source_security_group_id = aws_security_group.portfolio_priv_sg_tf.id
  to_port                  = 3306
  type                     = "egress"
}

# ================================================================================================
# portfolio_priv in
# ================================================================================================
resource "aws_security_group_rule" "portfolio_priv_sg_in_rds_tf" {
  from_port                = 3306
  protocol                 = "tcp"
  security_group_id        = aws_security_group.portfolio_priv_sg_tf.id
  source_security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  to_port                  = 3306
  type                     = "ingress"
}

# ================================================================================================
# portfolio_priv out
# ================================================================================================
resource "aws_security_group_rule" "portfolio_priv_sg_out_all_tf" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 0
  ipv6_cidr_blocks  = []
  protocol          = "-1"
  security_group_id = aws_security_group.portfolio_priv_sg_tf.id
  to_port           = 0
  type              = "egress"
}

# ================================================================================================
# portfolio_front in
# ================================================================================================
resource "aws_security_group_rule" "portfolio_front_sg_in_http_ipv4_tf" {
  cidr_blocks       = [
      "0.0.0.0/0",
  ]
  from_port         = 80
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.portfolio_front_sg_tf.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "portfolio_front_sg_in_http_ipv6_tf" {
    cidr_blocks       = []
    from_port         = 80
    ipv6_cidr_blocks  = [
        "::/0",
    ]
    protocol          = "tcp"
    security_group_id = aws_security_group.portfolio_front_sg_tf.id
    to_port           = 80
    type              = "ingress"
}

# ================================================================================================
# portfolio_front out
# ================================================================================================
resource "aws_security_group_rule" "portfolio_front_sg_out_all_tf" {
    cidr_blocks       = [
        "0.0.0.0/0",
    ]
    from_port         = 0
    ipv6_cidr_blocks  = []
    protocol          = "-1"
    security_group_id = aws_security_group.portfolio_front_sg_tf.id
    to_port           = 0
    type              = "egress"
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
1
- `aws_security_group_rule`リソースを`terraform import`する際の一般的なコマンド書式:
terraform import aws_security_group_rule.<resource_name> <sg_id>_<type>_<protocol>_<from_port>_<to_port>_<source/destination>
- 実際の例
iPV4:0.0.0.0/0
terraform import aws_security_group_rule.portfolio_pub_sg_in_http_ipv4_tf sg-0264949bc0da0c58e_ingress_tcp_80_80_0.0.0.0/0
iPV6:::/0
terraform import aws_security_group_rule.portfolio_front_sg_in_http_ipv6_tf sg-0420324d5aebff0c7_ingress_tcp_80_80_::/0
================================================================================================
2
アウトバウンドルール（デフォルトの設定）
タイプ：すべてのトラフィック、プロトコル：すべて、ポート範囲：すべて、送信先 ：カスタム 0.0.0.0/0は、
terraform import aws_security_group_rule.portfolio_pub_sg_out_all_tf sg-0264949bc0da0c58e_egress_all_0_65535_0.0.0.0/0
で取り込み

*/