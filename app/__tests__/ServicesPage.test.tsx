import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme/theme';
import ServicesPage from '../services/page';

// Mock the useBreakpointValue hook
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useBreakpointValue: jest.fn(),
  };
});

const renderWithChakra = (component: React.ReactNode) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  );
};

describe('ServicesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title and description', () => {
    renderWithChakra(<ServicesPage />);
    
    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(screen.getByText(/friendly, professional it help/i)).toBeInTheDocument();
  });

  it('renders services in desktop view', () => {
    // Mock desktop view
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(false);
    
    renderWithChakra(<ServicesPage />);
    
    // Check for service titles
    expect(screen.getByText('Network Setup & Troubleshooting')).toBeInTheDocument();
    expect(screen.getByText('Computer Repairs & Upgrades')).toBeInTheDocument();
    expect(screen.getByText('Software Installation & Support')).toBeInTheDocument();
  });

  it('renders services in mobile view with accordion', () => {
    // Mock mobile view
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(true);
    
    renderWithChakra(<ServicesPage />);
    
    // Check for accordion buttons
    const accordionButtons = screen.getAllByRole('button');
    expect(accordionButtons.length).toBeGreaterThan(0);
    
    // Test accordion interaction
    fireEvent.click(accordionButtons[0]);
    
    // Check if service details are shown
    expect(screen.getByText(/router & modem configuration/i)).toBeInTheDocument();
  });

  it('applies focus styles to service cards', () => {
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(false);
    renderWithChakra(<ServicesPage />);
    const serviceCard = screen.getByText('Network Setup & Troubleshooting').closest('div');
    if (serviceCard) {
      serviceCard.focus();
      // Check that the card is focusable
      expect(document.activeElement).toBe(serviceCard);
    }
  });

  it('applies focus styles to accordion buttons', () => {
    require('@chakra-ui/react').useBreakpointValue.mockReturnValue(true);
    renderWithChakra(<ServicesPage />);
    const accordionButton = screen.getAllByRole('button')[0];
    accordionButton.focus();
    // Check that the button is focusable
    expect(document.activeElement).toBe(accordionButton);
  });
}); 