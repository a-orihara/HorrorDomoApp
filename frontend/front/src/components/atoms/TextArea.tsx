type TextAreaProps = React.ComponentProps<'textarea'> & {
  className?: string;
};

const TextArea = ({ className, ...textAreaProps }: TextAreaProps) => {
  return <textarea className={`basic-border ${className}`} {...textAreaProps}></textarea>;
};

export default TextArea;
