namespace Blog {
  interface Activity {
    total_likes: number;
    total_comments: number;
    total_reads: number;
  }

  interface Personal_info {
    username: string;
    bio: string;
    profile_img: string;
  }

  interface Author {
    personal_info: Personal_info;
    _id: string;
    userId: string;
    following: any[];
    verified_followers: any[];
  }

  interface BlogItem {
    activity: Activity;
    _id: string;
    blog_id: string;
    title: string;
    banner: string;
    author: Author;
    publishedAt: string;
  }

  interface Data {
    text: string;
    file?: { url: string };
    level?: number;
  }

  interface Block {
    id: string;
    type: string;
    data: Data;
  }

  interface Content {
    time: number;
    blocks: Block[];
    version: string;
  }
  interface BlogDetail {
    activity: Activity;
    _id: string;
    blog_id: string;
    title: string;
    banner: string;
    content: Content[];
    tags: string[];
    draft: boolean;
    author: Author;
    liked_users: any[];
    followed_users: any[];
    publishedAt: string;
    updatedAt: string;
    __v: number;
  }
  interface ListResult {
    _id: string;
    author: Author;
    blog: BlogItem;
  }

  interface BlogList {
    results: ListResult[];
    totalDocs: number;
    pageIndex: string;
  }
}

type Op = "add" | "edit" | "del";
