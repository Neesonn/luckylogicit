import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme/theme';
import ContactForm from '../contact-us/page';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

const renderWithChakra = (component: React.ReactNode) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderWithChakra(<ContactForm />);
    
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select enquiry topic/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithChakra(<ContactForm />);
    
    const submitButton = screen.getByText(/send via whatsapp/i);
    fireEvent.click(submitButton);
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/please complete all fields/i)).toBeInTheDocument();
    });
  });

  it('submits form via WhatsApp when all fields are filled', async () => {
    renderWithChakra(<ContactForm />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText(/your name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '1234567890');
    
    // Select a topic
    const topicButton = screen.getByRole('button', { name: /select enquiry topic/i });
    fireEvent.click(topicButton);
    const topicOption = screen.getByText(/network wi-fi and internet setup/i);
    fireEvent.click(topicOption);
    
    // Add message
    await userEvent.type(screen.getByLabelText(/your message/i), 'Test message');
    
    // Submit form
    const submitButton = screen.getByText(/send via whatsapp/i);
    fireEvent.click(submitButton);
    
    // Check if WhatsApp URL was opened
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/61426901209'),
      '_blank'
    );
  });

  it('submits form via email when all fields are filled', async () => {
    renderWithChakra(<ContactForm />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText(/your name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '1234567890');
    
    // Select a topic
    const topicButton = screen.getByRole('button', { name: /select enquiry topic/i });
    fireEvent.click(topicButton);
    const topicOption = screen.getByText(/network wi-fi and internet setup/i);
    fireEvent.click(topicOption);
    
    // Add message
    await userEvent.type(screen.getByLabelText(/your message/i), 'Test message');
    
    // Submit form via email
    const emailButton = screen.getByText(/send via email/i);
    fireEvent.click(emailButton);
    
    // Check if mailto link was opened
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('mailto:michael@luckylogic.com.au'),
      '_blank'
    );
  });

  it('applies focus styles to form fields', async () => {
    renderWithChakra(<ContactForm />);
    
    const nameInput = screen.getByLabelText(/your name/i);
    nameInput.focus();
    
    // Check that the input is focusable
    expect(document.activeElement).toBe(nameInput);
  });
}); 