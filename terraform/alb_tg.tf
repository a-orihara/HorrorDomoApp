# ---------------------------------------------
# alb_tg
# ---------------------------------------------
# 1
resource "aws_lb_target_group" "alb_tg" {
  # 1.1
  deregistration_delay = "300"
  # 1.2
  load_balancing_algorithm_type = "round_robin"
  name                          = "portfolio-alb-tg"
  port                          = 80
  protocol                      = "HTTP"
  protocol_version              = "HTTP1"
  # 新しいターゲットがトラフィックの対象となる際に、徐々にトラフィックを増やすための遅延時間
  slow_start = 0
  tags       = {}
  tags_all   = {}
  # 1.3
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id
  # 1.4 ロードバランサーがターゲットの健康状態を監視するための設定
  health_check {
    enabled             = true
    healthy_threshold   = 5
    interval            = 30
    matcher             = "200"
    path                = "/api/v1/health_check"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
  # 1.5
  stickiness {
    cookie_duration = 86400
    enabled         = false
    type            = "lb_cookie"
  }
}

# 2
# resource "aws_lb_target_group_attachment" "portfolio_alb_tg_att_tf" {}

# ---------------------------------------------
# frontend_alb_tg
# ---------------------------------------------
resource "aws_lb_target_group" "portfolio_frontend_alb_tg_tf" {
  deregistration_delay          = "300"
  load_balancing_algorithm_type = "round_robin"
  name                          = "portfolio-frontend-alb-tg"
  port                          = 80
  protocol                      = "HTTP"
  protocol_version              = "HTTP1"
  slow_start                    = 0
  tags                          = {}
  tags_all                      = {}
  target_type                   = "ip"
  vpc_id                        = aws_vpc.vpc.id
  health_check {
    enabled             = true
    healthy_threshold   = 5
    interval            = 30
    matcher             = "200"
    path                = "/api/health_check"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
  stickiness {
    cookie_duration = 86400
    enabled         = false
    type            = "lb_cookie"
  }
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
terraform importのコマンド
terraform import aws_lb_target_group.NAME TARGET_GROUP_ARN

================================================================================================
1.1
. `deregistration_delay = "300"`:
- `deregistration_delay`は、ターゲットがアウトオブサービス（ターゲットが正常に応答しない）状態から削除されるま
での遅延時間を指定します。ここではターゲット（例: Webサーバー、アプリケーションサーバーなど）が正常に応答しない300
秒（5分）後にターゲットが削除されることを意味します。

================================================================================================
1.2
. `load_balancing_algorithm_type = "round_robin"`:
- この設定はALBのターゲットグループで使用されるロードバランシングアルゴリズムのタイプを指定します。
- "round_robin"は、トラフィックを順番に各ターゲットに分散するアルゴリズムです。各要求は順番にターゲットに送信され
、負荷が均等に分散されます。

================================================================================================
1.3
- target_type = "ip":
target_typeは、ターゲットグループに登録されるターゲットのタイプを指定します。
ターゲットタイプ"ip"は、ターゲットとしてIPアドレスを使用することを示します。つまり、このターゲットグループに登録さ
れるターゲットは、IPアドレスを持つサーバーなどのホストであることを意味します。このターゲットタイプは、通常のターゲ
ットグループで使用され、HTTPやTCPなどのプロトコルで通信する際にIPアドレスを指定します。

================================================================================================
1.4
. `health_check`:
- `health_check`は、ロードバランサーがターゲットの健康状態を監視するための設定です。健康チェックは、ターゲットが
正常に応答しているかどうかを確認し、応答しない場合にターゲットをアウトオブサービスにするのに役立ちます。
- `enabled`フィールドは、健康チェックが有効か無効かを示します。ここでは`true`に設定されており、健康チェックが有
効になっています。
- 他のフィールドには、健康チェックの詳細な設定が含まれています。たとえば、`healthy_threshold`は健康と見なすため
に必要な成功した応答の回数、`interval`は健康チェックの実行間隔、`matcher`は正常な応答を示すステータスコード（こ
こでは200）、`path`は健康チェックを実行するエンドポイントのパスなどが含まれます。

================================================================================================
1.5
- `stickiness`:
- `stickiness`は、セッションの粘着性を制御するための設定です。セッション粘着性は、同じクライアントが同じターゲッ
トに対して連続してリクエストを送信することを確保するために使用されます。
- `enabled`フィールドは、セッション粘着性が有効か無効かを示します。ここでは`false`に設定されており、セッション粘
着性は無効になっています。
- `cookie_duration`は、セッションクッキーの有効期間を設定します。セッション粘着性が有効である場合、クライアント
にクッキーが設定され、一定の期間内に同じターゲットにリクエストが送信されるようになります。有効期間は秒単位で指定され
ます。

================================================================================================
2
terraform import aws_lb_target_group_attachment.<NAME> <TARGET_GROUP_ARN/TARGET_ID/AVAILABILITY_ZONE

*/