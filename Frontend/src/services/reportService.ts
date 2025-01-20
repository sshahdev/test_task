import { User } from '../types/user';
import { UserService } from './userService';

export const generateUserReport = async (user: User): Promise<void> => {
  try {
    const blob = await UserService.generateUserReport(user.id);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-report-${user.name}.pdf`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}; 