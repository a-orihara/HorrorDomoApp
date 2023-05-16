import { useState } from 'react';
import Child from './Child';

const Parent = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };
  console.log(`親の数: ${count}`);

  return (
    <div>
      <h2>親コンポーネントのカウント: {count}</h2>
      <button onClick={handleIncrement}>カウントアップ</button>
      <Child count={count} />
    </div>
  );
};

export default Parent;
