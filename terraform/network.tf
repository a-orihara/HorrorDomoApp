# ---------------------------------------------
# VPC
# ---------------------------------------------
# 1
resource "aws_vpc" "portfolio-vpc-tf" {
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
resource "aws_subnet" "portfolio-pub-subnet-a-tf" {
  availability_zone = "ap-northeast-1a"
  cidr_block        = "10.0.1.0/24"
  # resource "aws_vpc"の"portfolio-vpc-tf"のid
  vpc_id = aws_vpc.portfolio-vpc-tf.id
  # インスタンス作成時にIPv6アドレスを割り当てるかどうか。
  assign_ipv6_address_on_creation = false
  # インスタンス起動時にパブリックIPを自動割り当てるかどうか。
  map_public_ip_on_launch = false
  tags = {
    "Name" = "portfolio-pub-subnet-a"
  }
}

resource "aws_subnet" "portfolio-pub-subnet-c-tf" {
  availability_zone               = "ap-northeast-1c"
  cidr_block                      = "10.0.3.0/24"
  vpc_id                          = aws_vpc.portfolio-vpc-tf.id
  assign_ipv6_address_on_creation = false
  map_public_ip_on_launch         = false
  tags = {
    "Name" = "portfolio-pub-subnet-c"
  }
}

# ---------------------------------------------
# Private Subnet
# ---------------------------------------------
resource "aws_subnet" "portfolio-priv-subnet-a-tf" {
  availability_zone               = "ap-northeast-1a"
  cidr_block                      = "10.0.2.0/24"
  vpc_id                          = aws_vpc.portfolio-vpc-tf.id
  assign_ipv6_address_on_creation = false
  map_public_ip_on_launch         = false
  tags = {
    "Name" = "portfolio-priv-subnet-a"
  }
}

resource "aws_subnet" "portfolio-priv-subnet-c-tf" {
  availability_zone               = "ap-northeast-1c"
  cidr_block                      = "10.0.4.0/24"
  vpc_id                          = aws_vpc.portfolio-vpc-tf.id
  assign_ipv6_address_on_creation = false
  map_public_ip_on_launch         = false
  tags = {
    "Name" = "portfolio-priv-subnet-c"
  }
}

# ---------------------------------------------
# Route Table(Pub)
# ---------------------------------------------
resource "aws_route_table" "portfolio-pub-rtb-tf" {
  vpc_id = aws_vpc.portfolio-vpc-tf.id
  route {
    # 全てのトラフィック（0.0.0.0/0）をigwへとルーティングします。
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.portfolio-igw-tf.id
  }
  tags = {
    "Name" = "portfolio-pub-rtb"
  }
}


# ---------------------------------------------
# Internet Gateway
# ---------------------------------------------
resource "aws_internet_gateway" "portfolio-igw-tf" {
  vpc_id = aws_vpc.portfolio-vpc-tf.id
  tags = {
    "Name" = "portfolio-igw"
  }
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
- 2番目の引数 `"portfolio-vpc-tf"` はリソースブロックの一意な名前または識別子です。これはユーザー定義のラベルで
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

resource "aws_route_table" "portfolio-pub-rtb-tf" {
    id               = "rtb-0f3"
    propagating_vgws = []
    route            = [
        {
            carrier_gateway_id         = ""
            cidr_block                 = "0.0.0.0/0"
            destination_prefix_list_id = ""
            egress_only_gateway_id     = ""
            gateway_id                 = "igw-056"
            instance_id                = ""
            ipv6_cidr_block            = ""
            local_gateway_id           = ""
            nat_gateway_id             = ""
            network_interface_id       = ""
            transit_gateway_id         = ""
            vpc_endpoint_id            = ""
            vpc_peering_connection_id  = ""
        },
    ]
    tags             = {
        "Name" = "portfolio-pub-rtb"
    }
    tags_all         = {
        "Name" = "portfolio-pub-rtb"
    }
    vpc_id           = "vpc-0fd"

    timeouts {}
}
*/

