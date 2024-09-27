import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { useRouter } from 'next/router';
import LoginPage from '../page';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage Component', () => {
  test('renders LoginPage component with form fields', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Log in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('renders error message if form fields are empty on form submission', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Email is required!/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required!/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility on click', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/Password/i);
    const eyeIcon = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('navigates to home page on successful login', async () => {
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });

    render(<LoginPage />);
    userEvent.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/Password/i), 'password');
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'));
  });
});
