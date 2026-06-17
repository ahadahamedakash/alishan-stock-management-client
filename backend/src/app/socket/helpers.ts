// Socket.IO Helper Functions
import { User } from '../modules/user/user.model';

/**
 * Get user name by ID for notifications
 */
export const getUserName = async (userId: string): Promise<string> => {
  try {
    const user = await User.findById(userId).select('name');
    return user?.name || 'Unknown User';
  } catch (error) {
    return 'Unknown User';
  }
};

/**
 * Get user email by ID for notifications
 */
export const getUserEmail = async (userId: string): Promise<string> => {
  try {
    const user = await User.findById(userId).select('email');
    return user?.email || '';
  } catch (error) {
    return '';
  }
};

/**
 * Get user name and email by ID
 */
export const getUserInfo = async (userId: string): Promise<{ name: string; email: string }> => {
  try {
    const user = await User.findById(userId).select('name email');
    return {
      name: user?.name || 'Unknown User',
      email: user?.email || '',
    };
  } catch (error) {
    return { name: 'Unknown User', email: '' };
  }
};
