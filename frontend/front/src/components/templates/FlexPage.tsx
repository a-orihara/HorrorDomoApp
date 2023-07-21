const FlexPage = () => {
  return (
    <div className='flex min-h-screen flex-col  bg-orange-100'>
      <header className='h-16 bg-green-200'>ヘッダー</header>
      <div className='flex flex-grow flex-col bg-slate-300  lg:flex-row'>
        <aside className='flex flex-row  bg-yellow-200 py-8 lg:w-32 lg:flex-none lg:flex-col'>
          <div className='flex flex-1 flex-row justify-around bg-green-200 lg:flex-col lg:justify-start'>
            <button className='bg-pink-200 lg:mb-36 '>1</button>
            <button className='bg-purple-200 lg:mb-36 '>2</button>
            <button className='bg-green-400 lg:mb-36 '>3</button>
          </div>
        </aside>
        <main className='flex-1 bg-red-100'>
          <h1 className='h-96 bg-pink-200'>1</h1>
          <h1 className='h-96 bg-purple-200'>2</h1>
          <h1 className='h-96 bg-green-200'>3</h1>
        </main>
      </div>
      <footer className='h-16 bg-blue-100'>フッター</footer>
    </div>
  );
};

export default FlexPage;

/*
1
min-h-screenだと子要素のh-1/2が効かない。
*/
