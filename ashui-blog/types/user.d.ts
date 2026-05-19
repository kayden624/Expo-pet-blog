namespace User {
  interface LoginUser extends Personal_info {
    password: string;
    access_token: string;
    userId: string;
    loginTime: number;
    _id: string;
  }

  interface Personal_info {
    email: string;
    username: string;
    bio: string;
    profile_img: string;
  }

  interface Activity {
    total_posts: number;
    total_following: number;
    total_verified_followers: number;
  }

  interface User {
    personal_info: Personal_info;
    activity: Activity;
    userId: string;
    blogs: string[];
    following: any[];
    verified_followers: any[];
    joinedAt: string;
    __v: number;
  }

  interface Profile {
    status: string;
    user: User;
  }
}
