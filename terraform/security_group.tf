# ---------------------------------------------
# 1 Security Group
# ---------------------------------------------

# ここでは、セキュリティグループのルールを除外する(no ingress or egress rules)


# resource "aws_security_group" "portfolio_pub_sg_tf" {
#   # 1.1
#   name        = "portfolio-pub-sg"
#   description = "portfolio-pub-sg"
#   vpc_id      = aws_vpc.portfolio-vpc-tf.id
#   # タグなど、必要な他の属性もここで定義可能

#   tags = {
#     Name = "portfolio-pub-sg"
#   }
# }


# portfolio-priv-sg
# resource "aws_security_group" "portfolio-priv-sg-tf" {
#   name        = "portfolio-priv-sg"
#   description = "portfolio-priv-sg"
#   vpc_id      = aws_vpc.portfolio-vpc-tf.id
#   depends_on = [aws_security_group.portfolio_pub_sg_tf]

#   ingress {
#     from_port       = 3306
#     to_port         = 3306
#     protocol        = "tcp"
#     security_groups = [aws_security_group.portfolio-pub-sg-tf.id]
#   }
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
#   // Optional: Add tags for additional metadata
#   tags = {
#     Name = "portfolio-priv-sg"
#   }

# }


# resource "aws_security_group_rule" "portfolio_pub_sg_in_http_ipv4_tf" {
#     type              = "ingress"
#     from_port         = 80
#     to_port           = 80
#     protocol          = "tcp"
#     cidr_blocks       = ["0.0.0.0/0"]
#     security_group_id = aws_security_group.portfolio_pub_sg_tf.id
# }


# resource "aws_security_group_rule" "portfolio-pub-sg-in-http-ipv6-tf" {
#   security_group_id = aws_security_group.portfolio-pub-sg-tf.id
#   type              = "ingress"
#   protocol          = "tcp"
#   from_port         = 80
#   to_port           = 80
#   ipv6_cidr_blocks  = [
#         "::/0",
#     ]
# }
/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
sgの作成には、"aws_security_group"と、"aws_security_group_rule"の二つのresourceが基本的に必要。
ただし、既にawsのリソースを作成済みの場合、"aws_security_group"に続いて、"aws_security_group_rule"を、
terraform importすると、"aws_security_group"をimportした時点でインバウンド、アウトバウンドがimportされるの
で、さらに"aws_security_group_rule"をimportすると、インバウンド、アウトバウンドのルールが競合する。
その為、"aws_security_group"の作成のみで良い。

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

*/