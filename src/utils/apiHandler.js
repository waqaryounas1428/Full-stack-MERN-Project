// API response handler utility

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || defaultMessage;
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

export const handleApiSuccess = (response) => {
  return response.data;
};

// Wrapper for API calls with error handling
export const apiCall = async (apiFunction, errorMessage) => {
  try {
    const response = await apiFunction();
    return { success: true, data: handleApiSuccess(response) };
  } catch (error) {
    return { success: false, error: handleApiError(error, errorMessage) };
  }
};
