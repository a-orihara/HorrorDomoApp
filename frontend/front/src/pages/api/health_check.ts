// 1
import type { NextApiRequest, NextApiResponse } from 'next'

// 2
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 3
  res.statusCode = 200
  // 4
  res.setHeader('Content-Type', 'application/json')
  // 5
  res.end(JSON.stringify({ status: 'frontendからbackendへのhealthCheck:ok' }))
}

/*
@          @@          @@          @@          @@          @@          @@          @@          @
================================================================================================
1
Next.js API Routes の概要
------------------------------------------------------------------------------------------------
- 目的
Next.jsのAPI Routes機能を用いたヘルスチェック用APIを実装する主な目的は、外部からNext.jsで作成されたアプリケー
ションが適切に起動しているかどうかを確認することです。このヘルスチェックAPIは、アプリケーションの状態を監視し、本番
環境での疎通確認を行うために利用されます。
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
------------------------------------------------------------------------------------------------
. NextApiRequest
- この型は、HTTPリクエストに関する情報とメソッドを含んだNext.js独自のリクエストオブジェクトです。
- `req.body`, `req.query`, `req.cookies` など、リクエストに関する様々なプロパティがこの型で利用可能です。
------------------------------------------------------------------------------------------------
. NextApiResponse
- この型は、HTTPレスポンスに関する情報とメソッドを含んだNext.js独自のレスポンスオブジェクトです。
- `.statusCode`, `.setHeader`, `.end` など、レスポンスを制御するためのメソッドとプロパティがあります。

================================================================================================
2
関数名は任意。
------------------------------------------------------------------------------------------------
. この関数はレスポンスとしてHTTPステータスコード200を返し、`Content-Type`を`application/json`に設定し、
JSON形式のデータ`{ status: 'frontendからbackendへのhealthCheck:ok' }`を返すよう設定している。
. `/api/health_check`にアクセスすると、Next.jsのAPIルーティングによりこの関数が発火する。Next.jsでは
`pages/api`ディレクトリ内のファイルがAPIルートとして扱われ、ファイル名がURLのパスに対応する。この場合、
`health_check.ts`が`/api/health_check`のエンドポイントであるため、そこにアクセスすると`handler`関数が実行
される。
------------------------------------------------------------------------------------------------
API Routes では作成した関数は必ず export する必要があります。
handler 関数では引数に req(Request の略), res(Response の略)が入り json で”John Doe”を JSON で戻してい
ることがわかります。status メソッドで HTTP ステータスコードの 200 を設定しています。

================================================================================================
3
. res.statusCode
- HTTPステータスコードを設定するプロパティです。この例では、ステータスコード `200` が設定されています。
- `200` は "OK" を意味し、リクエストが正常に処理されたことを示します。

================================================================================================
4
. res.setHeader
- HTTPヘッダーを設定するメソッドです。Node.jsのHTTPサーバーの一部。
- この例では、`'Content-Type', 'application/json'` と設定しているため、レスポンスのコンテンツがJSON形式であ
ることを示しています。
------------------------------------------------------------------------------------------------
- Node.jsのHTTPサーバーとは、Node.jsの標準ライブラリで提供されるHTTP通信のサーバーサイド機能です。これを使用す
ると、JavaScriptで独自のWebサーバーを簡単に作成できます。
- このHTTPサーバーは、HTTPリクエストとレスポンスを処理するための多くのメソッドとプロパティを提供します。これにより
、開発者は低レベルのTCP/IPプロトコルに直接触れることなく、WebアプリケーションやAPIを構築できます。
- 簡単に言えば、Node.jsのHTTPサーバーはWebサーバーの機能をJavaScriptで簡単に扱えるようにするものです。
`res.statusCode`や`res.setHeader`はその一例です。

================================================================================================
5
. res.end
- レスポンスを終了するメソッドです。Node.jsのHTTPサーバーの一部。
- この例では、JSON形式の `{ status: 'ok' }` というオブジェクトをレスポンスボディとして送り、レスポンスを終了し
ています。
------------------------------------------------------------------------------------------------
- `res.end`はNode.jsのHTTPサーバーの一部であり、HTTPレスポンスを終了するためのメソッドです。
- このメソッドが呼び出されると、すべてのレスポンスヘッダーとレスポンスボディがクライアント（通常はWebブラウザ）に送
信されます。
- メソッドが呼び出された後に`res.write`や`res.setHeader`を呼び出しても、エラーが発生するか無視されます。
- `res.end`には引数を渡すこともでき、その場合その引数はレスポンスボディとして送信されます。この例では、JSON形式の
`{ status: 'ok' }`が引数として渡されています。
- このメソッドが呼び出されると、そのHTTPトランザクションは完了し、次のトランザクションが開始されます。
`res.end`を呼び出さないと、HTTPレスポンスがクライアントに送信されず、接続がタイムアウトする可能性があります。した
がって、`res.end`は各API呼び出しの最後に呼び出す必要があります。
*/