
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomButton from '../CustomButton';


test('CustomButton renders correctly with title and without icon', () => {
  const title = 'Click me';
  const { getByText } = render(<CustomButton title={title} />);

  const buttonElement = getByText(title);
  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement.tagName).toBe('BUTTON');
});


test('CustomButton onClick function is called when clicked', () => {
  const onClickMock = jest.fn();
  const title = 'Click me';
  const { getByText } = render(<CustomButton title={title} onClick={onClickMock} />);

  const buttonElement = getByText(title);
  fireEvent.click(buttonElement);

  expect(onClickMock).toHaveBeenCalledTimes(1);
});

test('CustomButton renders with specified type', () => {
  const title = 'Click me';
  const type = 'submit';
  const { getByText } = render(<CustomButton title={title} type={type} />);

  const buttonElement = getByText(title);
  expect(buttonElement.getAttribute('type')).toBe(type);
});
