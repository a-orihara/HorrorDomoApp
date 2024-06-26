import Navigation from '../molecules/Navigation';
('../../contexts/AuthContext');

const Header = () => {
  return (
    <header className='basic-border flex h-16 flex-row items-center bg-basic-yellow font-spacemono text-2xl font-semibold outline md:text-2xl'>
      <div className='w-1/2 flex-1'>
        {/* Horror Domo Appにはこのh1（子）の個別設定が適用。h1にflex,items-center,justify-center設定で文字が真ん中に */}
        <h1 className='text-basic-black  flex items-center justify-center text-center font-spacemono text-lg font-semibold tracking-tighter md:text-4xl'>
          Horror Domo App
        </h1>
      </div>
      <div className='w-1/2 flex-1'>
        <Navigation></Navigation>
      </div>
    </header>
  );
};

export default Header;

/*
@          @@        @@          @@          @@          @@          @@          @@          @
flex付与されているheaderは、flex-rowというクラスも付与されており、その子要素であるdivが横に並ぶ。
items-centerとjustify-aroundも付与されており、
items-centerクラスによって、子要素であるh1要素とdiv要素が垂直方向の中央に配置され、
justify-aroundクラスによって、子要素が均等に左右中央に配置されるようになります。
*/
