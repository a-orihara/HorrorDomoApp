# ---------------------------------------------
# VPC
# ---------------------------------------------
# 1
resource "aws_vpc" "vpc" {
  cidr_block                       = "10.0.0.0/16"
  assign_generated_ipv6_cidr_block = false
  # DNSサポートを有効（デフォルト）
  enable_dns_support = true
  # DNSホスト名のサポートを無効（デフォルト）
  enable_dns_hostnames = false
  # EC2-Classicとのリンクを無効（デフォルト）
  enable_classiclink = false
  # ClassicLink DNS サポートを無効（デフォルト）
  enable_classiclink_dns_support = false
  # 1.1 インスタンスのテナンシー設定
  instance_tenancy = "default"
  tags = {
    "Name" = "portfolio-vpc"
  }
}

# ---------------------------------------------
# Public Subnet
# ---------------------------------------------
resource "aws_subnet" "pub_subnet_a" {
  availability_zone = "ap-northeast-1a"
  cidr_block        = "10.0.1.0/24"
  # resource "aws_vpc"の"portfolio_vpc_tf"のid
  vpc_id = aws_vpc.vpc.id
  # インスタンス作成時にIPv6アドレスを割り当てるかどうか。
  assign_ipv6_address_on_creation = false
  # インスタンス起動時にパブリックIPを自動割り当てるかどうか。
  map_public_ip_on_launch = false
  tags = {
    "Name" = "portfolio-pub-subnet-a"
  }
}

resource "aws_subnet" "pub_subnet_c" {
  availability_zone               = "ap-northeast-1c"
  cidr_block                      = "10.0.3.0/24"
  vpc_id                          = aws_vpc.vpc.id
  assign_ipv6_address_on_creation = false
  map_public_ip_on_launch         = false
  tags = {
    "Name" = "portfolio-pub-subnet-c"
  }
}

# ---------------------------------------------
# Private Subnet
# ---------------------------------------------
resource "aws_subnet" "priv_subnet_a" {
  availability_zone               = "ap-northeast-1a"
  cidr_block                      = "10.0.2.0/24"
  vpc_id                          = aws_vpc.vpc.id
  assign_ipv6_address_on_creation = false
  map_public_ip_on_launch         = false
  tags = {
    "Name" = "portfolio-priv-subnet-a"
  }
}

resource "aws_subnet" "priv_subnet_c" {
  availability_zone               = "ap-northeast-1c"
  cidr_block                      = "10.0.4.0/24"
  vpc_id                          = aws_vpc.vpc.id
  assign_ipv6_address_on_creation = false
  map_public_ip_on_launch         = false
  tags = {
    "Name" = "portfolio-priv-subnet-c"
  }
}

# ---------------------------------------------
# Route Table(Pub)
# ---------------------------------------------
# resource "aws_route_table" "portfolio_pub_rtb_tf" {

resource "aws_route_table" "pub_rtb" {
  vpc_id = aws_vpc.vpc.id
  # pubのrtbはigwで外部と接続
  route {
    # 全てのトラフィック（0.0.0.0/0）をigwへとルーティングします。
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.portfolio_igw_tf.id
  }
  tags = {
    "Name" = "portfolio-pub-rtb"
  }
}
# 2 パブリック用rtbとパブリックsub-netとの関連付け
# resource "aws_route_table_association" "portfolio_pub_rtb_assoc_pub_subnet_a_tf" {
resource "aws_route_table_association" "pub_rtb_assoc_pub_subnet_a" {
  route_table_id = aws_route_table.pub_rtb.id
  subnet_id      = aws_subnet.pub_subnet_a.id
}

resource "aws_route_table_association" "portfolio_pub_rtb_assoc_pub_subnet_c_tf" {
  route_table_id = aws_route_table.pub_rtb.id
  subnet_id      = aws_subnet.pub_subnet_c.id
}

# ---------------------------------------------
# 3 Route Table(Priv)
# ---------------------------------------------
resource "aws_route_table" "priv_rtb" {
  vpc_id = aws_vpc.vpc.id
  # privのrtbはigwで外部と接続はしない
  route = []
  tags = {
    Name = "portfolio-priv-rtb"
  }
}
resource "aws_route_table_association" "portfolio_priv_rtb_assoc_priv_subnet_a_tf" {
  route_table_id = aws_route_table.priv_rtb.id
  subnet_id      = aws_subnet.priv_subnet_a.id
}
resource "aws_route_table_association" "portfolio_priv_rtb_assoc_priv_subnet_c_tf" {
  route_table_id = aws_route_table.priv_rtb.id
  subnet_id      = aws_subnet.priv_subnet_c.id
}

# ---------------------------------------------
# 4 Internet Gateway
# ---------------------------------------------
resource "aws_internet_gateway" "portfolio_igw_tf" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    "Name" = "portfolio-igw"
  }
}
# 4.1
resource "aws_route" "portfolio_igw_aws_route_tf" {
  route_table_id         = aws_route_table.pub_rtb.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.portfolio_igw_tf.id
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
. **resource`ブロックの説明**：
- Terraformでは、EC2インスタンス、VPC、S3バケットなどの特定のAWSリソースを定義・管理するために`resource`ブロ
ックを使用します。
- 各`resource`ブロックは1つのAWSリソースを表し、その構成を指定する。
- Terraformはこの設定を使用して、Terraformの設定変更に基づいて対応するAWSリソースを作成、更新、削除します。
================================================================================================
. **resource`ブロックの引数の説明**：
- resource`ブロックには主に2つの引数があります：
- 最初の引数は、例では `"aws_vpc"` で、作成するリソースタイプを指定します。ここではVPCです。
- 2番目の引数 `"portfolio_vpc_tf"` はリソースブロックの一意な名前または識別子です。これはユーザー定義のラベルで
、Terraform設定の他の部分でこのリソースを参照できるようにします。

================================================================================================
1.1
- インスタンスのテナンシー設定:
- VPC上のリソースを専用ハードウェアで実行するかどうかを指定します。「デフォルト」にした場合は、他のAWSアカウントと
ハードウェア資源を共有することを選択したことになります。
------------------------------------------------------------------------------------------------
- VPC内において、EC2インスタンスがどのような物理的なサーバー上で実行されるかを制御します。共有と専用があります。デ
フォルトは "default" で、他の多数の顧客と同じ物理サーバーを共有します。
------------------------------------------------------------------------------------------------
- テナンシーの設定は、デフォルトのままにしてください。ハードウエア専有は、物理的なサーバー上に他のユーザーの仮想サ
ーバーが乗らなくなる設定で、別途費用がかかります。企業のコンプライアンス上の理由などで物理サーバーを専有する必要があ
るような場合のみ利用する機能です。

================================================================================================
1.2
- DNSサポートを有効にする:
- VPC内でAmazon提供のDNSサーバーを使って名前解決（DNSクエリ）を行えるようにする設定です。有効にすると、EC2インス
タンスのようなリソースがIPアドレスと名前で通信できます。

================================================================================================
1.3
- DNSホスト名を有効にする:
- VPC内でEC2インスタンスなどがDNSホスト名（例：ip-192-0-2-44）を持つことができるようになります。これが有効にな
っていると、IPアドレスだけでなくDNSホスト名でもリソースにアクセスできます。

================================================================================================
2
`terraform import`コマンドで`aws_route_table_association`リソースをインポートする際、IDのフォーマットが特
定の形式である必要があります。この形式は「subnet ID/route table ID」または「gateway ID/route table ID」で
す。
------------------------------------------------------------------------------------------------
terraform import aws_route_table_association.pub_subnet_a_rtb_assoc subnet-xxxxxx/rtb-yyyyyy
または
terraform import aws_route_table_association.portfolio-pub-subnet-a-rtb-assoc-tf igw-xxxxxx/rtb-yyyyyy

================================================================================================
3
rtbの作成には、"aws_route_table"と、"aws_route_table_association"の二つのresourceが必要

================================================================================================
4
igwの作成には、"aws_internet_gateway"と、"aws_route"の二つのresourceが必要
理由：
- TerraformはAWSリソースを独自の状態ファイルにマッピングするため、IDのフォーマットが重要です。
- インポートする際のIDの形式が不正確であれば、Terraformはどのリソースをインポートすればよいのかわからなくなってしまいます。
ファイルパスは通常`main.tf`またはリソースを定義しているTerraform設定ファイルになります。

================================================================================================
4.1
resource "aws_route"をインポートするコマンド
terraform import aws_route.portfolio_igw_aws_route_tf <pub-rtbのid>_<igwの送信先アドレス>
------------------------------------------------------------------------------------------------
terraform import aws_route.portfolio_igw_aws_route_tf rtb-0f399e773e2ee2cf7_0.0.0.0/0
*/

