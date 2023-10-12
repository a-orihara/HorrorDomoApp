// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
/*
@          @@          @@          @@          @@          @@          @@          @@          @
Next.js API Routes の概要
------------------------------------------------------------------------------------------------
- Next.js はフロントエンドフレームワークとして API にアクセスを行い情報を取得するだけではなくフロントエンドから
アクセス可能な API を作成することができます。
------------------------------------------------------------------------------------------------
- Next.js では pages フォルダの中に JavaScript ファイルを作成するとルーティング自動で設定されるように、
API Routes では pages/api フォルダの下に JavaScript ファイルを作成するとエンドポイントとしてルーティングが追
加されます。
- 例えば、api フォルダの hello.js ファイルは API エンドポイント/api/hello で外部からアクセスすることが可能と
なります。ブラウザから localhost:3000/api/hello にアクセスすると JSON データとして戻されることが確認できます。
------------------------------------------------------------------------------------------------
- API Routes は Next.js に内蔵された機能で、pages/api ディレクトリに配置されたJavaScript ファイルを通して
サーバーサイドAPIを提供します。
- Next.js では、pages/api ディレクトリ内にファイルを作成することで、API ルートを簡単に作成できます。
これらのAPI ルートは、Node.js サーバー上で動作するサーバーサイド関数として扱われます。
- API ルートは、データベースへのクエリ、認証、または他のバックエンド処理など、サーバーサイドのロジックを簡単に扱う
ために使用されます。この機能は Next.js の一部として組み込まれており、特別な設定やサーバーの立ち上げが不要です。
------------------------------------------------------------------------------------------------
pages/apiフォルダ内にあるすべてのファイルは /api/* にマッピングされ、pageの代わりに API エンドポイントとして扱
われます。API ルートを使用しても、クライアントサイドのバンドルサイズが大きくなることはありません。これらはサーバー
サイドのみのバンドルです。

API Routes では作成した関数は必ず export する必要があります。
*/