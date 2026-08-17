import api from "./client";

export const blogDetail = (blog_id: string) =>
  api.get<{ blog: Blog.BlogDetail }>(`blog/${blog_id}/view`).json();

export const getCommentListByBlogId = (blog_id: string, page = 1, limit = 10) =>
  api
    .get<Comment.CommentList>(`comment/commentList/${blog_id}/${page}/${limit}`)
    .json();

export const getBlogList =
  (userId: string) =>
  (page = 1, limit = 10) =>
    api
      .get<Blog.BlogList>(
        `blog/blogList?page=${page}&limit=${limit}&userId=${userId}`
      )
      .json();
export const getBlogFollowList =
  (userId: string) =>
  (page = 1, limit = 10) =>
    api
      .get<Blog.BlogList>(
        `blog/blogList/followed?page=${page}&limit=${limit}&userId=${userId}`
      )
      .json();

export const likeBlog = (blog_id: string) =>
  api.post<{ message: string }>(`blog/${blog_id}/like`).json();

///api/blog/20250410Zm99WVSg62tdHCPAWxZ0O/follow
export const followBlog = (blog_id: string) =>
  api.post<{ message: string }>(`blog/${blog_id}/follow`).json();

// 添加评论
export const addComment = (data: {
  blog_id: string;
  comment: string;
  root?: string;
  to?: string;
}) => api.post(`comment/create`, { json: data }).json();

//删除评论
export const deleteComment = (comment_id: string) =>
  api.delete(`comment/${comment_id}`).json();

//搜索
export const searchBlog =
  (keyword: string, user_id = "") =>
  (page = 1, limit = 10) =>
    api
      .get<{ results: Blog.SearchResult[]; totalDocs: number; pageIndex: string }>(
        `search/blog?keyValue=${keyword}&page=${page}&limit=${limit}&user_id=${user_id}`
      )
      .json();

//修改
export const updateBlog = (data: any) =>
  api.post(`blog/create`, { json: data }).json();

//删除
export const deleteBlog = (blog_id: string) =>
  api.delete(`blog/${blog_id}`).json();
