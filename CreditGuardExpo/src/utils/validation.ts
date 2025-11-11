// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  // Check for at least one uppercase, one lowercase, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return 'Password must contain uppercase, lowercase, and number';
  }

  return null;
};

// Confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): string | null => {
  if (!name) {
    return `${fieldName} is required`;
  }

  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }

  if (name.length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }

  return null;
};

// Phone number validation
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return 'Phone number is required';
  }

  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '');

  // Check for valid US phone number (10 digits)
  if (digitsOnly.length !== 10) {
    return 'Please enter a valid 10-digit phone number';
  }

  return null;
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 0) {
    return '';
  }

  if (digitsOnly.length <= 3) {
    return `(${digitsOnly}`;
  }

  if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  }

  if (digitsOnly.length <= 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  // If more than 10 digits, truncate to 10
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
};

// SSN validation (basic format check)
export const validateSSN = (ssn: string): string | null => {
  if (!ssn) {
    return 'Social Security Number is required';
  }

  // Remove all non-digits
  const digitsOnly = ssn.replace(/\D/g, '');

  if (digitsOnly.length !== 9) {
    return 'Please enter a valid 9-digit SSN';
  }

  // Basic validation - not all zeros, not sequential
  if (digitsOnly === '000000000' || digitsOnly === '123456789') {
    return 'Please enter a valid SSN';
  }

  return null;
};

// Format SSN for display
export const formatSSN = (ssn: string): string => {
  const digitsOnly = ssn.replace(/\D/g, '');

  if (digitsOnly.length >= 3) {
    if (digitsOnly.length >= 5) {
      if (digitsOnly.length >= 9) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 5)}-${digitsOnly.slice(5, 9)}`;
      }
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 5)}-${digitsOnly.slice(5)}`;
    }
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  }

  return digitsOnly;
};

// Date of birth validation
export const validateDateOfBirth = (dob: string): string | null => {
  if (!dob) {
    return 'Date of birth is required';
  }

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dob)) {
    return 'Please enter date in MM/DD/YYYY format';
  }

  const [month, day, year] = dob.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  // Check if date is valid
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return 'Please enter a valid date';
  }

  // Check if user is at least 18 years old
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    age < 18 ||
    (age === 18 && monthDiff < 0) ||
    (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return 'You must be at least 18 years old';
  }

  // Check if date is not in the future
  if (birthDate > today) {
    return 'Date of birth cannot be in the future';
  }

  // Check if date is reasonable (not too old)
  if (age > 120) {
    return 'Please enter a valid date of birth';
  }

  return null;
};

// Address validation
export const validateAddress = (address: string): string | null => {
  if (!address) {
    return 'Address is required';
  }

  if (address.length < 5) {
    return 'Please enter a complete address';
  }

  if (address.length > 100) {
    return 'Address is too long';
  }

  return null;
};

// City validation
export const validateCity = (city: string): string | null => {
  if (!city) {
    return 'City is required';
  }

  if (city.length < 2) {
    return 'City name is too short';
  }

  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(city)) {
    return 'City can only contain letters, spaces, hyphens, and apostrophes';
  }

  return null;
};

// State validation
export const validateState = (state: string): string | null => {
  if (!state) {
    return 'State is required';
  }

  // Check if it's a valid 2-letter state code
  const stateRegex = /^[A-Z]{2}$/;
  if (!stateRegex.test(state.toUpperCase())) {
    return 'Please enter a valid 2-letter state code';
  }

  return null;
};

// ZIP code validation
export const validateZipCode = (zipCode: string): string | null => {
  if (!zipCode) {
    return 'ZIP code is required';
  }

  // Support both 5-digit and 9-digit ZIP codes
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return 'Please enter a valid ZIP code (12345 or 12345-6789)';
  }

  return null;
};

// SMS code validation
export const validateSMSCode = (code: string): string | null => {
  if (!code) {
    return 'Verification code is required';
  }

  const digitsOnly = code.replace(/\D/g, '');

  if (digitsOnly.length !== 6) {
    return 'Please enter the 6-digit verification code';
  }

  return null;
};

// General required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

// Terms acceptance validation
export const validateTermsAcceptance = (accepted: boolean): string | null => {
  if (!accepted) {
    return 'You must agree to the terms and conditions';
  }
  return null;
};

// Recovery question validation
export const validateRecoveryQuestion = (questionId: number | null): string | null => {
  if (!questionId || questionId < 1) {
    return 'Please select a security question';
  }
  return null;
};

// Recovery answer validation
export const validateRecoveryAnswer = (answer: string): string | null => {
  if (!answer || answer.trim().length < 2) {
    return 'Please provide an answer (at least 2 characters)';
  }
  if (answer.trim().length > 100) {
    return 'Answer is too long (maximum 100 characters)';
  }
  return null;
};
