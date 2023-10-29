# ================================================================================================
# Security Group "pub"
# ================================================================================================
# 1 ここでは、セキュリティグループのルールを除外する(no ingress or egress rules)
resource "aws_security_group" "pub_sg" {
  # 1.1
  description = "portfolio-pub-sg"
  name        = "portfolio-pub-sg"
  vpc_id      = aws_vpc.vpc.id
}

# ================================================================================================
# Security Group "priv"
# ================================================================================================
resource "aws_security_group" "priv_sg" {
  description = "portfolio-priv-sg"
  name        = "portfolio-priv-sg"
  vpc_id      = aws_vpc.vpc.id
}

# ================================================================================================
# Security Group "front"
# ================================================================================================
resource "aws_security_group" "front_sg" {
  description = "portfolio-front-sg"
  name        = "portfolio-front-sg"
  vpc_id      = aws_vpc.vpc.id
}

# ================================================================================================
# Security Group "alb-frontend"
# ================================================================================================
resource "aws_security_group" "portfolio_alb_frontend_sg_tf" {
  description = "portfolio-alb-frontend-sg"
  name        = "portfolio-alb-frontend-sg"
  vpc_id      = aws_vpc.vpc.id
}

# ================================================================================================
# Security Group "alb"
# ================================================================================================
resource "aws_security_group" "portfolio_alb_sg_tf" {
  description = "portfolio-alb-sg"
  name        = "portfolio-alb-sg"
  vpc_id      = aws_vpc.vpc.id
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
terraform state rm 'aws_security_group.pub_sg.egress'
terraform state rm 'aws_security_group.pub_sg.ingress'

------------------------------------------------------------------------------------------------
-
手順：作成したawsリソースをterraformに置き換える。terraformインポートで取得したawsリソース情報をtfファイルに書き出す。正しく設定が書き込まれたtfファイルを表示する。
セキュリティグループルールを別のリソースとして定義したいので、まず、セキュリティグループ(aws_security_group)リソースを定義しますが、この時点ではルールは定義しません。
次に、セキュリティグループルール(aws_security_group_rule)リソースを作成して、各セキュリティグループに適用します。


Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.
*/