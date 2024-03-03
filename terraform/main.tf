# ---------------------------------------------
# Terraform configuration
# ---------------------------------------------
# terraformブロック：Terraformの構成と要件を指定
terraform {
  # 1.1
  # required_version = ">=1.3.10"
  required_version = "= 1.3.10"
  required_providers {
    aws = {
      # 1.2
      source = "hashicorp/aws"
      # 1.3
      # version = "~> 5.20.1"
      version = "= 5.20.1"
    }
  }
  # 1.4
  backend "s3" {
    # 1.5
    bucket = "portfolio-tfstate-s3-bucket"
    # 1.6
    key = "terraform.tfstate"
    # 1.7
    region = "ap-northeast-1"
  }
}

# ---------------------------------------------
# Provider
# ---------------------------------------------
# 2
provider "aws" {
  # 2.1 jsonとは違い、:ではなく、=でつなぐ。profile設定をすると、Terraform はローカルの設定を使用
  # profile = "portfolio-terraform-aws-profile"
  region = "ap-northeast-1"
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

これでTerraformを使い始めることができます。terraform plan "を実行してみてください。すべてのTerraformコマンド
が動作するはずです。
Terraformのモジュールやバックエンドの設定を変更した場合は、このコマンドを再実行してください、 このコマンドを再実行
して作業ディレクトリを再初期化してください。もし忘れても、他の コマンドがそれを検知し、必要であればリマインドしてく
れます。
================================================================================================
実行結果を事前確認する
terraform plan
------------------------------------------------------------------------------------------------
terraform planコマンドでどのようなインフラ環境が構築されるのか確認することができます。
------------------------------------------------------------------------------------------------
`terraform apply` を使って AWS リソースを作成し、AWS マネジメントコンソールでリソースの内容を手動で変更した場合
、ローカルで `terraform plan` を実行すると、確かに Web (AWS コンソール) で見た AWS リソースの現在の状態と、ロ
ーカルの Terraform 設定ファイルと状態ファイルに記録されている状態の違いが表示されます。
------------------------------------------------------------------------------------------------
- **Terraformステートファイル**： Terraformは状態ファイル(`terraform.tfstate`)を保持し、設定内のリソースの
既知の状態を記録する。この状態ファイルは `terraform apply` が成功するたびに更新され、その時点でのリソースの状態を
反映する。
- **AWS Console**での手動変更： web上のAWS Consoleでリソースを手動で変更した場合、その変更は自動的にローカル
のTerraformの状態ファイルには反映されません。Terraformはこの状態ファイルを頼りにリソースの現在の状態を判断します。
------------------------------------------------------------------------------------------------
- **terraform plan`** を実行する： AWS Console で手動で変更した後に `terraform plan` を実行すると、
（Terraform の設定ファイルで定義した）希望する状態と、AWS 内のリソースの実際の状態（AWS API で取得した状態）、お
よび `terraform.tfstate` ファイルに記録されている状態を比較します。状態ファイルは手動による変更を知らないので、
`terraform plan` はこれらの不一致を差分として検出し、調整するためのアクションを提案する。これにより、Terraform
は AWS Console で行われた手動変更を Terraform の設定で定義された望ましい状態に一致するように戻すことを提案する。
================================================================================================
Terraformでインフラを作成する
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
rm terraform/*.backup
terraform/terraform.tfstate.<番号>.backupを手動で削除: 古いまたは不要な .backup ファイルを手動で削除するこ
とができます。
================================================================================================
HCL2構文
terraform apply
デフォルトでカレントディレクトリ内の全ての.tfファイルを読み込む。サブディレクトリ内の.tfファイルは読み込まない

================================================================================================
1.1
`required_providers`セクションは、Terraform設定ファイル内で使用するプロバイダーの定義と設定を行います。具体的
には、次のことを設定します：
------------------------------------------------------------------------------------------------
. **プロバイダーのソース**:
- `source`属性は、プロバイダーのソース位置を指定します。これは通常、Terraform Registry上のプロバイダー名を示し
ます。例えば、`hashicorp/aws`はTerraform Registry上のAWSプロバイダーを指します。
------------------------------------------------------------------------------------------------
. **プロバイダーのバージョン**:
- `version`属性は、使用するプロバイダーのバージョンを指定します。
------------------------------------------------------------------------------------------------
. **プロバイダーの指定**:
- 各プロバイダーは、その名前（例：`aws`、`github`）で指定され、それぞれの`source`と`version`属性を持ちます。
------------------------------------------------------------------------------------------------
. **プロバイダー（Terraformのコンテキストで）**:
- Terraformのプロバイダーは、Terraformがリソースを管理するために使用するプラグイン（ソフト）です。
- プロバイダーは、特定のAPI（例えば、AWS、Azure、githubなど）とのインターフェイスとして機能し、そのサービス上で
のリソースの作成、読み取り、更新、削除（CRUD）操作を可能にします。
- プロバイダーはTerraformが様々なサービスやプラットフォームと連携するための手段を提供します。
------------------------------------------------------------------------------------------------
. **Terraform Registry**:
- Terraform Registryは、Terraformプロバイダーやモジュールを公開、共有、および検索するための公式のリポジトリ。
- ユーザーはRegistryを通じてさまざまなプロバイダーやモジュールを探し、それらを自分のTerraformプロジェクトに組み
込むことができます。
- Registryは、HashiCorp（Terraformの開発会社）によって運営されており、公式およびサードパーティを含んでいます。
------------------------------------------------------------------------------------------------
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
1.4
backend ブロックは、Terraformのtfstateファイルを格納する場所を定義します。S3バケットをTerraformのバックエン
ドとして使用することが指定されています。
------------------------------------------------------------------------------------------------
この設定により、localで`terraform plan` を実行すると、Terraform は指定した S3 バケットに保存されている
`tfstate` ファイルからリソースの現在の状態を自動的に読み込みます。また、`terraform apply` を実行すると、更新さ
れた `tfstate` ファイルを指定した S3 バケットに自動的にアップロードして内容を更新します。

================================================================================================
1.5
bucket パラメータでは、Terraformの状態ファイルを格納するS3バケットの名前を指定します。

================================================================================================
1.6
key パラメータでは、S3バケット内の状態ファイルのパスとファイル名を指定します。
------------------------------------------------------------------------------------------------
初めてterraform initをした際は、プロンプトが表示され、yesで、ローカルバックエンドに存在する既存の tfstateファ
イルが、S3 の horror バケットに terraform.tfstate という名前のオブジェクト（ファイル）が新たに作成されます。続
いてterraform planで状態の内容がコピーされます。既存のlocalのtfstateは空欄になります。ただし、localの、
terraform/terraform.tfstate.backupはそのまま内容が消されずに残ります。
------------------------------------------------------------------------------------------------
移行後のファイルの変化は以下になります。
「./terraform/terraform.tfstate」は空ファイルになる
「./terraform/terraform.tfstate.backup」ファイルの作成
「./terraform/.terraform/terraform.tfstate」ファイルが作成
S3にterraform.tfstateファイルの作成
------------------------------------------------------------------------------------------------
localに作成された、.terraform/terraform.tfstateとは
このファイルは、リモートステートの向き先を指定するためのファイルとなります。

================================================================================================
1.7
region パラメータでは、S3バケットが存在するAWSリージョンを指定します。この場合、"ap-northeast-1" が指定されて
います。

================================================================================================
2
- [provider]この部分をHCL2ではブロックタイプと呼ぶ。
- providerブロック:Terraformに、特定のクラウドプロバイダ（AWS、Azure、GCPなど）やサービスと通信する方法を指示する
設定です。
例：`provider "aws"` は、TerraformにAWSとのインタラクションを行うための設定を提供します。

================================================================================================
2.1
以前の設定
- `profileプロパティ` :AWS CLI認証情報を指定します。AWS CLIのprofile名を入力する。
------------------------------------------------------------------------------------------------
- ローカルでは、Terraform は AWS 設定ファイル (通常 `~/.aws/credentials` と `~/.aws/config` にあります)
に保存されている AWS クレデンシャルを使用します。Terraform の AWS プロバイダ設定の `profile` 属性は、これらの
ファイルからどの名前のプロファイルを使用するかを指定します。
- profile = "portfolio-terraform-aws-profile"` を指定すると、Terraform はローカルの AWS 設定からこのプ
ロファイルに関連付けられた認証情報を使用しようとします。
------------------------------------------------------------------------------------------------
- GitHub Actions では、AWS の認証情報は通常 localのAWS 設定ファイルやプロファイルでは設定されません。代わりに
環境変数や`aws-actions/configure-aws-credentials`のようなアクション（OIDC）によって直接提供されます。
- Terraform を GitHub Actions で実行して名前付きプロファイル（`portfolio-terraform-aws-profile` など）
を使おうとすると、このプロファイルが GitHub Actions 環境に存在しないため失敗します。

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
awsで現在作成したリソースをterraformで置き換えるには、terraform importを使う。現在のAWSリソースのバックアップ。
AWSのリソースをTerraformで管理する場合、手動で設定情報を取得してTerraformコードに置き換えるのは大変な作業になる
ことがあります。より効率的な方法として以下の手段が考えられます：
Terraform Import:
Terraformのimportコマンドを使用すると、既存のAWSリソースをTerraformの管理下に置くことができます。
このコマンドは、既存のAWSリソースを指定し、Terraformのステートファイルにそのリソースの情報を追加します。
ただし、importコマンドはステートファイルのみを更新し、Terraformのコードは自動的に生成しません。そのため、リソース
をインポートした後、対応するTerraformコードを手動で作成する必要があります。
*/