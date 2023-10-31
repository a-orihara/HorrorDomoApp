# ================================================================================================
# IAM "aws_iam_role"
# ================================================================================================

# 1
resource "aws_iam_role" "portfolio_ecs_task_execution_role" {
  assume_role_policy = jsonencode(
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
  )
  create_date           = "2023-09-29T04:16:31Z"
  description           = "Allows ECS tasks to call AWS services on your behalf."
  force_detach_policies = false
  id                    = "portfolio-ecsTaskExecutionRole"
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
  unique_id            = "AROAUEHI34MWF3TPVA4OU"
  inline_policy {}
}
# ================================================================================================
# IAM "aws_iam_policy_document"
# ================================================================================================
# 欄外 AmazonECSTaskExecutionRolePolicy
data "aws_iam_policy_document" "ecs_task_execution_role_policy" {
  # AmazonECSTaskExecutionRolePolicy
  # version:IAMポリシードキュメントのバージョン
  version = "2012-10-17"
  # statement:IAMポリシー内の個別のアクション許可/拒否ルールを表します。
  statement {
    # sid:ポリシーステートメントのID（識別子）です。通常、識別のために使用される
    sid = ""
    #  statementの効果を指定。"Allow":指定されたアクションが許可、"Deny" :拒否
    effect = "Allow"
    # actions:AWSリソースに対する操作を表す
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    # アクションが適用されるAWSリソースを指定します。"*" はすべてのリソースを意味
    resources = ["*"]
  }
}
# ------------------------------------------------------------------------------------------------
# AmazonS3FullAccess
data "aws_iam_policy_document" "s3_full_access_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:*",
      "s3-object-lambda:*"
    ]
    resources = ["*"]
  }
}
# ------------------------------------------------------------------------------------------------
# AmazonSSMFullAccess
data "aws_iam_policy_document" "ssm_full_access_policy" {
  statement {
    effect = "Allow"
    actions = [
      "cloudwatch:PutMetricData",
      "ds:CreateComputer",
      "ds:DescribeDirectories",
      "ec2:DescribeInstanceStatus",
      "logs:*",
      "ssm:*",
      "ec2messages:*"
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "iam:CreateServiceLinkedRole"
    ]
    resources = ["arn:aws:iam::*:role/aws-service-role/ssm.amazonaws.com/AWSServiceRoleForAmazonSSM*"]
    # 2 ステートメントの条件を指定。条件を満たす場合にのみステートメントが適用。
    condition {
      test     = "StringLike"
      variable = "iam:AWSServiceName"
      values = [
        "ssm.amazonaws.com"
      ]
    }
  }
  statement {
    effect = "Allow"
    actions = [
      "iam:DeleteServiceLinkedRole",
      "iam:GetServiceLinkedRoleDeletionStatus"
    ]
    resources = ["arn:aws:iam::*:role/aws-service-role/ssm.amazonaws.com/AWSServiceRoleForAmazonSSM*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = ["*"]
  }
}
# ------------------------------------------------------------------------------------------------
# CloudWatchAgentServerPolicy
data "aws_iam_policy_document" "cloudwatch_agent_server_policy" {
  statement {
    effect = "Allow"
    actions = [
      "cloudwatch:PutMetricData",
      "ec2:DescribeVolumes",
      "ec2:DescribeTags",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "logs:DescribeLogGroups",
      "logs:CreateLogStream",
      "logs:CreateLogGroup"
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameter"
    ]
    resources = ["arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"]
  }
}




/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform import aws_iam_role.[リソース名] [IAMロール名]

================================================================================================
2
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