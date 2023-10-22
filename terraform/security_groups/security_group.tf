# ================================================================================================
# Security Group "pub"
# ================================================================================================
# 1 ここでは、セキュリティグループのルールを除外する(no ingress or egress rules)
resource "aws_security_group" "portfolio_pub_sg_tf" {
  # 1.1
  description = "portfolio-pub-sg"
  name        = "portfolio-pub-sg"
  vpc_id      = aws_vpc.portfolio_vpc_tf.id
}

# ------------------------------------------------------------------------------------------------
# aws_security_group_rule out
# ------------------------------------------------------------------------------------------------
# 1.2
resource "aws_security_group_rule" "portfolio_pub_sg_in_http_ipv4_tf" {
  cidr_blocks = ["0.0.0.0/0"]
  from_port   = 80
  ipv6_cidr_blocks  = []
  protocol = "tcp"
  security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  to_port = 80
  type    = "ingress"
}

resource "aws_security_group_rule" "portfolio_pub_sg_in_http_ipv6_tf" {
  cidr_blocks       = []
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
  to_port = 80
  # インバウンドルール
  type = "ingress"
}

# ------------------------------------------------------------------------------------------------
# aws_security_group_rule out
# ------------------------------------------------------------------------------------------------
# 1.3 アウトバウンドはデフォルトの設定
resource "aws_security_group_rule" "portfolio_pub_sg_out_all_tf" {
  cidr_blocks = ["0.0.0.0/0"]
  # 送信元ポートの設定です。この値が0の場合、すべてのポートを許可することを意味します。
  from_port = 0
  # トラフィックのプロトコルを指定。"-1"はすべてのプロトコルを許可（制限しない）。
  ipv6_cidr_blocks  = []
  protocol = "-1"
  security_group_id = aws_security_group.portfolio_pub_sg_tf.id
  # 送信先ポートの設定です。同様に、この値も0の場合、すべてのポートを許可することを示しています。
  to_port = 0
  # アウトバウンドルール
  type = "egress"
}
resource "aws_security_group_rule" "portfolio_pub_sg_out_rds_tf" {
  # 競合する為、cidr_blocksとsource_security_group_idと同時に設定しない
  # cidr_blocks              = []
  from_port                = 3306
  # 競合する為、cidr_blocksとsource_security_group_idと同時に設定しない
  # ipv6_cidr_blocks         = []
  protocol                 = "tcp"
  security_group_id        = aws_security_group.portfolio_pub_sg_tf.id
  source_security_group_id = aws_security_group.portfolio_priv_sg_tf.id
  to_port                  = 3306
  type                     = "egress"
}

# ================================================================================================
# Security Group "priv"
# ================================================================================================

# portfolio-priv-sg
resource "aws_security_group" "portfolio_priv_sg_tf" {
  description = "portfolio-priv-sg"
  name        = "portfolio-priv-sg"
  vpc_id      = aws_vpc.portfolio_vpc_tf.id
}

# ------------------------------------------------------------------------------------------------
# aws_security_group_rule out
# ------------------------------------------------------------------------------------------------
resource "aws_security_group_rule" "portfolio_priv_sg_in_rds_tf" {
    from_port                = 3306
    protocol                 = "tcp"
    security_group_id        = aws_security_group.portfolio_priv_sg_tf.id
    source_security_group_id = aws_security_group.portfolio_pub_sg_tf.id
    to_port                  = 3306
    type                     = "ingress"
}
resource "aws_security_group_rule" "portfolio_priv_sg_out_all_tf" {
    cidr_blocks       = [
        "0.0.0.0/0",
    ]
    from_port         = 0
    ipv6_cidr_blocks  = []
    protocol          = "-1"
    security_group_id = aws_security_group.portfolio_priv_sg_tf.id
    to_port           = 0
    type              = "egress"
}




/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
aws_security_groupとaws_security_group_ruleの両方でルールを設定してはいけない。
sgの作成には、"aws_security_group"と、"aws_security_group_rule"の二つのresourceが基本的に必要。
ただし、既にawsのリソースを作成済みの場合、"aws_security_group"に続いて、"aws_security_group_rule"を、
terraform importすると、"aws_security_group"をimportした時点でインバウンド、アウトバウンドがimportされるの
で、さらに"aws_security_group_rule"をimportすると、インバウンド、アウトバウンドのルールが競合する。
その為、"aws_security_group"の作成の際は、"aws_security_group"内にインバウンド、アウトバウンドのルールの設
定は書き込まない。その次に"aws_security_group_rule"を設定すると上手くいく。

================================================================================================
1.1
"aws_security_group"の設定には、オプションでnameとdescriptipnが指定出来る。これを指定しないと、terraform側
で勝手にランダムな値が設定されるので、こちらで設定した方が良い。

------------------------------------------------------------------------------------------------
Terraform で AWS セキュリティグループルールをインポートする一般的なフォーマットは `sg-<security_group_id>_<type>_<protocol>_<from_port>_<to_port>_<source/destination>` です。
TerraformのAWSセキュリティグループルールの`import`コマンドは、その構文においてIPv4とIPv6のCIDRブロックを区別しない。代わりに、IPv4 (`0.0.0.0/0`) か IPv6 (`::/0`) かを問わず、単に CIDR ブロックをそのまま受け取ります。

ルールのインポート
terraform import aws_security_group_rule.portfolio-pub-sg-in-http-ipv4-tf sg-0264949bc0da0c58e_ingress_tcp_80_80_0.0.0.0/0

いらないルールを消す
terraform state rm 'aws_security_group.portfolio_pub_sg_tf.egress'
terraform state rm 'aws_security_group.portfolio_pub_sg_tf.ingress'

------------------------------------------------------------------------------------------------
-
手順：作成したawsリソースをterraformに置き換える。terraformインポートで取得したawsリソース情報をtfファイルに書き出す。正しく設定が書き込まれたtfファイルを表示する。
セキュリティグループルールを別のリソースとして定義したいので、まず、セキュリティグループ(aws_security_group)リソースを定義しますが、この時点ではルールは定義しません。
次に、セキュリティグループルール(aws_security_group_rule)リソースを作成して、各セキュリティグループに適用します。


Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.

================================================================================================
1.2
- `aws_security_group_rule`リソースを`terraform import`する際の一般的なコマンド書式:
terraform import aws_security_group_rule.<resource_name> <sg_id>_<type>_<protocol>_<from_port>_<to_port>_<source/destination>
- 実際の例
terraform import aws_security_group_rule.portfolio_pub_sg_in_http_ipv4_tf sg-0264949bc0da0c58e_ingress_tcp_80_80_0.0.0.0/0

================================================================================================
1.3
アウトバウンドルール（デフォルトの設定）
タイプ：すべてのトラフィック、プロトコル：すべて、ポート範囲：すべて、送信先 ：カスタム 0.0.0.0/0は、
terraform import aws_security_group_rule.portfolio_pub_sg_out_all_tf sg-0264949bc0da0c58e_egress_all_0_65535_0.0.0.0/0
で取り込み
*/