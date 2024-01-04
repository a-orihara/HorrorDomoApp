import React from 'react';

// 1.1 型定義
type ButtonProps = React.ComponentProps<'button'> & {
  // 1.2
  children: React.ReactNode;
  // 1.3
  className?: string;
};

// 別の書き方
// const Button = (props: ButtonProps) => {
//   return <button className={`${props.className}`}>{props.children}</button>;
// };
// 2
const Button = ({ children, className, ...buttonProps }: ButtonProps) => {
  return (
    <button className={`button-basic ${className}`} {...buttonProps}>
      {children}
    </button>
  );
};

export default Button;

/*
bg-basic-yellow hover:bg-hover-yellow
@          @@          @@          @@          @@          @@          @@          @@          @
1
React.ComponentProps<'button'>はintersection型（交差型）
React.ComponentProps<'button'>と、
  children: React.ReactNode;
  className?: string;
の両方の型を持つ
------------------------------------------------------------------------------------------------
. `React.ComponentProps`は、特定のReactコンポーネントまたはHTML要素のProps型を取得するために使用されるユーテ
ィリティ型だ。本ケースでは、標準の<button> HTML要素に設定できるプロパティの型を取得するために使用される。
`React.ComponentProps<'button'>`は、標準の`<button>` HTML要素のProps型を取得する。つまり、`onClick`,
`disabled`などの`<button>`要素に渡すことができるすべてのプロパティの型を取得する。
------------------------------------------------------------------------------------------------
React.ComponentProps<'button'>は型。その中身。
{
  name?: string;
  type?: "submit" | "reset" | "button";
  value?: string | ReadonlyArray<string> | number;
  children: React.ReactNode
  className?: string
  ...全てのbuttonタグにつけられるプロパティ。
}
------------------------------------------------------------------------------------------------
React.ComponentPropsにchildren: React.ReactNode、className?: stringがあるのに、
intersection型（交差型）にするのは、Buttonコンポーネントの独自のプロパティが明示的に示され、よりわかりやすく
なるため。
------------------------------------------------------------------------------------------------
&の意味は、intersection型（交差型）を表しています。交差型は、複数の型を「&」でつないで、2つ以上の型を結合するこ
とができます。
------------------------------------------------------------------------------------------------
TypeScriptの交差型（intersection型）の具体例

```typescript
type Person = {
  name: string;
  age: number;
};

type Worker = {
  company: string;
  salary: number;
};

// Person型とWorker型を組み合わせた新しい型
type WorkingPerson = Person & Worker;

// WorkingPerson型のオブジェクトの例
const employee: WorkingPerson = {
  name: '山田太郎',
  age: 30,
  company: '株式会社サンプル',
  salary: 300000
};
```
`WorkingPerson`型のオブジェクトは、`Person`型と`Worker`型の両方のプロパティを持つ必要がある。

================================================================================================
1.2
. `React.ReactNode`は、Reactでレンダリングできる要素の型を表す。これには、文字列、数値、React要素、Fragment、
null、boolean、配列などが含まれる。`children: React.ReactNode;`の宣言は、`children`プロパティがこれらの型
のいずれかを受け入れることを意味する。
------------------------------------------------------------------------------------------------
Reactでコンポーネントを作るとき、そのコンポーネントの中に他のコンテンツやコンポーネントを入れることがよくある。例え
ば、`<MyComponent>`というコンポーネントがあるとして、その中に`<p>こんにちは</p>`という段落を入れたい場合が考え
られる。この時、`<MyComponent>`の中にある`<p>こんにちは</p>`の部分が「children」と呼ばれる。
`React.ReactNode`とは、この「children」に何を入れることができるかを定義するための型だ。具体的には、テキスト
（例: 'こんにちは'）、数字（例: 123）、他のReactコンポーネント（例: `<AnotherComponent />`）などが含まれる。
つまり、「このコンポーネントの中には、テキストや別のコンポーネント、空の値など、さまざまなものを入れることができる」
という意味になる。これにより、コンポーネントをより柔軟に、色々な内容を含めることが可能になる。
例えば、ボタンやカードなどのUIコンポーネントを作る時、それらの中にテキスト、画像、リンク、他の小さなコンポーネント
などを入れたい場合がある。この時、childrenプロパティを使うことで、そのコンポーネントの中に何を入れるかを自由に決め
ることができる。

================================================================================================
1.3
. `className?: string;`の`?`は、そのプロパティがオプショナル（任意）であることを示す。つまり、`className`プ
ロパティは提供されなくても良く、提供されない場合は`undefined`になる。この宣言により、`className`プロパティを指
定せずに`Button`コンポーネントを使用することができる。

================================================================================================
2
- Button = ({ ...buttonProps }: ButtonProps)
{ ...buttonProps } はスプレッド構文を使って ButtonProps オブジェクトのプロパティを展開しています。
ButtonProps のプロパティを一つずつ分割代入する必要がなく、コードをより短く書くことができます。
------------------------------------------------------------------------------------------------
- React.ComponentProps<'button'>は、button要素に対応するReactコンポーネントのPropsの型を取得
------------------------------------------------------------------------------------------------
- buttonPropsは、Buttonコンポーネントが受け取る全てのpropsを収集して、一つのオブジェクトとして展開することを意
味します。この展開されたオブジェクトは、Buttonコンポーネント内で使われるbutton要素のpropsとして渡されます。
つまり、ButtonPropsで定義されたプロパティ(childrenとclassName)以外に、onClickやdisabledなどのbutton要素
に設定できるプロパティがある場合、それらもbuttonPropsに含まれることになります。
*/
