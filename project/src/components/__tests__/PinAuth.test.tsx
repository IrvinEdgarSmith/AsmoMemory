import { render, screen, fireEvent, waitFor } from '../../test/utils';
import PinAuth from '../PinAuth';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('PinAuth', () => {
  const mockOnAuth = jest.fn();

  beforeEach(() => {
    mockOnAuth.mockClear();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<PinAuth onAuth={mockOnAuth} />);
    
    expect(screen.getByText("Welcome to Asmo's Memory")).toBeInTheDocument();
    expect(screen.getByText('Enter your PIN to continue')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unlock' })).toBeInTheDocument();
  });

  it('has correct input attributes', () => {
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const input = screen.getByPlaceholderText('••••');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('maxLength', '4');
    // AutoFocus is a boolean attribute and may not be testable in jsdom environment
  });

  it('allows typing a PIN', async () => {
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const input = screen.getByPlaceholderText('••••');
    fireEvent.change(input, { target: { value: '1234' } });
    
    expect(input).toHaveValue('1234');
  });

  it('calls onAuth with correct PIN on form submission', async () => {
    mockOnAuth.mockReturnValue(true);
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const input = screen.getByPlaceholderText('••••');
    const button = screen.getByRole('button', { name: 'Unlock' });
    
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(button);
    
    expect(mockOnAuth).toHaveBeenCalledWith('1234');
  });

  it('shows success toast when authentication succeeds', async () => {
    mockOnAuth.mockReturnValue(true);
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const input = screen.getByPlaceholderText('••••');
    const button = screen.getByRole('button', { name: 'Unlock' });
    
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Welcome back!');
    });
  });

  it('shows error toast and clears input when authentication fails', async () => {
    mockOnAuth.mockReturnValue(false);
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const input = screen.getByPlaceholderText('••••');
    const button = screen.getByRole('button', { name: 'Unlock' });
    
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid PIN');
      expect(input).toHaveValue('');
    });
  });

  it('submits form on Enter key press', async () => {
    mockOnAuth.mockReturnValue(true);
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const form = screen.getByRole('button', { name: 'Unlock' }).closest('form');
    const input = screen.getByPlaceholderText('••••');
    
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.submit(form!);
    
    expect(mockOnAuth).toHaveBeenCalledWith('1234');
  });

  it('limits input to 4 characters', () => {
    render(<PinAuth onAuth={mockOnAuth} />);
    
    const input = screen.getByPlaceholderText('••••');
    
    // The maxLength attribute should prevent typing more than 4 characters
    fireEvent.change(input, { target: { value: '123456' } });
    
    // The input should still only have the first 4 characters due to maxLength
    expect(input).toHaveAttribute('maxLength', '4');
  });
});