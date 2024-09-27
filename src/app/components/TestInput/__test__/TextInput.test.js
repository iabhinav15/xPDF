import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '../TextInput';

describe('TextInput Component', () => {
  test('renders TextInput component with label and placeholder', () => {
    render(<TextInput label="Email" placeholder="Enter your email" />);
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });

  test('renders TextInput component without label', () => {
    render(<TextInput placeholder="Enter your email" />);
    expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });

  test('renders TextInput component with error message', () => {
    render(<TextInput placeholder="Enter your email" error="Invalid email" />);
    expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
  });

  test('updates value of TextInput component', () => {
    render(<TextInput placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText(/Enter your email/i);
    userEvent.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');
  });
});
