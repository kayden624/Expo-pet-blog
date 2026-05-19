namespace Comment {
  interface Personal_info {
    username: string;
    profile_img: string;
  }

  interface From {
    personal_info: Personal_info;
    _id: string;
  }

  interface Comment {
    _id: string;
    blog_id: string;
    count: number;
    comment: string;
    from: From;
    to?: any;
    root?: any;
    replies: any[];
    likes_user: any[];
    commentedAt: string;
    updatedAt: string;
    __v: number;
  }

  interface CommentList {
    results: Result[];
    totalDocs: number;
    pageIndex: string;
  }
}
