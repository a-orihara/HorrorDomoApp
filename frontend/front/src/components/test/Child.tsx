import { useState } from 'react';

type ChildProps = {
  count: number;
};

const Child = ({ count }: ChildProps) => {
  const [childCount, setChildCount] = useState(count);

  // useEffect(() => {
  // setChildCount(count);
  // }, [count]);

  console.log(`子の数: ${childCount}`);

  return (
    <div>
      <h2>子コンポーネントのカウント: {childCount}</h2>
    </div>
  );
};

export default Child;
