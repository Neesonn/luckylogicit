import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme/theme';

// Mock the useBreakpointValue hook
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useBreakpointValue: jest.fn(),
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const renderWithChakra = (component: React.ReactNode) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders logo', () => {
    renderWithChakra(<Navbar />);
    const logo = screen.getByAltText('Lucky Logic logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links in desktop view', () => {
    // Mock desktop view
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(false);
    
    renderWithChakra(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders hamburger menu in mobile view', () => {
    // Mock mobile view
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(true);
    
    renderWithChakra(<Navbar />);
    
    const menuButton = screen.getByLabelText('Open navigation menu');
    expect(menuButton).toBeInTheDocument();
    
    // Test menu interaction
    fireEvent.click(menuButton);
    
    // Check if menu items are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    renderWithChakra(<Navbar />);
    
    const whatsappLink = screen.getByLabelText('Contact us on WhatsApp');
    const instagramLink = screen.getByLabelText('Follow us on Instagram');
    const facebookLink = screen.getByLabelText('Follow us on Facebook');
    
    expect(whatsappLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(facebookLink).toBeInTheDocument();
    
    // Check if links have correct href attributes
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/61426901209');
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/luckylogicit');
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/luckylogicIT/');
  });

  it('applies focus styles to navigation links', () => {
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(false);
    renderWithChakra(<Navbar />);
    const homeLink = screen.getByText('Home');
    homeLink.focus();
    // Check that the link is focusable
    expect(document.activeElement).toBe(homeLink);
  });
}); 