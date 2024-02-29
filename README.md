## 作成アプリ：HorrorDomoApp

ホラー映画の感想投稿サイトです。

好きなホラー映画の感想を投稿、閲覧、検索できます。

レスポンシブ対応しているのでスマホからもご覧いただけます。

*転職用のポートフォリオと合わせて学習用の為、コードに学習用のコメントをそのまま残してあります。

## 主な使用技術
### バックエンド
- Ruby(3.1.2)
- Rails api(6.1.7)
- Devise、Devise Token Auth
- Kaminari
- ActiveStorage
- Rspec
- Rubocop
### フロントエンド
- Next.js(12.3.4)
- TypeScript
- TailwindCSS
- Axios
- React-Modal
- React-Paginate
- Testing Library
- Jest
- Lint、Prettier
## インフラ
### Docker、Docker Compose
- 開発環境、本番環境をコンテナ化
### Nginx
- Webサーバ
- RailsのPumaとUnixドメインソケット通信
### AWS
- ECS Fargate: Nextjs、Rails、Nginxのコンテナを実行
- ECR: Nextjs、Rails、Nginxのイメージを保存
- ALB: ALBをフロントエンド、バックエンドの2つに分け、各サービスのトラフィックを独立して管理。それぞれ独自ドメインを使用して別々にアクセス可能
- RDS: MySQLを使用
- S3: Active Strageの画像やTerraformの設定ファイルを保存
- Route53: 独自ドメインでアクセス
- ACM: 証明書を発行、httpsでアクセス
- CI/CD: GitHub Actions
- 開発環境：Docker、Docker Compose、VSCode、Git Hub
### Terraform
- AWSリソースをコード化して管理
### GitHubAction
CI/CDパイプライン構築
ビルド、テスト、デプロイを全自動化
- テスト
  - Rspec（単体テスト(model)、機能テスト(request)）
  - Rubocop
  - Lint
  - Testing Library
  - Jest（一部の非同期処理を含むUIコンポーネントやカスタムフックのテスト）
- デプロイ
  - Nextjs、Rails、NginxのDocker imageをビルド
  - imageにgitのコミットidをタグ付け
  - ECRへイメージをプッシュ
  - ECSのサービスアップデート、プッシュしたimageを使ってタスク定義からコンテナを作成

## デプロイ手順
GitHubのmainブランチにプッシュした際、GitHub ActionsでgitのコミットidをECRのへプッシュするimageにタグ付け。Slackへ通知後、CDフローでTerraformを使ってAWS Fargateへデプロイ。

## インフラ構成図
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/5ca90b71-66ad-4d09-b444-182b33833e92" width="80%" />

<!-- ## AWS詳細
- ECS Fargate: Nextjs、Rails、Nginxのコンテナを実行
- ECR: Nextjs、Rails、Nginxのイメージを保存
- ALB: ALBをフロントエンド、バックエンドの2つに分け、各サービスのトラフィックを独立して管理。それぞれ独自ドメインを使用して別々にアクセス可能
- RDS: MySQLを使用
- S3: Active Strageの画像やTerraformの設定ファイルを保存
- Route53: 独自ドメインでアクセス
- ACM: 証明書を発行、httpsでアクセス。 -->

## 機能詳細
- アカウント作成、ログイン、ログアウト機能（devise、devise token auth）
- ユーザー編集機能
  - Avatar登録（Active_Starage）、
- 管理ユーザーによるユーザー削除機能
- 投稿作成機能
- 投稿削除機能
- 投稿検索機能
- 投稿へのいいね機能
- ユーザーフォロー機能
- TMDB API（外部API）によるの映画情報取得機能
- モーダル表示（React-Modal）
- ページネーション機能（Kaminari）
- レスポンシブ対応（React-Paginate、TailwindCSS）

## 使用イメージ
- ホーム
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/be3ab779-07ce-4392-a4fe-b6b9ee338b08" width="80%" />

- サインイン
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/85809807-ab80-474d-a73e-9ca95d584c5f" width="80%" />

- サインアップ
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/ac0e1259-0fc2-4cc9-b9f8-638e54ad1d9b" width="80%" />

- ユーザーホーム
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/3089876c-b609-46a0-afcf-310d70910f0d" width="80%" />
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/882bd372-6d84-4699-a76a-04f058ffdcee" width="80%" />

- ユーザー編集
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/868bd984-4940-48e6-abe9-af5b1e519c16" width="80%" />

- ユーザー一覧
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/e5c75b2d-0db8-4a7f-a9c4-c5d5a3bc416e" width="80%" />

- フォロワー
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/8918bc01-3a7c-4210-80bf-3ef59a2be1e2" width="80%" />

- 投稿作成
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/d952ce76-d529-4bb0-9c8f-2011c5bcd397" width="80%" />

- 投稿詳細
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/68762c3d-a414-420a-af0c-2beea59e743b" width="80%" />

### レスポンシブに対応
- IPhone
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/26d070dd-a463-4f18-b90d-b439dfb442a4" width="40%" />

- IPad
<img src="https://github.com/a-orihara/HorrorDomoApp/assets/83584987/c059fdfa-4658-4048-bcda-aadb64dba150" width="40%" />


<!-- + <img src="{画像URL}" width="50%" />
- ![iPhone 13_2022-02-06 15:27:44 085500]({画像URL}) -->

<!--
GitHubのReadMeファイルはMarkdownで書かれています。Markdownは軽量なマークアップ言語であり、プレーンテキストフォーマット構文を備えています。
しかし、Markdown自体は構文内で直接画像のリサイズをサポートしていません。
GitHubのREADMEで画像のサイズを変更するには、HTMLの<img>タグを使います。
<path>を画像の実際のパスに置き換え、widthとheightの値を希望の寸法に調整します。MarkdownファイルでHTMLタグを使うと、GitHubはそれをHTMLとしてレンダリングします。これにより、Markdownの構文ではカバーされていないHTMLの機能を利用することができます。
画像のリサイズなどMarkdown以上の機能が必要な場合は、HTMLコード（<img>タグなど）を含めることもできます。
-->