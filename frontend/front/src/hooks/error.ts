// 1 エラーハンドリングを行うヘルパー関数
export const getErrorMessage = (data: any): string => {
  if (data && data.errors && data.errors.fullMessages) {
    return data.errors.fullMessages[0];
  }
  return '予期せぬエラーが発生しました。';
};

/*
@          @@          @@          @@          @@          @@          @@          @@          @
1
引数を(err: any)から(data: any)に変更。
err.response.dataとres.dataの両方に対応するため。
------------------------------------------------------------------------------------------------
Next.jsでは、ヘルパー関数とカスタムフックは異なる目的で使用されます。上記のgetErrorMessage関数は状態やライフサ
イクル（例：useStateやuseEffect）に依存しない純粋なJavaScript関数で、Reactのフックとは無関係です。そのため、
そのままヘルパー関数として別のファイルで使用することが適しています。

ヘルパー関数とカスタムフックの違い：
ヘルパー関数：これは、特定のタスクを達成するための一連の手順をカプセル化した単純なJavaScript関数です。それらは状態
を持たず、与えられた入力に対して一貫した出力を返します。それらはどのJavaScriptファイルでも再利用可能で、特定のコン
テクストに依存しません。

カスタムフック：React Hooks（useState、useEffectなど）を使用して作成された特殊な関数です。これらはコンポーネン
トのライフサイクルと状態にアクセスするための手段を提供します。カスタムフックは、ロジックを再利用可能な関数にまとめる
ために使用されます。これらは通常useというプレフィックスで始まり、他のフックを呼び出すことができますが、そのためには
Reactのコンポーネント内か、他のカスタムフック内で呼び出す必要があります。

useReducer
const[satate, dispatch] = useReducer(reducer, initialState);
stateは状態
dispatchは状態を変更するための更新関数
reducerは状態を変更するための関数をまとめた関数
initialStateは初期値

stateは状態
actionはactionオブジェクトで更新方法をまとめたもの。actionオブジェクトにtypeプロパティを持たせる
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
    // returnで新しいstate（状態）を返す
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
}

dispatchはreducer関数を呼び出すための関数
アクションオブジェクトのtypeプロパティによって、どのように状態を更新するかを決める。
dispath({
  type: 'increment',
})
*/
