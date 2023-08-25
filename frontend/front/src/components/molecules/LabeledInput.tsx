// frontend/front/src/components/molecules/LabeledInput.tsx
import React from 'react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

type LabeledInputProps = {
  label: string;
  id: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const LabeledInput = ({ label, className, ...inputProps }: LabeledInputProps) => {
  return (
    <div>
      <Label className={`m-auto w-4/5 pl-4 text-left text-lg md:w-3/5 md:text-2xl lg:w-2/5`} htmlFor={inputProps.id}>
        {label}:
      </Label>
      <br />
      <Input className={`m-auto mb-4 mt-1 w-4/5  md:w-3/5 lg:w-2/5 ${className}`} {...inputProps} />
    </div>
  );
};

export default LabeledInput;
