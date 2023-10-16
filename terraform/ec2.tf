# terraform{
#   //Terraformのバージョン制約required_version= "~>1.4.4" //プロバイダのバージョン制約
#   required_version="~>1.4.4"
#   //プロバイダのバージョン制約
#   required_providers{
#     aws={
#       source="hashicorp/aws"
#       version="~>4.0"
#     }
#   }
# }
# provider "aws"{
#   region="apnortheast1"
# }

# 1
provider "aws" {
  # 2
  profile = "portfolio-terraform-aws-profile"
  region  = "ap-northeast-1"
}

# 3
resource "aws_instance" "hello-world" {
  # ami           = "ami-0ce107ae7af2e92b5"
  ami           = "ami-0fd8f5842685ca887"
  instance_type = "t2.micro"
  # EC2の"Name"というキーに"HelloWorld"という値のタグが設定されています。
  tags = {
    Name = "HelloWorld"
  }
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
- providerブロック:Terraformに、特定のクラウドプロバイダ（AWS、Azure、GCPなど）やサービスと通信する方法を指示する
設定です。
例：`provider "aws"` は、TerraformにAWSとのインタラクションを行うための設定を提供します。

================================================================================================
2
- `profileプロパティ` :AWS CLI認証情報を指定します。AWS CLIのprofile名を入力する。

================================================================================================
3
`resource` ブロックは、Terraformの設定ファイル内で使用される重要なブロックで、特定のリソース（ここではAWSインス
タンス）を定義します。以下は提供されたコード内の `resource "aws_instance" "hello-world"` ブロックの意味です
------------------------------------------------------------------------------------------------
- `resource "aws_instance" "hello-world"` の部分で、`aws_instance` と `hello-world` という二つの引数
が設定されています。
- リソースタイプとリソース名は、そのリソースを一意に識別するために使用されます。この組み合わせは、同一のTerraform
設定内で一意でなければなりません。
------------------------------------------------------------------------------------------------
- `"aws_instance"` はリソースのタイプを指定しており、ここではAWS EC2インスタンスを作成するためのリソースを示し
ています。
------------------------------------------------------------------------------------------------
- `"hello-world"` はリソースの名前（エイリアス）で、後でこの名前を使用してリソースを参照します。この名前を使って
、Terraform設定内でこの特定のリソースを参照できます。
*/
