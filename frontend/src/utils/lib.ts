export const validateUsername = (
  username: string
): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: "Username is required" };
  }
  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }
  if (username.length > 15) {
    return { isValid: false, error: "Username must be 15 characters or less" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { isValid: true };
};
