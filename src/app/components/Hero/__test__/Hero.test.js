import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import Hero from '../Hero';

describe('Hero Component', () => {
  test('renders Hero component', () => {
    render(<Hero />);
    expect(screen.getByText(/Split PDF file/i)).toBeInTheDocument();
  });

  test('file upload and rendering pages', async () => {
    const file = new File(['(PDF content)'], 'example.pdf', { type: 'application/pdf' });
    const { getByText } = render(<Hero />);

    const input = screen.getByLabelText(/or drop PDF here/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(getByText(/1/i)).toBeInTheDocument());
    expect(screen.getByText(/Select pages to extract/i)).toBeInTheDocument();
  });

  test('selecting and deselecting pages', async () => {
    const file = new File(['(PDF content)'], 'example.pdf', { type: 'application/pdf' });
    render(<Hero />);

    const input = screen.getByLabelText(/or drop PDF here/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(screen.getByText(/1/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/1/i));
    fireEvent.click(screen.getByText(/2/i));
    expect(screen.queryByText(/Select pages to extract/i)).not.toBeInTheDocument();
  });

  test('extracting pages', async () => {
    const file = new File(['(PDF content)'], 'example.pdf', { type: 'application/pdf' });
    render(<Hero />);

    const input = screen.getByLabelText(/or drop PDF here/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(screen.getByText(/1/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/1/i));
    fireEvent.click(screen.getByText(/2/i));

    const downloadButton = screen.getByText(/Download/i);
    fireEvent.click(downloadButton);
    await waitFor(() => expect(downloadButton).not.toBeInTheDocument());
  });
});
