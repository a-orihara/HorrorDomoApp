import Navigation from '../molecules/Navigation';
('../../contexts/AuthContext');

const Header = () => {
  return (
    <header className='basic-border flex h-16 flex-row items-center justify-around bg-basic-yellow font-spacemono text-2xl font-semibold outline md:text-2xl'>
      <div className=' flex-grow'>
        <h1 className='text-basic-black ml-3 mr-auto text-center font-spacemono text-lg font-semibold tracking-tighter sm:text-2xl md:text-4xl'>
          Horror Domo App
        </h1>
      </div>
      <Navigation></Navigation>
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
