import React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  placeholder?: string;
};

// { ...inputProps}
const Input = ({ placeholder, ...inputProps }: InputProps) => {
  return (
    <input
      className={
        'mb-3 h-10 w-4/12 rounded-full border-2 border-gray-900 bg-gray-100 px-3 py-2 text-2xl   text-basic-green placeholder-gray-500 focus:border-slate-100 focus:outline-none'
      }
      placeholder={placeholder}
      {...inputProps}
    />
  );
};

export default Input;

/*
propsの色んな書き方
*/
