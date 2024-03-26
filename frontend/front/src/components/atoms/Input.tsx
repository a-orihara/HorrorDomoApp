import React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  // テキストボックスに初期表示されるテキスト
  placeholder?: string;
  className?: string;
};

const Input = ({ placeholder, className, ...inputProps }: InputProps) => {
  return <input className={`basic-input ${className}`} placeholder={placeholder} {...inputProps} />;
};

export default Input;