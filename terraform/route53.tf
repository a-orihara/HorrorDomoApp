# ---------------------------------------------
# Route53
# ---------------------------------------------

resource "aws_route53_zone" "portfolio_route53_zone_tf" {
  comment = "HostedZone created by Route53 Registrar"
  # ドメイン名
  # 1 var:Terraformで変数を参照するためのprefix。設定ファイル内で定義された変数を参照する為に使用
  name     = var.domain
  tags     = {}
  tags_all = {}
}

