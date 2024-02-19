# ================================================================================================
# IAM "aws_iam_role"
# ================================================================================================

# 1
resource "aws_iam_role" "portfolio_ecs_task_execution_role" {
  # このロールに対するポリシーの設定
  assume_role_policy    = data.aws_iam_policy_document.iam_policy_document.json
  description           = "Allows ECS tasks to call AWS services on your behalf."
  force_detach_policies = false
  # IAMロールにアタッチするAWS管理ポリシーのARN（Amazon Resource Name）のリストを指定します。
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonS3FullAccess",
    "arn:aws:iam::aws:policy/AmazonSSMFullAccess",
    "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy",
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  ]
  max_session_duration = 3600
  name                 = "portfolio-ecsTaskExecutionRole"
  path                 = "/"
  tags                 = {}
  tags_all             = {}
  # inline_policy {}
}
# ================================================================================================
# IAM "aws_iam_policy_document"
# ================================================================================================
# 1.1
data "aws_iam_policy_document" "iam_policy_document" {
  # 1.2
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
  version = "2012-10-17"
}
# 2 欄外 AmazonECSTaskExecutionRolePolicy
# data "aws_iam_policy_document" "iam_policy_document" {
#   # AmazonECSTaskExecutionRolePolicy
#   # version:IAMポリシードキュメントのバージョン
#   version = "2012-10-17"
#   # statement:IAMポリシー内の個別のアクション許可/拒否ルールを表します。
#   statement {
#     # sid:ポリシーステートメントのID（識別子）です。通常、識別のために使用される
#     sid = ""
#     #  statementの効果を指定。"Allow":指定されたアクションが許可、"Deny" :拒否
#     effect = "Allow"
#     # actions:AWSリソースに対する操作を表す
#     actions = [
#       "ecr:GetAuthorizationToken",
#       "ecr:BatchCheckLayerAvailability",
#       "ecr:GetDownloadUrlForLayer",
#       "ecr:BatchGetImage",
#       "logs:CreateLogStream",
#       "logs:PutLogEvents"
#     ]
#     # アクションが適用されるAWSリソースを指定します。"*" はすべてのリソースを意味
#     resources = ["*"]
#   }
#   # AmazonS3FullAccess
#   statement {
#     effect = "Allow"
#     actions = [
#       "s3:*",
#       "s3-object-lambda:*"
#     ]
#     resources = ["*"]
#   }
#   # AmazonSSMFullAccess
#   statement {
#     effect = "Allow"
#     actions = [
#       "cloudwatch:PutMetricData",
#       "ds:CreateComputer",
#       "ds:DescribeDirectories",
#       "ec2:DescribeInstanceStatus",
#       "logs:*",
#       "ssm:*",
#       "ec2messages:*"
#     ]
#     resources = ["*"]
#   }
#   statement {
#     effect = "Allow"
#     actions = [
#       "iam:CreateServiceLinkedRole"
#     ]
#     resources = ["arn:aws:iam::*:role/aws-service-role/ssm.amazonaws.com/AWSServiceRoleForAmazonSSM*"]
#     # 3 ステートメントの条件を指定。条件を満たす場合にのみステートメントが適用。
#     condition {
#       test     = "StringLike"
#       variable = "iam:AWSServiceName"
#       values = [
#         "ssm.amazonaws.com"
#       ]
#     }
#   }
#   statement {
#     effect = "Allow"
#     actions = [
#       "iam:DeleteServiceLinkedRole",
#       "iam:GetServiceLinkedRoleDeletionStatus"
#     ]
#     resources = ["arn:aws:iam::*:role/aws-service-role/ssm.amazonaws.com/AWSServiceRoleForAmazonSSM*"]
#   }
#   statement {
#     effect = "Allow"
#     actions = [
#       "ssmmessages:CreateControlChannel",
#       "ssmmessages:CreateDataChannel",
#       "ssmmessages:OpenControlChannel",
#       "ssmmessages:OpenDataChannel"
#     ]
#     resources = ["*"]
#   }
#   # CloudWatchAgentServerPolicy
#   statement {
#     effect = "Allow"
#     actions = [
#       "cloudwatch:PutMetricData",
#       "ec2:DescribeVolumes",
#       "ec2:DescribeTags",
#       "logs:PutLogEvents",
#       "logs:DescribeLogStreams",
#       "logs:DescribeLogGroups",
#       "logs:CreateLogStream",
#       "logs:CreateLogGroup"
#     ]
#     resources = ["*"]
#   }
#   statement {
#     effect = "Allow"
#     actions = [
#       "ssm:GetParameter"
#     ]
#     resources = ["arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"]
#   }
# }
# ------------------------------------------------------------------------------------------------
# AmazonS3FullAccess
# data "aws_iam_policy_document" "s3_full_access_policy" {
# }
# ------------------------------------------------------------------------------------------------
# AmazonSSMFullAccess
# data "aws_iam_policy_document" "ssm_full_access_policy" {
# }
# ------------------------------------------------------------------------------------------------
# CloudWatchAgentServerPolicy
# data "aws_iam_policy_document" "cloudwatch_agent_server_policy" {
# }

# 4
# resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
#   role       = "portfolio-ecsTaskExecutionRole"
# }
# resource "aws_iam_role_policy_attachment" "s3_full_access" {
#   policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
#   role       = "portfolio-ecsTaskExecutionRole"
# }
# resource "aws_iam_role_policy_attachment" "ssm_full_access" {
#   policy_arn = "arn:aws:iam::aws:policy/AmazonSSMFullAccess"
#   role       = "portfolio-ecsTaskExecutionRole"
# }
# resource "aws_iam_role_policy_attachment" "cloudwatch_agent_server_policy" {
#   policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
#   role       = "portfolio-ecsTaskExecutionRole"
# }



/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_iam_role.[リソース名] [IAMロール名]

================================================================================================
1.
- Terraform の `data` ブロックでは、Terraform が読み込むことはできるが管理はできないデータソースを定義すること
ができる。これらのデータソースはAWSのようなプロバイダから情報を取得し、Terraformの設定内で他のリソースやアウトプッ
トを設定するために使用することができます。データソースは、Terraformの管理外で変更される可能性のある動的な値を取得し
たり、現在のワークスペースでTerraformが直接管理していないリソースに関する情報を収集したりするのに便利です。
- AWS、Google Cloud、Azure などの Terraform プロバイダから、リソースを管理することなく情報を照会・取得できる
ように設計された強力な機能です。これらのデータソースは、読み取り専用のインターフェイスを提供し、Terraformプロジェク
トにおける動的な構成や依存関係の管理に不可欠なツールとなります。
- Terraform は `data` ブロックを処理する際に、指定されたプロバイダの API に対して読み込み処理を行い、必要な情報
を取得する。この操作は `terraform plan` または `terraform apply` フェーズで実行され、最新のデータを取得する。
- 取得した情報は、環境変数の設定やリソース属性の設定など、Terraform の設定内で利用することができる。
------------------------------------------------------------------------------------------------
下記の書き換え
{
      Statement = [
        {
          Action = "sts:AssumeRole"
          Effect = "Allow"
          Principal = {
            Service = "ecs-tasks.amazonaws.com"
          }
          Sid = ""
        },
      ]
      Version = "2012-10-17"
}

================================================================================================
1.2
- ポリシードキュメントは `statement`ブロックによって定義され、ポリシーに含まれる権限を指定します。各`statement`
には、許可または拒否されるアクション、それらのアクションを実行できるリソース、ステートメントが適用されるプリンシパル
(ユーザー、ロール、AWS サービス) に関する情報を含めることができる。
- ステートメント内の `actions` パラメータは、ポリシーが許可または拒否するアクションを指定します。この例では、
`"sts:AssumeRole"` が許可されており、エンティティがロールを引き受けることができる。
- effect` パラメータは、アクションを許可 (`"Allow"`) するか、拒否 (`"Deny"`) するかを指定します。ここでは
`"Allow"` とする。

================================================================================================
1.3
- principals`ブロックは、誰がその役割を引き受けることを許可されるかを定義する。これはサービスプリンシパル
`"ecs-tasks.amazonaws.com"` に設定され、Amazon ECS タスクがこのポリシーを引き継ぐことを意味する。
- version` パラメータはポリシーの言語バージョンを定義し、`"2012-10-17"` がポリシーのすべての機能をサポートする
のバージョンです。
================================================================================================
2
既存のaws_iam_role設定に基づいて、特にカスタムポリシーが必要ない場合は、data "aws_iam_policy_document"の設
定は不要です。カスタムポリシーが必要な場合、これらの追加設定が必要になります。
------------------------------------------------------------------------------------------------
Terraformの `data` ブロックは、Terraformの設定ファイル内でデータソースを定義し、そのデータを取得して設定ファイ
ル内で使用するために使用されます。データソースは、AWS、Azureなどのクラウドプロバイダーから情報を取得するのに役立ち
ます。

================================================================================================
3
元の形
"Condition": {
                "StringLike": {
                    "iam:AWSServiceName": "ssm.amazonaws.com"
                }
}
------------------------------------------------------------------------------------------------
**test**: 条件の比較演算子を指定します。**values**: 比較の基準となる値のリストを指定します。
**variable**: 比較の対象となるキーまたは変数を指定します。
------------------------------------------------------------------------------------------------
- `test = "StringLike"`:
この条件式は文字列が特定のパターンと「一致するかどうか」をテストします。この例では具体的な文字列
"ssm.amazonaws.com" との一致を見ています。
- `variable = "iam:AWSServiceName"`:
この変数はAWSのIAMサービスが内部で使用する属性です。この変数に設定されている値（AWSサービス名）が`values`で指定
された値と一致する場合に、この`statement`のポリシーが適用されます。
- `values = ["ssm.amazonaws.com"]`:
この値は上記の`test`と`variable`に基づいて評価されます。具体的には、IAMのサービス名が "ssm.amazonaws.com" と
一致する場合のみ、このステートメント（`statement`）内のアクションが許可されます。
------------------------------------------------------------------------------------------------
- この`condition` ブロックは、IAMのサービス名が "ssm.amazonaws.com" である場合にのみ、
"iam:CreateServiceLinkedRole" というアクションを許可します。これは、AWSのSimple Systems Manager（SSM）サ
ービスに特化した設定です。

================================================================================================
4
既存のaws_iam_role設定に基づいて、特にカスタムポリシーが必要ない場合は、"aws_iam_role_policy_attachment"の
設定は不要です。カスタムポリシーが必要な場合、これらの追加設定が必要になります。
------------------------------------------------------------------------------------------------
terraform import aws_iam_role_policy_attachment.<name> <ロール名>/<ポリシーのarn>
実際の例：
terraform import aws_iam_role_policy_attachment.ecs_task_execution_role_policy portfolio-ecsTaskExecutionRole/arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy


@          @@          @@          @@          @@          @@          @@          @@          @
IAMロールの設定値の解説
================================================================================================
- **"Version"**
- 具体例: `"Version": "2012-10-17"`
- 説明: IAM ポリシー言語のバージョンを指定します。このフィールドでサポートされているバージョンを指定することで、ポ
リシーの解釈が確実になります。
================================================================================================
- **"Statement"**
------------------------------------------------------------------------------------------------
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-bucket/*"
    }
  ]
------------------------------------------------------------------------------------------------
- 説明: ポリシーの主要な部分であり、一連の許可または拒否の規則を定義します。配列形式で複数のステートメントを含むこ
とができます。
================================================================================================
- **"Effect"**
- 具体例: `"Effect": "Allow"`
- 説明: ステートメントが許可するアクションか拒否するアクションかを指定します。`"Allow"` または `"Deny"` のいず
れかを設定します。
================================================================================================
- **"Action"**
- 具体例: `"Action": "s3:GetObject"`
- 説明: 許可または拒否されるAWSサービスのアクションを指定します。ワイルドカード（`"*"`）を使用して複数のアクショ
ンを指定することも可能です。
================================================================================================
- **"Resource"**
- 具体例: `"Resource": "arn:aws:s3:::example-bucket/*"`
- 説明: アクションが適用されるリソースをARN（Amazon Resource Name）で指定します。ワイルドカードを使用して複数
のリソースを指定することもできます。
================================================================================================
- **"Condition"**
------------------------------------------------------------------------------------------------
"Condition": {
    "IpAddress": {
      "aws:SourceIp": "192.0.2.0/24"
    }
  }
-------------------------------------------------------------------------------------------------
説明: ステートメントが適用される条件を指定します。この例では、指定されたIP範囲からのアクセスのみ許可されます。

*/