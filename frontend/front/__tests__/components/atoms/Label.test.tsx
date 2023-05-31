import { render, screen } from '@testing-library/react';
import Label from '../../../src/components/atoms/Label';

describe('Label', () => {
  test('labelがレンダリングされる', () => {
    render(<Label>Test Label</Label>);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeInTheDocument();
  });

  test('指定したテキストを含む', () => {
    render(<Label>Test Label</Label>);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement.textContent).toBe('Test Label');
  });

  test('指定したクラスを持つ', () => {
    render(<Label className='test-class'>Test Label</Label>);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toHaveClass('test-class');
  });

  test('ブロッククラスを持つ', () => {
    render(<Label className='test-class'>Test Label</Label>);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toHaveClass('block');
  });
});
