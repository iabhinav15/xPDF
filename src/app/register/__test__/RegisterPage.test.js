import React from 'react';
import RegisterPage from '../page';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { useRouter } from 'next/router';


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterPage Component', () => {
  test('renders RegisterPage component with form fields', () => {
    render(<RegisterPage />);
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('renders error message if form fields are empty on form submission', async () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => {
      expect(screen.getByText(/Full Name is required!/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required!/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required!/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility on click', () => {
    render(<RegisterPage />);
    const passwordInput = screen.getByLabelText(/Password/i);
    const eyeIcon = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('navigates to login page on successful registration', async () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });

    render(<RegisterPage />);
    userEvent.type(screen.getByLabelText(/Full Name/i), 'Abhinav Singh');
    userEvent.type(screen.getByLabelText(/Email Address/i), 'abhinavsingh@gmail.com');
    userEvent.type(screen.getByLabelText(/Password/i), 'password');
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/login'));
  });
});
