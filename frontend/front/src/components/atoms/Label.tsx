import React from 'react';

type LabelProps = React.ComponentProps<'label'> & {
  children: React.ReactNode;
};

const Label = ({ children, ...labelprops }: LabelProps) => {
  return <label {...labelprops}>{children}</label>;
};

export default Label;
