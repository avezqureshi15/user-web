export const validateEmail = (email: string): boolean => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password validation logic (e.g., length)
  return password.length >= 8; // Example: Minimum length of 8 characters
};
export const validateName = (name: string): boolean => {
  // Name validation logic (e.g., length, allowed characters)
  return /^[a-zA-Z\s]*$/.test(name) && name.trim().length > 0;
};
