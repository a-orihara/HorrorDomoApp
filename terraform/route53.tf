# ---------------------------------------------
# Route53 "aws_route53_zone"
# ---------------------------------------------

resource "aws_route53_zone" "portfolio_route53_zone_tf" {
  comment = "HostedZone created by Route53 Registrar"
  # ドメイン名
  # 1 var:Terraformで変数を参照するためのprefix。設定ファイル内で定義された変数を参照する為に使用
  name     = var.domain
  tags     = {}
  tags_all = {}
}

# ---------------------------------------------
# Route53 "aws_route53_record"
# ---------------------------------------------
# 1
# resource "aws_route53_record" "portfolio_route53_record_a" {
# fqdn    = "horror-domo-app.com" /いらないっぽい
# id      = "Z05743042OK49Y65Q6CSP_horror-domo-app.com_A"/いらないっぽい
# name    = "horror-domo-app.com"
# records = []
# ttl     = 0
# type    = "A"
# zone_id = aws_route53_zone.portfolio_route53_zone_tf.id
# alias {
#     evaluate_target_health = true
#     # albのidが必要
#     name                   = "portfolio-frontend-alb-1834571258.ap-northeast-1.elb.amazonaws.com"
#     # albのzon_idが必要?
#     zone_id                = "Z14GRHDCWA56QT"
# }
# }


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
Route53のレコードをインポートするためには、ホストゾーンID・レコード名・レコードタイプをアンダースコアで区切ったID
を指定する必要があります。
*/
