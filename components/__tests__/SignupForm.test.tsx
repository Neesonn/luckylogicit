import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import SignupForm from '../SignupForm'
import theme from '../../theme/theme'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
}))

// Mock Supabase client
jest.mock('@/app/services/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn(),
  })),
}))

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider theme={theme}>
      {component}
    </ChakraProvider>
  )
}

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the signup form with all required fields', () => {
    renderWithChakra(<SignupForm />)
    
    expect(screen.getByText('Create Your Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Address Line 1')).toBeInTheDocument()
    expect(screen.getByLabelText('City')).toBeInTheDocument()
    expect(screen.getByLabelText('State')).toBeInTheDocument()
    expect(screen.getByLabelText('Postcode')).toBeInTheDocument()
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('shows validation errors for required fields when submitted empty', async () => {
    renderWithChakra(<SignupForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('State is required')).toBeInTheDocument()
      expect(screen.getByText('Postcode is required')).toBeInTheDocument()
      expect(screen.getByText('Country is required')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    renderWithChakra(<SignupForm />)
    
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })
  })

  it('validates password minimum length', async () => {
    renderWithChakra(<SignupForm />)
    
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: '123' } })
    
    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('validates full name minimum length', async () => {
    renderWithChakra(<SignupForm />)
    
    const nameInput = screen.getByLabelText('Full Name')
    fireEvent.change(nameInput, { target: { value: 'A' } })
    
    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
    })
  })

  it('shows link to login page', () => {
    renderWithChakra(<SignupForm />)
    
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    expect(screen.getByText('Sign in here')).toBeInTheDocument()
  })
}) 