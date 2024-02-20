# ================================================================================================
# ALB "aws_lb"
# ================================================================================================
# ------------------------------------------------------------------------------------------------
# 1 alb
resource "aws_lb" "alb" {
  desync_mitigation_mode           = "defensive"
  drop_invalid_header_fields       = false
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = false
  enable_http2                     = true
  enable_waf_fail_open             = false
  idle_timeout                     = 60
  internal                         = false
  ip_address_type                  = "ipv4"
  load_balancer_type               = "application"
  name                             = "portfolio-alb"
  security_groups = [
    aws_security_group.alb_sg.id,
  ]
  subnets = [
    aws_subnet.pub_subnet_a.id,
    aws_subnet.pub_subnet_c.id,
  ]
  tags     = {}
  tags_all = {}
  timeouts {}
}

# ------------------------------------------------------------------------------------------------
# frontend_alb
resource "aws_lb" "frontend_alb" {
  desync_mitigation_mode           = "defensive"
  drop_invalid_header_fields       = false
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = false
  enable_http2                     = true
  enable_waf_fail_open             = false
  idle_timeout                     = 60
  internal                         = false
  ip_address_type                  = "ipv4"
  load_balancer_type               = "application"
  name                             = "portfolio-frontend-alb"
  security_groups = [
    aws_security_group.alb_frontend_sg.id,
  ]
  subnets = [
    aws_subnet.pub_subnet_a.id,
    aws_subnet.pub_subnet_c.id,
  ]
  tags     = {}
  tags_all = {}
  timeouts {}
}
# ================================================================================================
# ALB "alb_listener"
# ================================================================================================
# 2 AWSコンソールでALB作成の際のリスナーとルーティングが、terrafomrでは独立している
resource "aws_lb_listener" "alb_listener_http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  tags              = {}
  tags_all          = {}
  default_action {
    # エラーになるので一旦コメントアウト
    # order            = 0
    target_group_arn = aws_lb_target_group.alb_tg.arn
    type             = "forward"
  }
  timeouts {}
}

resource "aws_lb_listener" "alb_listener_https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  # ACMの証明書を設定
  certificate_arn = aws_acm_certificate.acm_cert.arn
  tags            = {}
  tags_all        = {}
  default_action {
    # order            = 0
    target_group_arn = aws_lb_target_group.alb_tg.arn
    type             = "forward"
  }
  timeouts {}
}

# ------------------------------------------------------------------------------------------------
# frontend_alb_listener
resource "aws_lb_listener" "frontend_alb_listener_http" {
  load_balancer_arn = aws_lb.frontend_alb.id
  port              = 80
  protocol          = "HTTP"
  tags              = {}
  tags_all          = {}
  default_action {
    # 7.1
    order            = 1
    target_group_arn = aws_lb_target_group.frontend_alb_tg.arn
    # 7.2
    type             = "redirect"
    redirect {
            # 7.3
            # host        = "#{host}"
            # path        = "/#{path}"
            port        = "443"
            protocol    = "HTTPS"
            # query       = "#{query}"
            status_code = "HTTP_301"
    }
  }
  timeouts {}
}

# resource "aws_lb_listener" "frontend_alb_listener_http_2" {
#   # load_balancer_arn = aws_lb.frontend_alb.id
#   # port              = 80
#   # protocol          = "HTTP"
#   # tags              = {}
#   # tags_all          = {}
#   # default_action {
#   #   # order            = 0
#   #   target_group_arn = aws_lb_target_group.frontend_alb_tg.arn
#   #   type             = "forward"
#   # }
#   # timeouts {}
# }

# albにhttpsのlistenerを設定することが、ざっくり言うとacm証明書をalbに取り付けている。
resource "aws_lb_listener" "frontend_alb_listener_https" {
  load_balancer_arn = aws_lb.frontend_alb.id
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.acm_cert.arn
  tags              = {}
  tags_all          = {}
  default_action {
    # order            = 0
    target_group_arn = aws_lb_target_group.frontend_alb_tg.arn
    type             = "forward"
  }
  timeouts {}
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @


================================================================================================
1
- terraform importでaws_lbリソースをインポートするコマンドの書式:
terraform import aws_lb.<your_resource_name> <load_balancer_arn>

================================================================================================
2
terraform import aws_lb_listener.<NAME> <LISTENER_ARN>

@          @@          @@          @@          @@          @@          @@          @@          @
通信の流れ
================================================================================================
1. **ドメインアクセスの開始**:
- クライアント（例：ブラウザ）は特定のドメイン（URL）にアクセスを開始します。
------------------------------------------------------------------------------------------------
AWSのALBを使用している場合、特定のリスナーをHTTPSで設定し、ACMからのSSL/TLS証明書を関連付けることができます。
HTTPSリスナーが設定されていれば、そのドメインに対するアクセスはHTTPSを使用します。
================================================================================================
2. **HTTPSとACMの関連**:
- クライアントはHTTPSを通じてドメインに接続しようとします。HTTPSは、通信内容の暗号化やデータの完全性、そしてサー
バの真正性を確認するためのセキュアなHTTPプロトコルです。
- ACMは、SSL/TLS証明書を提供、管理するサービスです。この証明書は、HTTPS接続の際にサーバの真正性を確認するために
使用されます。
------------------------------------------------------------------------------------------------
ALB (Application Load Balancer) の設定:
httpかhttpsかの設定はALBに対して行う。
AWSのALBを使用している場合、特定のリスナーをHTTPSで設定し、ACMからのSSL/TLS証明書を関連付けることができます。
HTTPSリスナーが設定されていれば、そのドメインに対するアクセスはHTTPSを使用します。
このhttps接続（ssl処理）はwebサーバーでも出来るが、負荷がかかる為、albを使う。ロードバランサーには、この処理を高
速に行う専用の仕組みがある。
------------------------------------------------------------------------------------------------
ApplicationLoadBalancer（ALB）HTTPやHTTPSによるアクセスを分散させるために最適化されたロードバランサーです。
SSL処理を行ってくれたり、URLのパターン（例：「/userで始まる」など）といった複雑な条件で分散先を切り替えてくれたり
などの高度な機能が用意されています。
------------------------------------------------------------------------------------------------
AWSのALBでHTTPS通信を有効にするためには、ACMまたは他の方法で取得したSSL/TLS証明書が必要です。具体的には、ALBの
リスナーを設定する際にHTTPS（またはTLS）プロトコルを選択し、その際にSSL/TLS証明書を関連付ける必要があります。
ALBでHTTPSリスナーを設定する場合、証明書が必須です。
ACMを使用すると、証明書を無料で簡単に取得・管理できます。
ACMの証明書以外にも、他の認証局から取得した証明書をアップロードして使用することも可能です。
------------------------------------------------------------------------------------------------
クライアントとサーバ間でSSL/TLSハンドシェイクが行われます。このハンドシェイクの過程で、以下のことが行われます
サーバはACMによる公開鍵と共に自身の証明書をクライアントに送ります。
クライアントは証明書を検証し、信頼できる認証局（ACM）から発行されていることを確認します。
クライアントはこの公開鍵を使って、通信の際に使用する共通秘密鍵（セッションキー）を暗号化してサーバに送り返します。
サーバは自身の秘密鍵を使って共通秘密鍵（セッションキー）を復号し、両者はこの共通秘密鍵（セッションキー）を使って通信
を暗号化します。
ハンドシェイクが成功すると、クライアントとサーバはHTTPSを使用して暗号化された通信を開始できます。
------------------------------------------------------------------------------------------------
ドメインに対して SSL（Secure Sockets Layer）証明書を付与することによって、HTTPSプロトコルによる通信をできるよ
うになる。
================================================================================================
3. **証明書の確認**:
- クライアントは、Route53を経由してALB（Application Load Balancer）に接続を試みます。この時、ALBはACMから取
得したSSL/TLS証明書をクライアントに提示します。
- クライアントは証明書を検証し、信頼された認証機関（ACM）によって発行されていることを確認します。このプロセスによっ
て、クライアントは接続先が期待するサーバであることを確認できます。
================================================================================================
4. **HTTPSからHTTPへの変換**:
- ALBはHTTPSの終端を担当し、バックエンドのサーバ（この場合、ECS/Fargate上のタスク）にはHTTPでリクエストを転送し
ます。
================================================================================================
5. **リクエストの処理**:
- ALBは適切なターゲットグループにリクエストを転送します。この例では、Next.jsを実行しているECSタスクや、NGINXを経
由してRailsアプリケーションにアクセスするECSタスクがあります。
- ECSタスクはリクエストを処理し、必要に応じてデータベース（RDS MySQL）にアクセスします。
- 処理が完了すると、レスポンスがALBを経由してクライアントに返送されます。
================================================================================================
6. **クライアントへのレスポンス**:
- クライアントはHTTPSでレスポンスを受信します。このレスポンスは、ALBによって再びHTTPSで暗号化されています。クライ
アントは持っている共有秘密鍵（セッション鍵）で復号します。
- クライアントがALBの秘密鍵を持っていなくても、応答を共有秘密鍵（セッション鍵）で復号することができる。データの暗号
化と復号化は、SSL/TLSハンドシェーク・プロセスで確立された共有秘密鍵（セッション鍵）を使って行われる。これは対称鍵で
あり、暗号化と復号化の両方に使われ、ALBの公開鍵と秘密鍵を使って共有秘密鍵（セッション鍵）がクライアントに安全に交換
される。
================================================================================================
このプロセスを通じて、クライアントとサーバ間の通信はセキュアに保たれ、サーバの真正性が確保されます。ACMと証明書は、
このセキュアな接続を実現するための重要な役割を果たしています。

================================================================================================
7.1
terraform planの結果をそのまま記載
------------------------------------------------------------------------------------------------
. **order = 1` の説明:**
order` 属性は `aws_lb_listener` リソースの `default_action` ブロック内で使用され、複数のアクションが定義さ
れている場合にアクションの優先度を指定する。リスナールールを定義するとき、各ルールは複数のアクション（例えば、ターゲ
ットグループに転送する、URLにリダイレクトする、固定応答を返す）を持つことができ、`order` はこれらのアクションが評
価される順序を指定する。
- 提供された設定はリスナーのデフォルトのアクションに対するものであり、複数のアクションを持つルールではないため、
`order`属性は必要なく、適用されません。通常、`order` 属性は `aws_lb_listener` のデフォルトアクションではなく、
`aws_lb_listener_rule` リソースのコンテキストで使用される。単一のデフォルトアクションの場合、アクションは常に実
行されるので、順序は関係ない。

================================================================================================
7.2
. **type = "redirect"`:** の説明
- `default_action` ブロック内の `type` 属性は、リクエストがリスナーの条件にマッチしたときに、リスナーが取るべき
アクションのタイプを指定する。type` を `"redirect"` に設定すると、ALB は受信したリクエストを別の URL にリダイレ
クトするように設定される。
- HTTPを HTTPS にリダイレクトして、アプリケーションのセキュリティを向上させるような場合に特に有用である。

================================================================================================
7.3
リダイレクトアクションの `aws_lb_listener` リソース設定の `#{host}`、`/#{path}`、`#{query}` プレースホルダ
はコメントアウトで問題ありません。これらのプレースホルダは (ALB) がリクエストに基づいて動的にリダイレクトパスに値を
挿入するために使用します。リダイレクトアクションを設定するとき、静的な値を指定するか、これらのプレースホルダを使って
動的にリダイレクト先 URL を作成することができます
- `#{host}`はリクエストのホストヘッダに置き換えられます。
- /#{path}`はリクエストのパスに置き換えられます。先頭の `/` はパスが正しくフォーマットされていることを保証する。
- `#{query}` はリクエストのクエリー文字列に置き換えられる。
つまり、リクエストを受信すると、ALBはリクエストの実際のホスト、パス、クエリー文字列を使用して、定義したルールに従っ
てリダイレクトURLを構築します。これは特に、元のリクエストパラメータを保持したままユーザーをリダイレクトするのに便利
です。
したがって、リダイレクトアクションの意図が、元のホスト、パス、クエリパラメータを保持したまま HTTP トラフィックを
HTTPS に動的にリダイレクトすることであれば、設定は正しく、これらのプレースホルダに対して特別なことを書く必要はあり
ません。
*/