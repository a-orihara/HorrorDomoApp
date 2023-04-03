import React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  placeholder?: string;
};

// { ...inputProps}
const Input = ({ placeholder, ...inputProps }: InputProps) => {
  return <input placeholder={placeholder} {...inputProps} />;
};

export default Input;

/*
propsの色んな書き方
*/
