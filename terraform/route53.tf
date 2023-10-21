# ---------------------------------------------
# Route53
# ---------------------------------------------

resource "aws_route53_zone" "portfolio_route53_zone_tf" {
  comment = "HostedZone created by Route53 Registrar"
  # ドメイン名
  name    = "horror-domo-app.com"
  tags     = {}
  tags_all = {}
}

