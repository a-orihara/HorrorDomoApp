

# ---------------------------------------------
# Terraform configuration
# ---------------------------------------------
# terraformブロック：Terraformの構成と要件を指定
terraform {
  # 1.1
  required_version = ">=1.1.3"
  required_providers {
    aws = {
      # 1.2
      source = "hashicorp/aws"
      # 1.3
      version = "~> 3.0"
    }
  }
}

# ---------------------------------------------
# Provider
# ---------------------------------------------
# 2
provider "aws" {
  # 2.1 jsonとは違い、:ではなく、基本的に=でつなぐ
  profile = "portfolio-terraform-aws-profile"
  region  = "ap-northeast-1"
}

# ---------------------------------------------
# Variables
# ---------------------------------------------
# 3
variable "project" {
  type = string
}

variable "environment" {
  type = string
}

# variable ブロックは、Terraformの設定ファイルで変数を定義。変数名：domain、型はstring
variable "domain" {
  type = string
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @
0
================================================================================================
terraformの基本
================================================================================================
初期化処理を実行する
Terraformインストールフォルダで「init」コマンドを実行します。

terraform init
------------------------------------------------------------------------------------------------
terraform init
これは、Terraformプロジェクトに対して少なくとも1回実行する必要があります。initプロセス中に、Terraformは必要なプ
ロバイダをダウンロードし、状態(まだ存在しない場合)を設定し、ックエンドの初期化、ローカル設定の生成、リソース作成に
必要なバイナリファイルをダウンロードなど、その他の必要な起動タスクを実行します。
------------------------------------------------------------------------------------------------
生成される主要なファイルと設定：
* .terraform ディレクトリ：
    * ダウンロードされたプロバイダプラグインや、バックエンドの状態データなどがこのディレクトリに保存されます。
* .terraform.lock.hcl ファイル：
    * 使用されるプロバイダのバージョンや、その依存関係をロックするためのファイルです。これにより、チーム間や環境間
    での挙動の一貫性が保たれます。
------------------------------------------------------------------------------------------------
Terraformは正常に初期化されました！

これでTerraformを使い始めることができます。terraform plan "を実行してみてください。を実行してみてください。すべ
てのTerraformコマンド が動作するはずです。
Terraformのモジュールやバックエンドの設定を変更した場合は、このコマンドを再実行してください、 このコマンドを再実行
して作業ディレクトリを再初期化してください。もし忘れても、他の コマンドがそれを検知し、必要であればリマインドしてく
れます。
================================================================================================
実行結果を事前確認する
terraform plan
------------------------------------------------------------------------------------------------
terraformplanコマンドでどのようなインフラ環境が構築されるのか確認することができます。
================================================================================================
Terraformでファイルを作成する
ファイルを作成するために「apply」コマンドを実行します。
terraform apply
実行するとplanコマンドと同様に変更内容が表示されたあと「Do you want to perform these actions?」と、実行を再
確認する注意メッセージが表示されます。
ここで「yes」を入力してエンターキーを押すと処理が行われます。
================================================================================================
作成されたファイルを確認する
インストールフォルダに「hello.txt」ファイルが作成されています。
ファイルを開くと「hellow world!」が書き込まれています！
================================================================================================
terraform fmt
ファイルの整形
================================================================================================
HCL2構文
terraform apply
デフォルトでカレントディレクトリ内の全ての.tfファイルを読み込む。サブディレクトリ内の.tfファイルは読み込まない

================================================================================================
1.1
`required_version = ">=1.1.3"`
2022年1月現在のterraformの最新は1.1.3。
Terraformのバージョン要件を指定しています。
- `required_version`: これはTerraformの最小バージョンを指定するフィールドです。">=" は「以上」という意味で、
"1.1.3" は指定された最小バージョンを示しています。つまり、この設定ではTerraformのバージョン1.1.3以上が必要です。
もし1.1.3未満のバージョンを使用しようとすると、エラーが発生します。

================================================================================================
1.2
source: このフィールドは、Terraformが使用するプロバイダーのソースを示しています。"hashicorp/aws" は、
Terraformの公式プロバイダーであるAWSプロバイダーを指定しています。

================================================================================================
1.3
2022年1月現在のAWSプロバイダのバージョンは3.x。
version = "~> 3.0" は、Terraformが使用するAWSプロバイダーのバージョンをセマンティック バージョニングの範囲指
定で「3.0以上、4.0未満」という意味です。つまり、この設定では3.0から3.9までのバージョンが許容され、4.0以上のバージ
ョンは許容されません。

================================================================================================
2
- [provider]この部分をHCL2ではブロックタイプと呼ぶ。
- providerブロック:Terraformに、特定のクラウドプロバイダ（AWS、Azure、GCPなど）やサービスと通信する方法を指示する
設定です。
例：`provider "aws"` は、TerraformにAWSとのインタラクションを行うための設定を提供します。

================================================================================================
2.1
- `profileプロパティ` :AWS CLI認証情報を指定します。AWS CLIのprofile名を入力する。

================================================================================================
3
- `variable` ブロック: `variable` ブロックは、Terraformで使用する変数を宣言するために使用されます。変数はイ
ンフラの構成でパラメータ化された値を表し、設定ファイルから値を受け取ることができます。
- `variable "environment"`: この行は `variable` ブロックを開始し、"environment" という名前の変数を宣言し
ています。この変数は文字列型 (`type = string`) であることが指定されています。

================================================================================================
4
`resource` ブロックは、Terraformの設定ファイル内で使用される重要なブロックで、特定のリソース（ここではAWSインス
タンス）を定義します。以下は提供されたコード内の `resource "aws_instance" "hello-world"` ブロックの意味です
------------------------------------------------------------------------------------------------
- `resource "aws_instance" "hello-world"` の部分で、`aws_instance` と `hello-world` という二つの引数
が設定されています。
- HCL2では、引数の部分をラベルと呼ぶ。
- リソースタイプとリソース名は、そのリソースを一意に識別するために使用されます。この組み合わせは、同一のTerraform
設定内で一意でなければなりません。
------------------------------------------------------------------------------------------------
- `"aws_instance"` はリソースのタイプを指定しており、ここではAWS EC2インスタンスを作成するためのリソースを示し
ています。
------------------------------------------------------------------------------------------------
- `"hello-world"` はリソースの名前（エイリアス）で、後でこの名前を使用してリソースを参照します。この名前を使って
、Terraform設定内でこの特定のリソースを参照できます。

================================================================================================
- **terraform.tfstate**:
- これはTerraformの状態ファイルです。Terraformが管理するインフラストラクチャの現在の状態を保存しています。
- このファイルは、`terraform apply` や `terraform destroy` などのコマンドが実行された後に更新されます。
- 通常、このファイルは機密情報を含む可能性があるため、バージョン管理システムにはコミットしないことが推奨されてい
ます。
------------------------------------------------------------------------------------------------
- **terraform.tfstate.backup**:
- これは、最後に `terraform.tfstate` ファイルが更新された際のバックアップです。
- `terraform.tfstate` ファイルが何らかの理由で破損または失われた場合、このバックアップファイルから状態を復元
することができます。
------------------------------------------------------------------------------------------------
- なぜ２つのファイルが存在するのか:
- `terraform.tfstate` ファイルは非常に重要な情報を持っているため、何らかのエラーでデータが失われた場合に備え
てバックアップが自動的に作成されます。
------------------------------------------------------------------------------------------------
状態の復元が必要な場合以外で、`.backup` ファイルを直接編集または使用することは一般的にはありません。主な状態管理は
`terraform.tfstate` ファイルを通して行われます。


├── main.tf
├── variables.tf
├── outputs.tf
├── provider.tf
│
├── vpc/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── ecs/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── alb/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── rds/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── ecr/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
└── route53/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf

------------------------------------------------------------------------------------------------
説明と根拠
main.tf、variables.tf、outputs.tf、provider.tf： これらはTerraformプロジェクトでよく見られる標準的なファイルです。main.tfファイルには主要な設定、variables.tfファイルには入力変数、outputs.tfファイルには出力値、provider.tfファイルにはAWSプロバイダの設定が含まれます。

vpc/： このディレクトリは、サブネット（パブリックとプライベート）を含む仮想プライベートクラウド（VPC）の作成と設定専用です。

ecs/： ここではAmazon Elastic Container Service (ECS)の設定を定義します。これにはフロントエンドとバックエンド両方のタスク定義とサービス定義が含まれる。また、Fargateの設定も含まれる。

alb/： Application Load Balancer (ALB)のコンフィギュレーションはここに置かれる。ALBはフロントエンド用とバックエンド用に分かれているため、このディレクトリで区別することができます。

rds/： Amazon Relational Database Service (RDS) for MySQLに関連するすべての設定はここに格納されます。

ecr/： Dockerイメージを保存するElastic Container Registry (ECR)のTerraform設定はこのディレクトリに格納されます。

route53/： ドメインとルーティングを扱うと思われるRoute 53の設定はここに置かれます。

このような構成にすることで、Terraformの設定をモジュール化でき、管理や理解がしやすくなります。各ディレクトリは特定のAWSサービスにフォーカスしており、Terraform開発のベストプラクティスに沿っています。また、構成を

------------------------------------------------------------------------------------------------
私は初学者です。
awsで現在作成したリソースをterraformで置き換える。
terraform importを使う。
現在のAWSリソースのバックアップらしい。
現在のAWSリソースのバックアップを取る方法を教えて。
それはawsのマネージメントコンソール上でできるの？

手順の提案:
現在のAWSリソースのバックアップ: 念のため、現在のAWSリソースの設定情報やデータのバックアップを取得しておきましょう。

Terraformerの利用: Terraformerを使用して、既存のAWSリソースからTerraformコードを生成します。

Terraformコードのレビュー: 自動生成されたTerraformコードをレビューし、必要に応じて修正や最適化を行います。

Terraformの適用: 生成されたTerraformコードを適用して、AWSリソースをTerraformの管理下に置きます。



AWSのリソースをTerraformで管理する場合、手動で設定情報を取得してTerraformコードに置き換えるのは大変な作業になることがあります。より効率的な方法として以下の手段が考えられます：

Terraform Import:

Terraformのimportコマンドを使用すると、既存のAWSリソースをTerraformの管理下に置くことができます。
このコマンドは、既存のAWSリソースを指定し、Terraformのステートファイルにそのリソースの情報を追加します。
ただし、importコマンドはステートファイルのみを更新し、Terraformのコードは自動的に生成しません。そのため、リソースをインポートした後、対応するTerraformコードを手動で作成する必要があります。
*/
