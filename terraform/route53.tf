# ---------------------------------------------
# Route53
# ---------------------------------------------

resource "aws_route53_zone" "portfolio_route53_zone_tf" {
  # arn     = "arn:aws:route53:::hostedzone/Z05743042OK49Y65Q6CSP"
  comment = "HostedZone created by Route53 Registrar"
  # id      = "Z05743042OK49Y65Q6CSP"
  name    = "horror-domo-app.com"
  # name_servers = [
  #   "ns-1265.awsdns-30.org",
  #   "ns-1565.awsdns-03.co.uk",
  #   "ns-285.awsdns-35.com",
  #   "ns-570.awsdns-07.net",
  # ]
  tags     = {}
  tags_all = {}
  # zone_id  = "Z05743042OK49Y65Q6CSP"
}

