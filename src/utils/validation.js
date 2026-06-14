// Form validation utility functions

export const validators = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword: (password, minLength = 6) => {
    return password && password.length >= minLength;
  },

  // Phone validation
  isValidPhone: (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    return /^\d{10,15}$/.test(cleanPhone);
  },

  // Required field validation
  isRequired: (value) => {
    return value && value.trim().length > 0;
  },

  // Match validation (for password confirmation)
  isMatch: (value1, value2) => {
    return value1 === value2;
  }
};

// Common validation rules
export const validateLoginForm = (emailOrPhone, password) => {  // ✅ CHANGED parameter name
  const errors = {};
  
  if (!validators.isRequired(emailOrPhone)) {
    errors.emailOrPhone = 'Email or phone is required';  // ✅ CHANGED
  } else if (emailOrPhone !== 'admin') {
    // Check if it's email or phone
    const isEmail = validators.isValidEmail(emailOrPhone);
    const isPhone = validators.isValidPhone(emailOrPhone);
    
    if (!isEmail && !isPhone) {
      errors.emailOrPhone = 'Invalid email or phone number';  // ✅ ADDED
    }
  }
  
  if (!validators.isRequired(password)) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

export const validateSignupForm = (formData) => {
  const errors = {};
  
  if (!validators.isRequired(formData.firstName)) {
    errors.firstName = 'First name is required';
  }
  
  if (!validators.isRequired(formData.lastName)) {
    errors.lastName = 'Last name is required';
  }
  
  // ✅ CHANGED: Validate emailOrPhone (can be email OR phone)
  if (!validators.isRequired(formData.emailOrPhone)) {
    errors.emailOrPhone = 'Email or phone is required';
  } else {
    // Check if it's email or phone
    const isEmail = validators.isValidEmail(formData.emailOrPhone);
    const isPhone = validators.isValidPhone(formData.emailOrPhone);
    
    if (!isEmail && !isPhone) {
      errors.emailOrPhone = 'Please enter a valid email or phone number';
    }
  }
  
  if (!validators.isRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!validators.isValidPassword(formData.password, 6)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!validators.isRequired(formData.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (!validators.isMatch(formData.password, formData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

export const validateJobForm = (jobData) => {
  const errors = {};
  
  if (!validators.isRequired(jobData.title)) {
    errors.title = 'Job title is required';
  }
  
  if (!validators.isRequired(jobData.company)) {
    errors.company = 'Company name is required';
  }
  
  if (!validators.isRequired(jobData.location)) {
    errors.location = 'Location is required';
  }
  
  return errors;
};

export const validateApplicationForm = (formData) => {
  const errors = {};
  
  if (!validators.isRequired(formData.fullName)) {
    errors.fullName = 'Full name is required';
  }
  
  if (!validators.isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validators.isValidEmail(formData.email)) {
    errors.email = 'Invalid email';
  }
  
  if (!validators.isRequired(formData.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validators.isValidPhone(formData.phone)) {
    errors.phone = 'Enter a valid phone number';
  }
  
  if (!validators.isRequired(formData.coverLetter)) {
    errors.coverLetter = 'Cover letter is required';
  }
  
  return errors;
};
