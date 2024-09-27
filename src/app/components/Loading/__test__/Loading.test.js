import React from 'react';
import { render } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  test('renders Loading component with correct text', () => {
    const { getByText } = render(<Loading />);
    expect(getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders Loading component with spinner', () => {
    const { getByTestId } = render(<Loading />);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
});
