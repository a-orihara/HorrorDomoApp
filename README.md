## Horror Domo App（*README作成中）
ホラー映画の感想投稿サイトです。

好きなホラー映画の感想を投稿、閲覧、検索できます。

レスポンシブ対応しているのでスマホからもご覧いただけます。

## 使用技術
- バックエンド：Rails(api)、Devise、Devise Token Auth、Kaminari、ActiveStorage、Rspec、Rubocop
- フロントエンド：Next.js、TypeScript、TailwindCSS、Axios、React-Modal、React-Paginate、Testing Library、Jest、ESLint、Prettier
- インフラ：AWS（VPC、ECS(Fargate)、ECR、ALB、RDS、Route53、ACM、S3）、Nginx、Terraform
- CI/CD: GitHub Actions
- 開発環境：Docker、Docker Compose、VSCode、Git Hub

## デプロイ手順
GitHubのmainブランチにプッシュした際、GitHubActionsでgitのコミットidをECRのへプッシュするimageにタグ付け。その後、CDフローでterraformを使ってAWS Fargateへデプロイ。

![AWS構成図 drawio](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/5ca90b71-66ad-4d09-b444-182b33833e92)

## ホーム
![ホームページ](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/be3ab779-07ce-4392-a4fe-b6b9ee338b08)

##サインイン
![サインイン](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/85809807-ab80-474d-a73e-9ca95d584c5f)

##サインアップ
![サインアップ](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/ac0e1259-0fc2-4cc9-b9f8-638e54ad1d9b)

##ユーザーホームページ
![ユーザーホーム](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/3089876c-b609-46a0-afcf-310d70910f0d)
![ページネーション](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/882bd372-6d84-4699-a76a-04f058ffdcee)

##ユーザー編集
![ユーザー編集](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/868bd984-4940-48e6-abe9-af5b1e519c16)



##　レスポンシブに対応
### Iphone
![レスポンシブ_iphone](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/50a444d7-d2cd-4384-b0b6-76ffb04b937c)
### Ipad
![レスポンシブ_Ipad](https://github.com/a-orihara/HorrorDomoApp/assets/83584987/3127bda5-577e-417c-beb1-165f42bed136)



