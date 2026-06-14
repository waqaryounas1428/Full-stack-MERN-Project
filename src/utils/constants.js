// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  JOBS: '/jobs',
  APPLY: '/apply',
  MY_APPLICATIONS: '/my-applications',
  ADMIN_DASHBOARD: '/admin'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const EXPERIENCE_OPTIONS = [
  { value: '0-1', label: '0-1 Years' },
  { value: '1-2', label: '1-2 Years' },
  { value: '2-3', label: '2-3 Years' },
  { value: '3-4', label: '3-4 Years' },
  { value: '4-5', label: '4-5 Years' },
  { value: '5+', label: '5+ Years' }
];

export const ADMIN_CREDENTIALS = {
  EMAIL: 'admin',
  PASSWORD: 'admin',
  TOKEN: 'admin-token-12345'
};

export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  SIGNUP_SUCCESS: 'Account created successfully',
  JOB_POSTED: 'Job posted successfully',
  JOB_UPDATED: 'Job updated successfully',
  JOB_DELETED: 'Job deleted successfully',
  APPLICATION_SUBMITTED: 'Application submitted successfully',
  APPLICATION_UPDATED: 'Application status updated',
  ALREADY_APPLIED: 'You have already applied for this job',
  LOGIN_REQUIRED: 'Please login first to apply for this job!',
  ADMIN_ONLY: 'Admin access required',
  ERROR_GENERIC: 'Something went wrong. Please try again.'
};
