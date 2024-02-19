# ================================================================================================
# pub in
# ================================================================================================
# 1
resource "aws_security_group_rule" "pub_sg_in_http_ipv4" {
  # ipv4
  cidr_blocks      = ["0.0.0.0/0"]
  from_port        = 80
  ipv6_cidr_blocks = []
  protocol         = "tcp"
  # このルールを設定するセキュリティグループを指定
  security_group_id = aws_security_group.pub_sg.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "pub_sg_in_http_ipv6" {
  cidr_blocks = []
  # セキュリティグループへの送信元のポートの設定
  from_port = 80
  # ipv6
  ipv6_cidr_blocks = [
    # "::/0"はIPv6の全てのアドレスを表すCIDRブロックで、すべてのIPv6トラフィックを許可
    "::/0",
  ]
  # TCPプロトコルのトラフィックを許可
  protocol = "tcp"
  # このプロパティはIPv6のCIDRブロックを指定
  security_group_id = aws_security_group.pub_sg.id
  to_port           = 80
  # インバウンドルール
  type = "ingress"
}

# ================================================================================================
# pub out
# ================================================================================================
# 2 アウトバウンドはデフォルトの設定
resource "aws_security_group_rule" "pub_sg_out_all" {
  cidr_blocks = ["0.0.0.0/0"]
  # 送信元ポートの設定です。この値が0の場合、すべてのポートを許可することを意味します。
  from_port        = 0
  ipv6_cidr_blocks = []
  # トラフィックのプロトコルを指定。"-1"はすべてのプロトコルを許可（制限しない）。
  protocol          = "-1"
  security_group_id = aws_security_group.pub_sg.id
  # 送信先ポートの設定です。同様に、この値も0の場合、すべてのポートを許可することを示しています。
  to_port = 0
  # アウトバウンドルール
  type = "egress"
}
# 2.1
resource "aws_security_group_rule" "pub_sg_out_rds" {
  # 競合する為、cidr_blocksとsource_security_group_idと同時に設定しない
  # cidr_blocks              = []
  from_port = 3306
  # 競合する為、cidr_blocksとsource_security_group_idと同時に設定しない
  # ipv6_cidr_blocks         = []
  protocol                 = "tcp"
  security_group_id        = aws_security_group.pub_sg.id
  source_security_group_id = aws_security_group.priv_sg.id
  to_port                  = 3306
  type                     = "egress"
}

# ================================================================================================
# priv in
# ================================================================================================
resource "aws_security_group_rule" "priv_sg_in_rds" {
  from_port                = 3306
  protocol                 = "tcp"
  security_group_id        = aws_security_group.priv_sg.id
  source_security_group_id = aws_security_group.pub_sg.id
  to_port                  = 3306
  type                     = "ingress"
}

# ================================================================================================
# priv out
# ================================================================================================
# 教材がデフォルトのままの設定をしているので、それに倣って下記のように設定
resource "aws_security_group_rule" "priv_sg_out_all" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 0
  ipv6_cidr_blocks  = []
  protocol          = "-1"
  security_group_id = aws_security_group.priv_sg.id
  to_port           = 0
  type              = "egress"
}

# ================================================================================================
# front in
# ================================================================================================
resource "aws_security_group_rule" "front_sg_in_http_ipv4" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 80
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.front_sg.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "front_sg_in_http_ipv6" {
  cidr_blocks = []
  from_port   = 80
  ipv6_cidr_blocks = [
    "::/0",
  ]
  protocol          = "tcp"
  security_group_id = aws_security_group.front_sg.id
  to_port           = 80
  type              = "ingress"
}

# ================================================================================================
# front out
# ================================================================================================
# 教材がデフォルトのままの設定をしているので、それに倣って下記のように設定
resource "aws_security_group_rule" "front_sg_out_all" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 0
  ipv6_cidr_blocks  = []
  protocol          = "-1"
  security_group_id = aws_security_group.front_sg.id
  to_port           = 0
  type              = "egress"
}

# ================================================================================================
# alb_frontend in
# ================================================================================================
resource "aws_security_group_rule" "alb_frontend_sg_in_http_ipv4" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 80
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_frontend_sg.id
  to_port           = 80
  type              = "ingress"
}
resource "aws_security_group_rule" "alb_frontend_sg_in_https_ipv4" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 443
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_frontend_sg.id
  to_port           = 443
  type              = "ingress"
}

resource "aws_security_group_rule" "alb_frontend_sg_in_http_ipv6" {
  cidr_blocks = []
  from_port   = 80
  ipv6_cidr_blocks = [
    "::/0",
  ]
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_frontend_sg.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "alb_frontend_sg_in_https_ipv6" {
  cidr_blocks = []
  from_port   = 443
  ipv6_cidr_blocks = [
    "::/0",
  ]
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_frontend_sg.id
  to_port           = 443
  type              = "ingress"
}

# ================================================================================================
# alb_frontend out
# ================================================================================================
# 3
resource "aws_security_group_rule" "alb_frontend_sg_out_front" {
  from_port = 80
  protocol  = "tcp"
  # ルールが適用されるセキュリティグループ
  security_group_id = aws_security_group.alb_frontend_sg.id
  # アクセス許可のソース（このセキュリティグループからのトラフィックのみ許可）を設定
  source_security_group_id = aws_security_group.front_sg.id
  to_port                  = 80
  type                     = "egress"
}

# ================================================================================================
# alb in
# ================================================================================================
resource "aws_security_group_rule" "alb_sg_in_http_ipv4" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 80
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_sg.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "alb_sg_in_https_ipv4" {
  cidr_blocks = [
    "0.0.0.0/0",
  ]
  from_port         = 443
  ipv6_cidr_blocks  = []
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_sg.id
  to_port           = 443
  type              = "ingress"
}

resource "aws_security_group_rule" "alb_sg_in_http_ipv6" {
  cidr_blocks = []
  from_port   = 80
  ipv6_cidr_blocks = [
    "::/0",
  ]
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_sg.id
  to_port           = 80
  type              = "ingress"
}

resource "aws_security_group_rule" "alb_sg_in_https_ipv6" {
  cidr_blocks = []
  from_port   = 443
  ipv6_cidr_blocks = [
    "::/0",
  ]
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_sg.id
  to_port           = 443
  type              = "ingress"
}

# ================================================================================================
# alb out
# ================================================================================================
resource "aws_security_group_rule" "alb_sg_out_pub" {
  from_port         = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.alb_sg.id
  # アクセス許可のソース（このセキュリティグループからのトラフィックのみ許可）を設定
  source_security_group_id = aws_security_group.pub_sg.id
  to_port                  = 80
  type                     = "egress"
}
/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
1
- `aws_security_group_rule`リソースを`terraform import`する際の一般的なコマンド書式:
terraform import aws_security_group_rule.<resource_name> <sg_id>_<type>_<protocol>_<from_port>_<to_port>_<source/destination>
- 実際の例
iPV4:0.0.0.0/0
terraform import aws_security_group_rule.pub_sg_in_http_ipv4 sg-0264949bc0da0c58e_ingress_tcp_80_80_0.0.0.0/0
iPV6:::/0
terraform import aws_security_group_rule.portfolio_front_sg_in_http_ipv6_tf sg-0420324d5aebff0c7_ingress_tcp_80_80_::/0
------------------------------------------------------------------------------------------------
インバウンドルールのfrom_portとto_portに関する説明
- from_port: 80
理由: HTTPの通信は通常ポート80で行われます。インバウンドルールでタイプがHTTPと指定されている場合、起点となるポー
ト番号は80になります。
- to_port: 80
理由: このインバウンドルールはHTTP通信専用であり、HTTPはポート80を使用します。そのため、終点のポート番号も80に設
定されます。

================================================================================================
2
アウトバウンドルール（デフォルトの設定）
タイプ：すべてのトラフィック、プロトコル：すべて、ポート範囲：すべて、送信先 ：カスタム 0.0.0.0/0は、
terraform import aws_security_group_rule.pub_sg_out_all sg-0264949bc0da0c58e_egress_all_0_65535_0.0.0.0/0
で取り込み

================================================================================================
2.1
実際の例：
terraform import aws_security_group_rule.pub_sg_out_rds sg-0264949bc0da0c58e_egress_tcp_3306_3306_sg-0d7c0a2fc71b1dd46

================================================================================================
3
terraform import aws_security_group_rule.<resource_name> <sg_id>_<type>_<protocol>_<from_port>_<to_port>_<ソースのsgのid>
実際の例：
terraform import aws_security_group_rule.portfolio_alb_frontend_sg_out_front_tf sg-06e863d201ecb782a_egress_tcp_80_80_sg-0420324d5aebff0c7
*/