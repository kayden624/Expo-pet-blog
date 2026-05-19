import api from "./client";

export const blogList = (page = 1, limit = 10) =>
  api.get("blog/getHotBlogs", { searchParams: { page, limit } }).json();
