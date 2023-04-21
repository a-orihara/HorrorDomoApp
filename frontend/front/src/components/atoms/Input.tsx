import React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  placeholder?: string;
  className?: string;
};

// { ...inputProps}
const Input = ({ placeholder, className, ...inputProps }: InputProps) => {
  return <input className={`basic-input ${className}`} placeholder={placeholder} {...inputProps} />;
};

export default Input;

/*
propsの色んな書き方
*/
