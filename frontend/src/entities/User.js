// Mock User entity for demo purposes
export class User {
  static async me() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          name: "Demo User",
          email: "demo@studybuddy.com",
          account_type: "student",
          class_name: "10A",
          profile_completed: true,
          dark_mode: false,
          background_color: '#FDFD96',
          accent_color: '#87CEEB',
          font_family: 'space-grotesk'
        });
      }, 500);
    });
  }

  static async logout() {
    // Simulate logout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  }

  static async updateMyUserData(data) {
    // Simulate user data update
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data });
      }, 300);
    });
  }
}
