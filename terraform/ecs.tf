# ================================================================================================
# ECS "aws_ecs_cluster"
# ================================================================================================
# 1 "ecs-on-fargate-cluster"
resource "aws_ecs_cluster" "ecs-on_fargate_cluster" {
  # ECSクラスターの名前を指定
  name     = "portfolio-ecs-on-fargate-cluster"
  tags     = {}
  tags_all = {}
  # 1.2
  configuration {
    execute_command_configuration {
      logging = "DEFAULT"
    }
  }
  # 1.3
  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}

# ================================================================================================
# ECS "aws_ecs_task_definition"
# ================================================================================================
# ------------------------------------------------------------------------------------------------
# 2 "fargate_task_definition" rails、nginxのタスク定義
resource "aws_ecs_task_definition" "fargate_task_definition" {
  # ECSタスク内で実行されるコンテナの設定。JSON形式。
  container_definitions = jsonencode(
    [
      {
        # コンテナが使用するCPUの割り当て
        cpu = 0
        # コンテナ内で使用できる環境変数を指定
        environment = [
          {
            name  = "RAILS_LOG_TO_STDOUT"
            value = "true"
          },
          {
            name = "RAILS_MASTER_KEY"
            # （SSM）パラメータから取得
            value = aws_ssm_parameter.ssm_parameter.value
          },
          {
            name  = "TMDB_API_KEY"
            value = var.tmbd_api_key
          }
        ]
        # コンテナ内で使用する環境変数ファイルを指定するための設定。空のリスト：ファイルは使っていない
        environmentFiles = []
        # このコンテナがタスク内で必須かどうかを指定。trueは必須。
        essential = true
        # コンテナのヘルス状態を監視するための設定
        healthCheck = {
          # 2.3 ヘルスチェックを行うコマンドを指定
          command = [
            "CMD-SHELL",
            "curl --unix-socket /api-app/tmp/sockets/puma.sock localhost/api/v1/health_check || exit 1",
          ]
          # ヘルスチェックの間隔を秒単位で指定
          interval = 300
          # ヘルスチェックのリトライ回数を指定
          retries = 3
          # ヘルスチェックのタイムアウトを秒単位で指定
          timeout = 5
        }
        # ECSタスクで実行されるコンテナのDockerイメージを指定
        # 1.4 image = "283956208428.dkr.ecr.ap-northeast-1.amazonaws.com/rails-img-prod"
        # image = aws_ecr_repository.rails_img_prod.repository_url
        image = "${aws_ecr_repository.rails_img_prod.repository_url}:${var.ecr_image_tag}"
        # コンテナのログ設定を指定するためのセクション
        logConfiguration = {
          # ログドライバーを指定しており、ここでは"awslogs"が指定
          logDriver = "awslogs"
          # ログドライバーのオプションを指定するためのセクション
          options = {
            # AWS CloudWatch Logsに新しいロググループを作成するためのオプション
            awslogs-create-group = "true"
            # ログを格納するCloudWatch Logsグループの名前を指定
            awslogs-group = "/ecs/portfolio-fargate-task-definition"
            # CloudWatch Logsが利用するリージョンを指定
            awslogs-region = "ap-northeast-1"
            # ログストリームのプレフィックスを指定
            awslogs-stream-prefix = "ecs"
          }
          # コンテナで使用するシークレット情報を指定するための設定。空のリストでシークレット情報は未指定。
          secretOptions = []
        }
        # コンテナに割り当てるメモリの量をMB単位で指定
        memory = 1024
        # コンテナに対するメモリの予約量をMB単位で指定
        memoryReservation = 1024
        # コンテナ内でのボリュームのマウントポイントを指定するための設定
        mountPoints = []
        # コンテナの名前を指定
        name = "rails-fargate-ctr"
        # コンテナのポートマッピングを指定する設定
        portMappings = [
          {
            # アプリケーション（コンテナ）の通信プロトコルを指定
            appProtocol = "http"
            # コンテナ内のポート番号を指定
            containerPort = 3000
            # ホストマシンのポート番号を指定
            hostPort = 3000
            # ポートマッピングの名前を指定
            name = "rails-fargate-ctr-3000-tcp"
            # ポートの通信プロトコルを指定
            protocol = "tcp"
          },
        ]
        # コンテナのリソース制限（ulimit）を指定するための設定
        ulimits = []
        # 他のコンテナからボリュームを共有するための設定
        volumesFrom = []
      },
      {
        cpu = 0
        # コンテナの起動や停止が他のコンテナのヘルス状態に依存する場合に使用する設定
        dependsOn = [
          {
            # 依存するコンテナのヘルス状態を指定
            condition = "HEALTHY"
            # 依存するコンテナの名前を指定
            containerName = "rails-fargate-ctr"
          },
        ]
        environment      = []
        environmentFiles = []
        essential        = true
        # 4.1
        healthCheck = {
          command = [
            "CMD-SHELL",
            "curl -f http://localhost/api/v1/health_check || exit 1",
          ]
          interval = 300
          retries  = 3
          timeout  = 5
        }
        image = aws_ecr_repository.nginx_img_prod.repository_url
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-create-group  = "true"
            awslogs-group         = "/ecs/portfolio-fargate-task-definition"
            awslogs-region        = "ap-northeast-1"
            awslogs-stream-prefix = "ecs"
          }
          secretOptions = []
        }
        memory            = 1024
        memoryReservation = 1024
        mountPoints       = []
        name              = "nginx-fargate-ctr"
        portMappings = [
          {
            appProtocol   = "http"
            containerPort = 80
            hostPort      = 80
            name          = "nginx-fargate-ctr-80-tcp"
            protocol      = "tcp"
          },
        ]
        volumesFrom = [
          {
            readOnly        = false
            sourceContainer = "rails-fargate-ctr"
          },
        ]
      },
    ]
  )
  # タスクで使用するCPUの単位を指定
  cpu = "256"
  # 2.1 タスクがECSエージェントに対してAWSサービスを呼び出す権限を与えるIAMロールのARNを指定
  # execution_role_arn = "arn:aws:iam::283:role/portfolio-ecsTaskExecutionRole"
  execution_role_arn = aws_iam_role.portfolio_ecs_task_execution_role.arn
  # ECSタスク定義のファミリー名を指定
  family = "portfolio-fargate-task-definition"
  # タスクで使用するメモリの単位
  memory = "2048"
  # タスクが使用するネットワークモードを指定。Fargateの場合、awsvpcモードが使用されます。
  network_mode = "awsvpc"
  # タスクが動作する環境を指定
  requires_compatibilities = [
    "FARGATE",
  ]
  # ECSタスク定義に関連付けるタグ（キーと値のペア）を指定
  tags = {}
  # すべてのリソースに関連付けるタグ（キーと値のペア）を指定
  tags_all = {}
  # 2.1 ECSタスクが他のAWSサービスとやり取りするためのIAMロールのARNを指定
  task_role_arn = aws_iam_role.portfolio_ecs_task_execution_role.arn
  # タスクが動作するランタイムプラットフォーム
  runtime_platform {
    # CPUアーキテクチャを指定
    cpu_architecture = "X86_64"
    #  オペレーティングシステムのファミリ
    operating_system_family = "LINUX"
  }
}

# ------------------------------------------------------------------------------------------------
# "fargate_task_definition_frontend"
resource "aws_ecs_task_definition" "fargate_task_definition_frontend" {
  # ALB側のヘルスチェック機能の方を活用するので、フロント側のコンテナのヘルスチェックは記述しない
  container_definitions = jsonencode(
    [
      {
        cpu              = 0
        environment      = []
        environmentFiles = []
        essential        = true
        # image            = aws_ecr_repository.nextjs_img_prod.repository_url
        image = "${aws_ecr_repository.nextjs_img_prod.repository_url}:${var.ecr_image_tag}"
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-create-group  = "true"
            awslogs-group         = "/ecs/portfolio-fargate-task-definition-frontend"
            awslogs-region        = "ap-northeast-1"
            awslogs-stream-prefix = "ecs"
          }
          secretOptions = []
        }
        memory            = 1024
        memoryReservation = 1024
        mountPoints       = []
        name              = "nextjs-fargate-ctr"
        portMappings = [
          {
            appProtocol   = "http"
            containerPort = 80
            hostPort      = 80
            name          = "nextjs-fargate-ctr-80-tcp"
            protocol      = "tcp"
          },
        ]
        ulimits     = []
        volumesFrom = []
      },
    ]
  )
  cpu                = "256"
  execution_role_arn = aws_iam_role.portfolio_ecs_task_execution_role.arn
  family             = "portfolio-fargate-task-definition-frontend"
  memory             = "1024"
  network_mode       = "awsvpc"
  requires_compatibilities = [
    "FARGATE",
  ]
  tags          = {}
  tags_all      = {}
  task_role_arn = aws_iam_role.portfolio_ecs_task_execution_role.arn

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }
}

# ================================================================================================
# ECS "aws_ecs_service"
# ================================================================================================
# 3 "fargate_service"
resource "aws_ecs_service" "fargate_service" {
  # ECSクラスターの識別子を指定
  cluster = aws_ecs_cluster.ecs-on_fargate_cluster.id
  # サービスのデプロイ時に利用可能なタスクの最大数のパーセンテージを指定
  deployment_maximum_percent = 200
  # サービスのデプロイ中に最低限ヘルスな状態である必要があるタスクの最小パーセンテージを指定
  deployment_minimum_healthy_percent = 100
  # サービスで実行するタスクの希望する数を指定
  desired_count = 1
  # ECSによって管理されるタグが有効かを指定
  enable_ecs_managed_tags = true
  # EC2インスタンス用のExecute Commandが有効かを指定
  enable_execute_command = true
  # ヘルスチェックの許容期間を秒単位で指定
  health_check_grace_period_seconds = 0
  # サービスが使用する起動タイプを指定
  launch_type = "FARGATE"
  # サービスの名前を指定
  name = "portfolio-fargate-service"
  # サービスが使用するFargateプラットフォームのバージョンを指定
  platform_version = "1.4.0"
  # タスクのスケジューリング戦略を指定。"REPLICA"：タスクの数を指定されたレプリカ数に保つことを意味。
  scheduling_strategy = "REPLICA"
  # サービスに関連付けるタグを指定
  tags     = {}
  tags_all = {}
  # サービスで使用するタスク定義のARNを指定
  task_definition = aws_ecs_task_definition.fargate_task_definition.arn
  # デプロイメントのサーキットブレーカーの設定
  deployment_circuit_breaker {
    # サーキットブレーカーが有効でデプロイが失敗した場合にロールバックが行われるように設定
    enable   = true
    rollback = true
  }
  # デプロイメントのコントローラーのタイプを指定
  deployment_controller {
    type = "ECS"
  }
  # サービスに関連付けるロードバランサーの設定
  load_balancer {
    # ロードバランサーに関連付けるコンテナの名前
    container_name = "nginx-fargate-ctr"
    # コンテナが受け付けるポート
    container_port = 80
    # ターゲットグループのARN。ここで設定した場合、aws_lb_target_group_attachmentの設定は不要。
    target_group_arn = aws_lb_target_group.alb_tg.arn
  }
  # サービスのネットワーク構成を指定
  network_configuration {
    # コンテナにパブリックIPアドレスを割り当てるかどうかの指定
    assign_public_ip = true
    # セキュリティグループのIDのリスト
    security_groups = [
      aws_security_group.pub_sg.id,
    ]
    # サービスが配置されるサブネットのIDのリスト
    subnets = [
      aws_subnet.pub_subnet_a.id,
      aws_subnet.pub_subnet_c.id,
    ]
  }
  # タイムアウトの設定を指定
  timeouts {}
  depends_on = [
    aws_lb.alb,
    aws_lb_target_group.alb_tg
  ]
}
# ------------------------------------------------------------------------------------------------
# "fargate_service_frontend"
resource "aws_ecs_service" "fargate_service_frontend" {
  cluster                            = aws_ecs_cluster.ecs-on_fargate_cluster.id
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  desired_count                      = 1
  enable_ecs_managed_tags            = true
  enable_execute_command             = false
  health_check_grace_period_seconds  = 0
  launch_type                        = "FARGATE"
  name                               = "portfolio-fargate-service-frontend"
  platform_version                   = "LATEST"
  scheduling_strategy                = "REPLICA"
  tags                               = {}
  tags_all                           = {}
  task_definition                    = aws_ecs_task_definition.fargate_task_definition_frontend.arn
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  deployment_controller {
    type = "ECS"
  }
  load_balancer {
    container_name   = "nextjs-fargate-ctr"
    container_port   = 80
    target_group_arn = aws_lb_target_group.frontend_alb_tg.arn
  }
  network_configuration {
    assign_public_ip = true
    security_groups = [
      aws_security_group.front_sg.id,
    ]
    subnets = [
      aws_subnet.pub_subnet_a.id,
      aws_subnet.pub_subnet_c.id,
    ]
  }
  timeouts {}
  depends_on = [
    aws_lb.frontend_alb,
    aws_lb_target_group.frontend_alb_tg
  ]
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
インポートする順番
aws_ecs_cluster: 最初にECSクラスターをインポートします。
aws_ecs_task_definition: 次にタスク定義をインポート。
aws_ecs_service: 最後にECSサービスをインポート。この時点で、タスク定義とクラスターが既に存在する必要があります。
------------------------------------------------------------------------------------------------
terraform import aws_ecs_cluster.<name> <clusterの名前>
実際の例：
terraform import aws_ecs_cluster.ecs-on-fargate-cluster portfolio-ecs-on-fargate-cluster

================================================================================================
1.1

================================================================================================
1.2
- `configuration`: この設定は、ECSクラスターの設定を構成するためのブロックです。提供されたコードでは、
`execute_command_configuration` を指定しています。このブロック内で `logging` を "DEFAULT" に設定しており、
コンテナ実行時のコマンドログをデフォルトの設定で処理することを示しています。

================================================================================================
1.3
- `setting`: この設定は、ECSクラスターの設定を指定するためのブロックです。提供されたコードでは、`name` を
"containerInsights" に設定し、`value` を "disabled" に設定しています。これにより、コンテナインサイトが無効に
なり、ECSクラスター内のコンテナに関する詳細なパフォーマンスデータが収集されないようになります。

================================================================================================
1.4
- `aws_ecr_repository.rails_img_prod.repository_url`の`repository_url` 属性は、ECR リポジトリの作成時
に AWS によって動的に生成されるため、"aws_ecr_repository"リソースブロック内で設定していなくても使用できます。
- `aws_ecr_repository`リソースに明示的に `repository_url` を設定することはありませんが、Terraform は
`repository_url` をリソース作成後に参照できる属性として理解します。
- タグが明示的に指定されていない場合、Dockerは "latest "タグを想定します。

================================================================================================
2
terraform import aws_ecs_task_definition.<name> <タスク定義のarn>
実際の例：
terraform import aws_ecs_task_definition.fargate_task_definition arn:aws:ecs:ap-northeast-1:283:task-definition/portfolio-fargate-task-definition:11

================================================================================================
2.1
. **コンテナにアタッチされた IAM ロールが付与する権限:**.
- タスク定義の `execution_role_arn` を通じてコンテナにアタッチされた IAM ロール
`portfolio_ecs_task_execution_role` は、ユーザーに代わって AWS サービスを呼び出す権限を ECS タスクに付与す
る。
- AmazonS3FullAccess:** Amazon S3 へのフルアクセスを許可し、タスクが S3 バケット内のオブジェクトをアップロー
ド、ダウンロード、削除できるようにする。
- AmazonSSMFullAccess:** AWS Systems Manager へのフルアクセスを許可し、タスクが SSM パラメータとやり取り
できるようにします。
- CloudWatchAgentServerPolicy:**タスクが監視とロギング目的でCloudWatchとやり取りできるようにします。タスク
はログをCloudWatchにプッシュすることができ、ログの一元管理を可能にする。
- AmazonECSTaskExecutionRolePolicy:** ECRからのDockerイメージのプルやCloudWatchへのログの保存など、ECSタ
スクの実行に必要なパーミッションを提供します。
- ポリシードキュメント `iam_policy_document` は、ECSタスク（`ecs-tasks.amazonaws.com`）がこのロールを引き
受けることを指定し、これらのタスクがこのロールによって付与された権限を継承できるようにする。
------------------------------------------------------------------------------------------------
. `execution_role_arn` と `task_role_arn` の解説と違い:
- `execution_role_arn`: このIAMロールはAmazon ECSタスクランタイムエージェントに、DockerイメージをECRからプ
ルしたり、logsをCloudWatch Logsに書き込んだりする権限をエージェントに与えます。
- `task_role_arn`: このIAMロールは、タスク自体（コンテナ内で動作するアプリケーション）が他のAWSサービスとやり取
りするために使用されます。例えば、DynamoDBテーブルにデータを書き込んだり、S3バケットからファイルを読み取ったりする
場合に使います。
------------------------------------------------------------------------------------------------
**違い**: `execution_role_arn`はECSエージェント（実行環境）に対する権限、`task_role_arn`はタスク内のアプリ
ケーションに対する権限を制御します。

================================================================================================
2.3
- ECS タスク定義のヘルスチェックコマンドは、ECS自体によって実行されます。具体的には、ECSタスク定義で定義されたコン
テナのコンテキスト内で実行されます。ECSはこのコマンドを使用して、健全性をチェックする。
------------------------------------------------------------------------------------------------
- cmd-shell"`:コンテナのシェル環境でコマンドを実行することを指定する。
------------------------------------------------------------------------------------------------
. curl --unix-socket /api-app/tmp/sockets/puma.sock localhost/api/v1/health_check || exit 1"`：
------------------------------------------------------------------------------------------------
- curl`： コマンドラインからHTTPリクエストを行うためのコマンドです。
------------------------------------------------------------------------------------------------
- --unix-socket/api-app/tmp/sockets/puma.sock`： このオプションは `curl` に指定された Unix ソケットを接
続に使用するように指示します。TCP/IP ネットワーク接続の代わりに、`curl` は Unix ソケットファイルを介して接続しま
す。
- `--unix-socket`オプションは、リクエストをネットワークソケットではなくUnixドメインソケットを通して行うことを指
定します。Unix ドメインソケットは同じマシン上のプロセス間通信 (IPC) に使用され、ローカル接続に TCP/IP ソケットを
使用するよりも効率的に通信する方法を提供します。
------------------------------------------------------------------------------------------------
- localhost/api/v1/health_check`： リクエスト先のURLパス。Unixソケットを使用していても、`curl`はURLパスを
要求します。接続はネットワークスタックを経由しないため、`localhost` の部分は本質的にプレースホルダです。
- `localhost` の部分は本質的にプレースホルダとは、`localhost`の部分が実際のドメイン名やIPアドレスの代用として動
作します。Nginxの設定に`server unix:///api-app/tmp/sockets/puma.sock`とある場合は、NginxがPumaサーバーに
リクエストを転送するために使用するUnixソケットファイルへのパスを指定しています。このserverの名前が`localhost`。
- つまり、代わりにRailsへの実際の接続は`/api-app/tmp/sockets/puma.sock`にあるUnixソケットを介して行われるた
め、プレースホルダとして機能します
------------------------------------------------------------------------------------------------
- exit 1`： コマンドのこの部分は、`curl` コマンドが失敗した場合 (例えば、ヘルスチェックエンドポイントが成功ステ
ータスを返さなかった場合)、スクリプトまたはコマンドがエラーを示すステータスコード 1 で終了することを指定します。
これは実際に実行されるコマンドです。curl`を使用して、`/api-app/tmp/sockets/puma.sock`にあるUnixソケットファ
イルを通してローカルのPumaサーバー（Rubyウェブサーバー）にリクエストを送信します。このコマンドは
`/api/v1/health_check` というパスを要求する。このコマンドが失敗した場合（ヘルスチェックが正常な応答を返さなかっ
た場合）、`||exit 1` は失敗を示す `1` というステータスでコマンドが終了することを保証する。

================================================================================================
3
terraform import aws_ecs_service.<name> <cluster name>/<service name>
実際の例：
terraform import aws_ecs_service.fargate_service portfolio-ecs-on-fargate-cluster/portfolio-fargate-service

================================================================================================
4.1
nginxのヘルスチェックコマンド
"CMD-SHELL",
"curl -f http://localhost/api/v1/health_check || exit 1",
------------------------------------------------------------------------------------------------
- `localhost` は `nginx.conf` の httpコンテキストのserverディレクティブの`server_name localhost;` で設
定された Nginx のバーチャルホストのサーバのローカルインスタンスを指します。ヘルスチェックコマンドが実行されると、
Nginxサーバが動作しているコンテナのコンテキスト内で実行されます。ここで、`localhost` は Nginx サーバー（バーチャ
ルホスト）自身を指しており、ヘルスチェックは Nginx の背後にあるアプリケーションが提供する `/api/v1/health_check`
エンドポイントを要求します。このセットアップにより、ヘルスチェックは背後のアプリケーションレイヤーまでのフルスタック
を検証し、両方が動作可能であることを確認します。
------------------------------------------------------------------------------------------------
- curl -f http://localhost/api/v1/health_check` を使用したRailsへのアクセスは、Railsアプリケーションへの
リクエストをプロキシするNginx設定によって可能になります。nginx.conf`ファイル内の
`server unix:///api-app/tmp/sockets/puma.sock fail_timeout=30s;` という特定の設定で可能です。これは、
Railsを実行しているアプリケーションサーバーであるPumaに接続されたUnixドメインソケット経由でRailsにリクエストを転
送するようにNginxに指示します。
- curlコマンドの`localhost`はNginxサーバー自身を指し、Nginxサーバーは指定されたUnixソケットパスを介してRails
にリクエストをプロキシします
------------------------------------------------------------------------------------------------
# - `nginx.conf` の`upstream api-app`の、`server unix:///api-app/tmp/sockets/puma.sock;`この行は
Puma（Railsサーバー）がリッスンしているUnixソケットにリクエストを転送するようにNginxを設定します。このUnixソケッ
トパス（`/api-app/tmp/sockets/puma.sock`）はNginxとPumaが内部的に通信に使用し、NginxとPumaの間でTCP/IPを
介したHTTPリクエストの必要性を置き換えます。
- curl コマンド `curl -f http://localhost/api/v1/health_check` の `localhost` は、同じネットワークまた
はコンテナ環境内で実行された場合の Nginx サーバーへの参照です。このセットアップでは、`localhost` は Unix ソケッ
トパスに直接関係しません。その代わり、`http://localhost/api/v1/health_check`へのリクエストはNginxが受け取り
、設定されたUnixソケットパスを経由してRailsアプリケーションに転送されます。localhost`からUnixソケット
（`/api-app/tmp/sockets/puma.sock`）への実際の「置き換え」や「転送」は、Nginxの設定によって抽象化され、舞台
裏で行われます。
- `http://localhost/api/v1/health_check`のlocalhostでRailsへつながり、つまりRailsへ`、
http://<この部分のlocalhostがrailsのコンピュータに置き換わり>/api/v1/health_check`、api/v1/health_check
パスへリクエストしている
------------------------------------------------------------------------------------------------
- railsもnginxのヘルスチェックも、同じエンドポイントを対象にしているため似ているように見えますが、目的は異なる。
- Railsの健全性チェックでは、Unixソケットを介して接続することで、Pumaアプリケーションサーバがリクエストを処理する
能力を直接テストします。このチェックでは、Railsが稼働し、応答し、必要なサービス（データベースなど）に接続できること
を確認します。
- HTTPで実行されるNginxヘルスチェックは、Nginxウェブサーバが動作可能で、リクエストに対応できることを確認します。
また、NginxからRailsへの通信経路をネットワークスタックを通じて間接的にテストし、プロキシ転送やHTTPリクエスト処理
を含むウェブサービスインフラストラクチャ全体が機能していることを確認します。

*/