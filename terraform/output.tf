# 1.1 1.2
output "route53_record_for_each_result" {
  value = { for dvo in aws_acm_certificate.acm_cert.domain_validation_options : dvo.domain_name => {
    name   = dvo.resource_record_name
    record = dvo.resource_record_value
    type   = dvo.resource_record_type
  } }
}

output "ecs_task_definition_rails_image_val" {
  value = aws_ecr_repository.rails_img_prod.repository_url
}
output "ecs_task_definition_nginx_image_val" {
  value = aws_ecr_repository.nginx_img_prod.repository_url
}
output "ecs_task_definition_nextjs_image_val" {
  value = aws_ecr_repository.nextjs_img_prod.repository_url
}


/*
@          @@          @@          @@          @@          @@          @@          @@          @
1.1
### 解説:`output`ブロック
- `output`ブロックは、Terraformの設定ファイル内で定義され、通常はTerraformの実行結果として表示される値を定義し
ます。ブロックの名前は任意に選べます。名前にはピリオド（.）は使えません。
- `value`キーワードの後には、実際の出力値の定義が続きます。
- terraform planでは表示されない。`terraform plan` はリソースに加えられる変更を表示しますが、`output` 値は
`terraform apply` で変更が適用された後に計算されて表示されます。出力される値を見たい場合は、まず設定を適用してか
ら `terraform output` を実行してください。
------------------------------------------------------------------------------------------------
### 具体的な利用シーン:
- `output`ブロックを使用して、Terraformがデプロイしたインフラの状態情報を表示できます。例えば、EC2インスタンス
のパブリックIPアドレスやサブネットのIDなどの情報を表示できます。
- `output`ブロックを使用して、デプロイ後の設定情報を共有できます。例えば、データベースのエンドポイント、APIのエン
ドポイント、アクセスキーなどの情報を共有できます。デプロイ後の設定情報を他の開発者やシステムと共有し、連携やデバッグ
を行うために使用します。

================================================================================================
1.2
. **`output`の追加と`terraform apply`の関係**:
- Terraformで`output`ブロックを追加または変更した場合、その変更が実際に反映されるためには`terraform apply`を
実行する必要があります。`apply`は、設定の変更を適用し、新しい状態をTerraformの状態ファイルに保存します。
------------------------------------------------------------------------------------------------
. **`terraform output`が値を出力できる理由**:
- `terraform output`コマンドは、Terraformの状態ファイル（`.tfstate`）に保存されているデータに基づいて出力値
を表示します。したがって、`terraform apply`が実行された後に状態ファイルが更新されると、新しい`output`値もその状
態ファイルに保存されます。そのため、`apply`実行後に`output`コマンドを使うと、新しい出力値を確認できるのです。
------------------------------------------------------------------------------------------------
. **`terraform output`の挙動と`terraform apply`との関連**:
- `terraform apply`が実行される前は、以前の状態ファイルに基づいた値（または新しい`output`がまだなければ何も表
示されない）が表示されます。
------------------------------------------------------------------------------------------------
要するに、`terraform output`は常に現在の状態ファイルに基づいて情報を表示するため、`output`の変更を反映するには
先に`terraform apply`を実行して状態ファイルを更新する必要があります。
*/