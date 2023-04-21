import React from 'react';

type LabelProps = React.ComponentProps<'label'> & {
  children: React.ReactNode;
  className?: string;
};

const Label = ({ children, className, ...labelprops }: LabelProps) => {
  return (
    <label className={`block ${className}`} {...labelprops}>
      {children}
    </label>
  );
};

export default Label;
