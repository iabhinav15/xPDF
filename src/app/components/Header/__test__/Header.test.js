import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/router'; 
import { act } from 'react-dom/test-utils';
import Header from '../Header';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  test('renders Header component', () => {
    render(<Header />);
    expect(screen.getByText(/PDF Splitter/i)).toBeInTheDocument();
  });

  test('clicking on "All files" navigates to /allpdf', async () => {
    render(<Header />);
    const allFilesLink = screen.getByText(/All files/i);
    fireEvent.click(allFilesLink);
    expect(useRouter().push).toHaveBeenCalledWith('/allpdf');
  });

  test('clicking on "Logout" calls handleLogout function and navigates to /login', async () => {
    render(<Header />);
    const logoutButton = screen.getByText(/Logout/i);
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    expect(useRouter().push).toHaveBeenCalledWith('/login');
  });
});
