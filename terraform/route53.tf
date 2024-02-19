# *
# ================================================================================================
# Route53 "aws_route53_zone"
# ================================================================================================
# "aws_route53_zone"はホストゾーンのこと
resource "aws_route53_zone" "route53_zone" {
  # 参照用。特にterraformのログには出ない。
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
# 1 フロント用のalbのAレコード（ALBのDNSに対して独自ドメインの付与）のリソース。Aレコードの解説は下記。
resource "aws_route53_record" "route53_record_a" {
  # Route 53レコードの名前（DNSレコードに対応する完全修飾ドメイン名（FQDN））を指定
  name = var.domain
  # 1.0 DNSレコードのタイプを指定。Aレコード:ドメイン名をIPv4アドレスにマッピングするために使用
  type = "A"
  # レコードが属するRoute 53 ホストゾーンのIDを指定。resource "aws_route53_zone"のidを指定
  zone_id = aws_route53_zone.route53_zone.id
  # 1.1
  alias {
    # 1.2 ヘルスチェックをするかどうか
    evaluate_target_health = true
    # 1.3 エイリアスターゲットのDNS名を指定。resource "aws_lb"で作成したalbのdns_nameを指定
    name = aws_lb.frontend_alb.dns_name
    #  エイリアスターゲットのホストゾーンのIDを指定。resource "aws_lb"で作成したalbのzone_idを指定
    zone_id = aws_lb.frontend_alb.zone_id
  }
}
# ------------------------------------------------------------------------------------------------
# NSレコードは自分で設定していない。勝手に作成されていた。なのでterraformでも管理している
resource "aws_route53_record" "route53_record_ns" {
  name = var.domain
  # 2.1
  records = [
    "ns-1265.awsdns-30.org.",
    "ns-1565.awsdns-03.co.uk.",
    "ns-285.awsdns-35.com.",
    "ns-570.awsdns-07.net.",
  ]
  # 2.2
  ttl = 172800
  # 2.3 ドメイン情報が別DNSサーバーに登録されている時、その別DNSサーバーの情報を登録します。
  type = "NS"
  # レコードが関連付けられるRoute 53のホストゾーンのIDを指定
  zone_id = aws_route53_zone.route53_zone.id
}

# ------------------------------------------------------------------------------------------------
resource "aws_route53_record" "route53_record_soa" {
  name = var.domain
  # 3.1
  records = [
    "ns-285.awsdns-35.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400",
  ]
  # 3.2
  ttl = 900
  # 3.3
  type    = "SOA"
  zone_id = aws_route53_zone.route53_zone.id
}
# ------------------------------------------------------------------------------------------------
# バックエンド用のalbへのAレコード
resource "aws_route53_record" "route53_record_backend_a" {
  name    = "backend.horror-domo-app.com"
  type    = "A"
  zone_id = aws_route53_zone.route53_zone.id
  alias {
    evaluate_target_health = true
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
  }
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Route53のレコードをインポートするためには、ホストゾーンID・レコード名・レコードタイプをアンダースコアで区切ったID
を指定する必要があります。
------------------------------------------------------------------------------------------------
実際の例：
terraform import aws_route53_record.route53_record_a Z05743042OK49Y65Q6CSP_horror-domo-app.com_A

================================================================================================
1.0
ALBのDNSに対して独自ドメインの付与
- ALBのDNSとは、AWSのALBが提供する一意のDNS名のことです。これは、ALBを作成した時に自動的にALBに割り当てられる。
- DNSサービスはAWSのRoute 53が提供していますが、ALBに割り当てられたDNS名はRoute 53で管理することができます。
- つまり、独自ドメインを使用する場合は、Route 53でDNSのAレコードを設定し、その独自ドメインがALBのDNS名に解決する
ようにします。これにより、ユーザーは独自ドメインを通じてALBにアクセスできるようになります。
------------------------------------------------------------------------------------------------
. **Aレコードとは？**
- Aレコード（Address Record）は、DNSの基本的なタイプの一つで、ドメイン名をIPv4アドレスにマッピングするために使
用されます。これにより、ドメイン名（例：www.example.com）をブラウザに入力すると、Aレコードがそのドメイン名を対応
するサーバーのIPv4アドレス（例：192.0.2.1）、この場合ALBのIPアドレスに変換し、ユーザーを正しいサーバーに導きます。

================================================================================================
1.1
alias ブロックは、Route 53 エイリアスレコードを設定するために使用されます。エイリアスレコードは、AWSリソース（例
：ELB、CloudFrontディストリビューション、S3バケットなど）へのポインタとして機能します。

================================================================================================
1.2
evaluate_target_health: このフィールドは、エイリアスターゲットのヘルスチェックを評価するかどうかを指定します。
true の場合、ターゲットのヘルスチェックが考慮され、ターゲットが不健康と判断された場合、トラフィックはそのターゲット
にルーティングされません。

================================================================================================
1.3
- 特にfrontend_alb.dns_nameは自分で設定していない。AWSのアプリケーションロードバランサ(ALB)の`dns_name`は、
通常Terraformの設定で自分で設定するものではありません。代わりに、ALB の作成時に AWS によって自動的に生成され、作
成されたリソースの属性として提供されます。

================================================================================================
2.1
records: このリストはDNSレコードの値を含んでいます。ここでは、NS（ネームサーバー）レコードの値が設定されており、
ドメイン名 horror-domo-app.com のネームサーバーのアドレスを指定しています。これらのアドレスは、ドメインのDNSク
エリに対して応答するサーバーを示しています。
------------------------------------------------------------------------------------------------
このコードブロック内の`ns-1265.awsdns-30.org.`, `ns-1565.awsdns-03.co.uk.`, `ns-285.awsdns-35.com.`,
`ns-570.awsdns-07.net.`は、AWS Route 53で管理されるドメイン`horror-domo-app.com`のネームサーバー（NS）レ
コードです。これらの値は、以下の目的で使用されます：
- **ドメインのネームサーバー指定**: これらは、`horror-domo-app.com`ドメインに対するDNSクエリを処理するネーム
サーバーを指定しています。つまり、このドメインのDNS情報（例えば、どのIPアドレスにドメインがマッピングされているか）
を管理しているサーバーのアドレスです。
- **DNSのデリゲーション**: ドメイン名の所有者は、これらのNSレコードを使用して、そのドメインのDNS情報の管理をこれ
らの特定のネームサーバーに委任（デリゲーション）しています。この委任により、ドメイン名に関するDNSクエリはこれらのサ
ーバーによって処理されます。*デリゲーションは下記を参照
- **重要なDNS設定**: これらのNSレコードは、インターネット上で`horror-domo-app.com`ドメインが正しく機能するた
めに必要な設定です。ドメインのDNS情報がこれらのネームサーバーに委任されているため、ドメインの管理者はこれらのサーバ
ーを通じてDNS設定を行う必要があります。
------------------------------------------------------------------------------------------------
「ネームサーバーに委任（デリゲーション）」とは、あるドメインのDNS管理を特定のネームサーバーに託すことを意味します。
このプロセスは、DNSシステムの基本的な部分で、以下のように機能します：
. **ドメイン管理の委任**: ドメインの所有者（または管理者）は、そのドメインに関連するDNS情報（どのIPアドレスにドメ
インがマッピングされているか、メールサーバーはどこかなど）の管理を特定のネームサーバーに委ねます。
. **NSレコードの利用**: この委任は、NSレコードを使って実施されます。NSレコードには、そのドメインを管理するネーム
サーバーのアドレスが含まれています。
. **DNSクエリのルーティング**: どこかのユーザーがそのドメインに関するDNSクエリ（例えば、`www.example.com`のIP
アドレスを問い合わせる）を発行したとき、このクエリはまずグローバルなDNSシステムによって該当するドメインのNSレコード
に指定されたネームサーバーにルーティングされます。
. **ネームサーバーの応答**: 委任されたネームサーバーは、このクエリに対して適切な情報（この場合は`www.example.com`
のIPアドレス）で応答します。
------------------------------------------------------------------------------------------------
### 具体例
- ドメイン: `horror-domo-app.com`
- NSレコード:
  - `ns-1265.awsdns-30.org.`
  - `ns-1565.awsdns-03.co.uk.`
  - `ns-285.awsdns-35.com.`
  - `ns-570.awsdns-07.net.`
これらのNSレコードは、`horror-domo-app.com`ドメインのDNS情報を管理するネームサーバーを指定しています。したがっ
て、このドメインに関するあらゆるDNSクエリは、これらのネームサーバーによって処理されることになります。
このようなデリゲーションにより、ドメインの所有者はDNS管理の複雑さを減らし、ドメイン名の効率的な運用を実現できます。
また、DNSデリゲーションは、大規模なウェブサイトや複数のサービスを持つドメインで特に有用です。

================================================================================================
2.2
ttl（Time To Live）: この値は、DNSレコードがキャッシュされる時間（秒単位）を指定します。ここでは 172800 秒（4
8時間）に設定されており、これはDNSリゾルバがこのレコードをキャッシュしておく最大時間を示しています。
------------------------------------------------------------------------------------------------
. DNSリゾルバ（DNS Resolver）は、DNS（Domain Name System）サービスの一種。
- ユーザーの要求に応じて、ドメイン名をIPアドレスに解決する: ユーザーがウェブブラウザでドメイン名を入力すると、DNS
リゾルバはそのドメイン名を関連するIPアドレスに変換し、ユーザーが正しいサーバーにアクセスできるようにします。
- DNSキャッシュを管理: DNSリゾルバは、解決したドメイン名と対応するIPアドレスの情報を一時的にキャッシュに保存しま
す。これにより、同じドメイン名に対する複数の要求があった場合でも、再度DNSサーバーに問い合わせずに高速な応答が可能と
なります。
- 上位のDNSサーバーへの問い合わせ: DNSリゾルバは、必要な情報を持っていない場合に、上位のDNSサーバーに問い合わせて
ドメイン名を解決します。必要な情報がキャッシュに存在しない場合、上位のDNSサーバーから情報を取得します。

================================================================================================
2.3
作成したパブリックホストゾーン（インターネット上で公開し、誰でもアクセス可能な状態にすること）ごとに、
Amazon Route 53 はネームサーバー (NS) レコードと Start of Authority(SOA) レコードを自動的に作成します。こ
れらのレコードを変更する必要はほとんどありません。
------------------------------------------------------------------------------------------------
. **NSレコードとは？**
- NSレコードは、あるドメインに対するDNS情報を管理しているネームサーバー（Name Server）を指定するために使用される
DNSレコードの一種です。DNSシステムでは、このレコードを使用して、どのサーバーが特定のドメインに関するDNSクエリに応
答するかを決定します。
### なぜNSレコードが重要か
- **DNSデリゲーション**: ドメインの所有者は、NSレコードを使用して、そのドメインのDNS情報の管理を特定のネームサー
バーに委任（デリゲート）できます。これにより、ドメインの管理を分散し、効率的に行うことができます。
- **ドメインの柔軟な管理**: NSレコードを使うことで、ドメインの所有者は異なるネームサーバーを使用して、サブドメイ
ンや特定のサービスのDNS情報を管理することができます。これにより、複数のサービスプロバイダーや異なる地理的場所にサ
ーバーを配置する際の柔軟性が高まります。

================================================================================================
3.1
- `records`: SOAレコードの具体的な情報。この例では、`ns-285.awsdns-35.com.`がプライマリネームサーバー、
`awsdns-hostmaster.amazon.com.`がゾーンの責任者を指し、その後の数値はシリアルナンバー、リフレッシュレート、リ
トライレート、エクスパイアレート、ネガティブキャッシュTTLを表しています。

================================================================================================
3.2
- `ttl`: このSOAレコードの有効時間（生存時間）を秒で指定。ここでは900秒（15分）に設定されています。

================================================================================================
3.3
ゾーンの起点を示し、ゾーンの管理情報を定義するレコード
------------------------------------------------------------------------------------------------
SOAレコード（Start of Authority Record）は、DNS（ドメインネームシステム）の中で非常に重要な役割を果たすレコー
ドの一つです。それぞれのDNSゾーンの最上位に位置し、そのゾーンの基本情報を提供します。具体的な内容としては以下の要素
が含まれます：
-. **プライマリネームサーバー**: そのDNSゾーンを管理する主要なネームサーバー。
-. **責任者（Responsible Person）**: そのゾーンの管理に責任を持つ人の連絡先（通常はメールアドレス）。
-. **シリアルナンバー**: ゾーンファイルのバージョンを示す数値。この値は、ゾーンファイルが更新されるたびに増加。
-. **リフレッシュレート**: ゾーンのセカンダリ（補助）ネームサーバーがプライマリネームサーバーに問い合わせる頻度。
-. **リトライレート**: セカンダリネームサーバーがプライマリネームサーバーへの接続に失敗した後に再試行するまでの時間。
-. **エクスパイアレート**: セカンダリネームサーバーがプライマリネームサーバーからの応答を受け取れない場合、その情報
を無効とするまでの時間。
-. **ネガティブキャッシュTTL**: ネガティブ応答（例: レコードが存在しない）をキャッシュする時間。
------------------------------------------------------------------------------------------------
### 具体例
あなたのコードで提供された例では、以下のようなSOAレコードが設定されています：
- `name`: この部分はドメイン名を指定します。ここでは`var.domain`という変数が使われています。
- `records`: SOAレコードの具体的な情報。この例では、`ns-285.awsdns-35.com.`がプライマリネームサーバー、
`awsdns-hostmaster.amazon.com.`がゾーンの責任者を指し、その後の数値はシリアルナンバー、リフレッシュレート、リ
トライレート、エクスパイアレート、ネガティブキャッシュTTLを表しています。
- `ttl`: このSOAレコードの有効時間（生存時間）を秒で指定。ここでは900秒（15分）に設定されています。

@          @@          @@          @@          @@          @@          @@          @@          @
*
================================================================================================
NS、SOAレコードはパブリックホスとゾーンでドメイン取得でAWSにて自動作成、CNAMEレコードはACMのDNS検証で作成、Aレコ
ードはALBへの独自ドメイン付与（AWSのALBと独自のドメイン名の関連付け。アプリのトラフィックをALBを介してルーティン
グできるようにする）で作成。
- CNAMEレコードは`acm.tf`にて作成。
================================================================================================
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
