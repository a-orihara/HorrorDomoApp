import React from 'react';

// 1 型定義
type ButtonProps = React.ComponentProps<'button'> & {
  children: React.ReactNode;
  className?: string;
};
// 別の書き方
// const Button = (props: ButtonProps) => {
//   return <button className={`${props.className}`}>{props.children}</button>;
// };
// 2
const Button = ({ ...buttonProps }: ButtonProps) => {
  return (
    <button className={`${buttonProps.className}`} {...buttonProps}>
      {buttonProps.children}
    </button>
  );
};

export default Button;

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
React.ComponentProps<'button'>はオブジェクト。その実行結果。
{
  name?: string;
  type?: "submit" | "reset" | "button";
  value?: string | ReadonlyArray<string> | number;
  children: React.ReactNode
  className?: string
  ...全てのbuttonタグにつけられるプロパティ。
}
intersection型（交差型）がないとこう。
type type名 = {}だから、
type ButtonProps = React.ComponentProps<'button'>;

React.ComponentPropsにchildren: React.ReactNode、className?: stringがあるのに、
intersection型（交差型）にするのは、Buttonコンポーネントの独自のプロパティが明示的に示され、よりわかりやすく
なるため。

------------------------------------------------------------------------------------------------
&の意味は、intersection型（交差型）を表しています。交差型は、複数の型を「&」でつないで、2つ以上の型を結合するこ
とができます。

================================================================================================
2
Button = ({ ...buttonProps }: ButtonProps)
{ ...buttonProps } はスプレッド構文を使って ButtonProps オブジェクトのプロパティを展開しています。
ButtonProps のプロパティを一つずつ分割代入する必要がなく、コードをより短く書くことができます。

React.ComponentProps<'button'>は、button要素に対応するReactコンポーネントのPropsの型を取得

buttonPropsは、Buttonコンポーネントが受け取る全てのpropsを収集して、一つのオブジェクトとして展開することを意味
します。この展開されたオブジェクトは、Buttonコンポーネント内で使われるbutton要素のpropsとして渡されます。
つまり、ButtonPropsで定義されたプロパティ(childrenとclassName)以外に、onClickやdisabledなどのbutton要素
に設定できるプロパティがある場合、それらもbuttonPropsに含まれることになります。
================================================================================================
型定義
React.ComponentProps<'button'>は、button要素に設定できる全てのプロパティを取得するための型定義です。
以下に、button要素に設定できるプロパティの一部を箇条書きで示します。

accessKey
autoFocus
className
contentEditable
dir
disabled
draggable
form
formAction
formEncType
formMethod
formNoValidate
formTarget
hidden
id
lang
name
tabIndex
title
type
value
role
aria-* (aria-属性の一覧)
*/
