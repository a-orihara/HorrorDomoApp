// Headerをlayoutするテンプレート。
import { ReactNode } from "react";
import { Header } from "../organisms/Header";

type Props = {
  children: ReactNode;
};

export const HeaderLayout = (props: Props): JSX.Element => {
  const { children } = props;
  return (
    <>
      <h1 className="text-xl">も</h1>
      <Header></Header>
      {children}
    </>
  );
};
