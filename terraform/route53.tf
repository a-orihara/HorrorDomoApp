# *
# ================================================================================================
# Route53 "aws_route53_zone"
# ================================================================================================
resource "aws_route53_zone" "route53_zone" {
  comment = "HostedZone created by Route53 Registrar"
  # ドメイン名
  # 1 var:Terraformで変数を参照するためのprefix。設定ファイル内で定義された変数を参照する為に使用
  name     = var.domain
  tags     = {}
  tags_all = {}
}

# ================================================================================================
# Route53 "aws_route53_record"
# ================================================================================================
# 1
resource "aws_route53_record" "route53_record_a" {
  # fqdn                             = "horror-domo-app.com"
  # id                               = "Z05743042OK49Y65Q6CSP_horror-domo-app.com_A"
  # multivalue_answer_routing_policy = false
  name                             = "horror-domo-app.com"
  # records                          = []
  # ttl                              = 0
  type                             = "A"
  zone_id                          = "Z05743042OK49Y65Q6CSP"

  alias {
      evaluate_target_health = true
      name                   = "dualstack.portfolio-frontend-alb-1834571258.ap-northeast-1.elb.amazonaws.com"
      zone_id                = "Z14GRHDCWA56QT"
  }
}

resource "aws_route53_record" "route53_record_a" {}

# ------------------------------------------------------------------------------------------------


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Route53のレコードをインポートするためには、ホストゾーンID・レコード名・レコードタイプをアンダースコアで区切ったID
を指定する必要があります。
------------------------------------------------------------------------------------------------
実際の例：
terraform import aws_route53_record.route53_record_a Z05743042OK49Y65Q6CSP_horror-domo-app.com_A
@          @@          @@          @@          @@          @@          @@          @@          @
*
リクエストの流れ
=======================================================================
以下は、AWSでドメインを取得し、ACMで証明書を発行し、ALBを使用してFargateのタスクにリクエストを転送する一般的なアクセスフローの具体例です：
————————————————————————————————————————————————
注意点：ACMで証明するドメインは、通常のドメインと実際にブラウザで入力するドメインを登録する点です。
完全修飾ドメイン名
ドメイン名
*.ドメイン名
*はワイルドカードです。こちらの設定により、サブドメイン（ www.ドメイン名 など ）全てを含めてSSL申請ができます。
ブラウザで入力するアドレスには、ロードバランサーの名前が使われるので、www.horror-domo-app.comが証明するドメインになります。そのため、ドメイン名の入力欄に*.ドメイン名を指定しています。
=======================================================================
1. **ドメインの取得**:
- ドメイン名を取得します。例えば、`example.com` というドメイン名を取得します。
=======================================================================
2. **DNS設定**:
- Route 53を使用して、取得したドメイン名（`example.com`）のDNS設定を構成します。
- 具体的な設定: Route 53 ホストゾーン内で、AレコードまたはCNAMEレコードを設定し、ALBのDNS名（例: `my-alb-1234567890.us-east-1.elb.amazonaws.com`）に対するドメイン名（`example.com`）のエイリアスを設定します。
------------------------------------------------------------------------------------------------
- クライアントがドメイン名でアクセスすると、まずそのリクエストはRoute 53に向かいます。Route 53はドメイン名を解決して対応するIPアドレス（この場合はALBのIPアドレス）をクライアントに返します。
- Route 53はDNSサーバーというより、正確にはAWSが提供する高度にスケーラブルなDNS（Domain Name System）ウェブサービスです。ドメイン名をIPアドレスに変換する役割を果たします。また、逆にIPアドレスからドメイン名に変換する逆引きも可能です。その他、 ロードバランシング、ヘルスチェック、ドメイン名の登録等、多くの追加機能も提供しています。
=======================================================================
3. **SSL/TLS証明書の取得**:
- AWS Certificate Manager (ACM)を使用して、`example.com` というドメイン名に対するSSL/TLS証明書を発行します。
------------------------------------------------------------------------------------------------
- **初期接続時**: クライアントが最初にドメイン名（Route 53によって管理されている）にアクセスすると、そのリクエストはRoute 53を経た後、Application Load Balancer (ALB)にルーティングされます。
- **ALBによるリダイレクト**: ALBは、クライアントがHTTPSを使用しているか確認します。HTTPを使用している場合、HTTPS（セキュアな接続）にリダイレクトされることが一般的です。
- **SSL/TLS ハンドシェイク**: HTTPSが使われる場合、ALBとクライアント間でSSL/TLSハンドシェイクが行われます。このタイミングでACMによって発行された証明書が使われる。
- **証明書の検証**: クライアントはACMによって発行された公開鍵を用いてサーバ（ALB）の証明書の正当性を確認します。
- **データの暗号化と送信**: ハンドシェイクが成功すれば、暗号化されたデータが安全にクライアントとサーバ間でやり取りされます。
------------------------------------------------------------------------------------------------
- **初期リクエストの作成**: クライアントがウェブブラウザで`https://example.com`のようなURL（ドメイン名）にアクセスした瞬間、HTTPSでのリクエストがまず生成されます。
- **Route 53とのやり取り**: このHTTPSリクエストは最初にDNSサービス（この場合はRoute 53）に向かい、ドメイン名がどのIPアドレスに対応しているかを解決します。
- **ALBへのルーティング**: DNS解決後、リクエストは対象のIPアドレス（ここではALB）にルーティングされます。
- **SSL/TLSハンドシェイク**: ALBがリクエストを受け取ると、SSL/TLSハンドシェイクが行われ、セキュアな接続が確立されます。
- **データの転送**: ハンドシェイクが成功した後、クライアントからのHTTPSリクエストが安全にALBへと転送されます。そしてALBはそのリクエストを背後のFargateタスクにHTTPで渡します。
このように、クライアントが一番初めにHTTPSでリクエストを暗号化するのは、ウェブブラウザでURLにアクセスした直後です。
------------------------------------------------------------------------------------------------
. **秘密鍵の役割**:
- 秘密鍵はサーバー（ここではALB）に保存されています。
- サーバーはこの秘密鍵を用いて、クライアントから受け取ったデータの復号化や、自身からクライアントへ送るデータの署名に使用します。
    - このプロセスは、サーバーが公開鍵で暗号化された情報を正確に復号できるという点で、サーバーの正当性を証明します。
. **公開鍵での暗号化と正当性の確認**:
- クライアントはACMによって発行された公開鍵を用いて、一連のハンドシェイクメッセージを暗号化します。
- この暗号化されたメッセージは、サーバーに送られ、サーバーは秘密鍵を用いてそれを復号します。
- サーバーがこのメッセージを正確に復号できた場合、それはサーバーが正当な秘密鍵を持っている証拠となります。このようにしてサーバーの正当性が確認されるのです。
このように、公開鍵と秘密鍵がペアとなって、安全な通信とサーバーの正当性の確認が行われます。
------------------------------------------------------------------------------------------------
SSL/TLS ハンドシェイクで証明書を使用する際の通信の流れ
- クライアントがサーバー（ALB）に接続を試み、SSL/TLS ハンドシェイクを開始します。
- ALBはACMから取得したSSL/TLS証明書をクライアントに送信します。この証明書にはサーバーの公開鍵が含まれています。
- クライアントは証明書の情報（特に公開鍵）を使用して、サーバーの正当性を確認します。クライアントはまた、新しいセッ
ション鍵を生成し、サーバーの公開鍵を使用してこの鍵を暗号化します。
- クライアントは暗号化されたセッション鍵をサーバーに送信します。
- ALBは自身の秘密鍵を使用してセッション鍵を復号化し、以後の通信でこの鍵を使用してデータを暗号化および復号化します。
================================================================================================
. **レコードの集合体**:
- DNSは、ドメイン名とIPアドレスの対応を記録するためにDNSレコードの集合を使用します。各DNSレコードには特定の情報が
含まれており、異なるタイプのレコードがさまざまな目的で使用されます。
- 一般的なDNSレコードのタイプには、Aレコード（IPv4アドレスに対応付ける）、AAAAレコード（IPv6アドレスに対応付ける
）、CNAMEレコード（別名の指定）、MXレコード（メールサーバーの指定）、TXTレコード（テキスト情報の格納）、NSレコー
ド（ネームサーバーの指定）などがあります。
- ドメイン名からIPアドレスへの変換は、対応するAレコードやAAAAレコードを検索し、その結果を使用して行われます。

*/
