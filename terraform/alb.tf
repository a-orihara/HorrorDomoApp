# ---------------------------------------------
# alb
# ---------------------------------------------
# 1
resource "aws_lb" "portfolio_alb_tf" {
  desync_mitigation_mode = "defensive"
  # dns_name                         = "portfolio-alb-741782418.ap-northeast-1.elb.amazonaws.com"
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
    aws_security_group.portfolio_alb_sg_tf.id,
  ]
  subnets = [
    aws_subnet.portfolio_pub_subnet_a_tf.id,
    aws_subnet.portfolio_pub_subnet_c_tf.id,
  ]
  tags     = {}
  tags_all = {}
  # このコンフィギュレーションを適用した結果に基づいて自動的に決定されます。
  # vpc_id   = aws_vpc.portfolio_vpc_tf.id
  # zone_id  = "Z14GRHDCWA56QT"
  # access_logs {
  #     enabled = false
  # }
  subnet_mapping {
    subnet_id = aws_subnet.portfolio_pub_subnet_a_tf.id
  }
  subnet_mapping {
    subnet_id = aws_subnet.portfolio_pub_subnet_c_tf.id
  }
  timeouts {}
}

# ---------------------------------------------
# alb_listener
# ---------------------------------------------
# 2
resource "aws_lb_listener" "portfolio_alb_listener_http" {
  load_balancer_arn = aws_lb.portfolio_alb_tf.arn
  port              = 80
  protocol          = "HTTP"
  tags              = {}
  tags_all          = {}
  default_action {
    # エラーになるので一旦コメントアウト
    # order            = 0
    target_group_arn = aws_lb_target_group.portfolio_alb_tg_tf.arn
    type             = "forward"
  }
  timeouts {}
}

resource "aws_lb_listener" "portfolio_alb_listener_https" {
  load_balancer_arn = aws_lb.portfolio_alb_tf.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = "arn:aws:acm:ap-northeast-1:283956208428:certificate/218fb7a9-efb2-4a7a-a18d-1748db66fa8c"
  tags              = {}
  tags_all          = {}
  default_action {
    # order            = 0
    target_group_arn = aws_lb_target_group.portfolio_alb_tg_tf.arn
    type             = "forward"
  }
  timeouts {}
}

# ---------------------------------------------
# frontend_alb
# ---------------------------------------------
resource "aws_lb" "portfolio_frontend_alb_tf" {
  desync_mitigation_mode = "defensive"
  # dns_name                         = "portfolio-frontend-alb-1834571258.ap-northeast-1.elb.amazonaws.com"
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
    aws_security_group.portfolio_alb_frontend_sg_tf.id,
  ]
  subnets = [
    aws_subnet.portfolio_pub_subnet_a_tf.id,
    aws_subnet.portfolio_pub_subnet_c_tf.id,
  ]
  tags     = {}
  tags_all = {}
  # vpc_id                           = "vpc-0fd0788c8a372ee22"
  # zone_id                          = "Z14GRHDCWA56QT"
  # access_logs {
  #     enabled = false
  # }
  subnet_mapping {
    subnet_id = aws_subnet.portfolio_pub_subnet_a_tf.id
  }
  subnet_mapping {
    subnet_id = aws_subnet.portfolio_pub_subnet_c_tf.id
  }
  timeouts {}
}

# ---------------------------------------------
# frontend_alb_listener
# ---------------------------------------------
resource "aws_lb_listener" "portfolio_frontend_alb_listener_http" {
  load_balancer_arn = aws_lb.portfolio_frontend_alb_tf.id
  port              = 80
  protocol          = "HTTP"
  tags              = {}
  tags_all          = {}
  default_action {
    # order            = 0
    target_group_arn = aws_lb_target_group.portfolio_frontend_alb_tg_tf.arn
    type             = "forward"
  }
  timeouts {}
}

# albにhttpsのlistenerを設定することが、ざっくり言うとacm証明書をalbに取り付けている。
resource "aws_lb_listener" "portfolio_frontend_alb_listener_https" {
  load_balancer_arn = aws_lb.portfolio_frontend_alb_tf.id
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = "arn:aws:acm:ap-northeast-1:283956208428:certificate/218fb7a9-efb2-4a7a-a18d-1748db66fa8c"
  tags              = {}
  tags_all          = {}
  default_action {
    # order            = 0
    target_group_arn = aws_lb_target_group.portfolio_frontend_alb_tg_tf.arn
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
AWSのALBを使用している場合、特定のリスナーをHTTPSで設定し、ACMからのSSL/TLS証明書を関連付けることができます。HTTPSリスナーが設定されていれば、そのドメインに対するアクセスはHTTPSを使用します。
================================================================================================
2. **HTTPSとACMの関連**:
- クライアントはHTTPSを通じてドメインに接続しようとします。HTTPSは、通信内容の暗号化やデータの完全性、そしてサー
バの真正性を確認するためのセキュアなHTTPプロトコルです。
- ACMは、SSL/TLS証明書を提供、管理するサービスです。この証明書は、HTTPS接続の際にサーバの真正性を確認するために
使用されます。
------------------------------------------------------------------------------------------------
ALB (Application Load Balancer) の設定:
httpかhttpsかの設定はLBに対して行う。
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
クライアントはこの公開鍵を使って、通信の際に使用する共通鍵（セッションキー）を暗号化してサーバに送り返します。
サーバは自身の秘密鍵を使ってこれを復号し、両者はこの共通鍵を使って通信を暗号化します。
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
- クライアントはHTTPSでレスポンスを受信します。このレスポンスは、ALBによって再びHTTPSで暗号化されています。
================================================================================================
このプロセスを通じて、クライアントとサーバ間の通信はセキュアに保たれ、サーバの真正性が確保されます。ACMと証明書は、
このセキュアな接続を実現するための重要な役割を果たしています。
*/