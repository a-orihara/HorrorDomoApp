// Headerをlayoutするテンプレート。
import { ReactNode } from "react";
import { Header } from "../organisms/Header";

type Props = {
  children: ReactNode;
};

export const HeaderLayout = (props: Props): JSX.Element => {
  const { children } = props;
  return (
    <div className="bg-yellow-200">
      <Header></Header>
      {children}
    </div>
  );
};
