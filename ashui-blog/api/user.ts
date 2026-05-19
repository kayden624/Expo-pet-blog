import api from "./client";

export const actionList =
  (userId: string) =>
  (page = 1, limit = 10) =>
    api
      .get("notification/list/" + userId, {
        searchParams: { page, limit },
      })
      .json();

export const followingList =
  (userId: string) =>
  (page = 1, limit = 10) =>
    api
      .get("user/getFollowingUsers", {
        searchParams: { page, limit, userId },
      })
      .json();
export const followedList =
  (userId: string) =>
  (page = 1, limit = 10) =>
    api
      .get("user/getFollowedUsers", {
        searchParams: { page, limit, userId },
      })
      .json();

export const doFollow = (followUserId: string) =>
  api.post("user/follow", { json: { followUserId } }).json();

export const updateProfile = (userId: string, profile: any) =>
  api.put(`user/${userId}/profile`, { json: profile }).json();

export const checkEmailisExist = (email: string) =>
  api.post(`user/checkEmailExists/`, { json: { email } }).json();

export const changePassword = (password: string) =>
  api
    .put(`user/password`, { json: { password, password_confirmed: password } })
    .json();

//搜索
export const searchUser =
  (keyword: string) =>
  (page = 1, limit = 10) =>
    api
      .get<Blog.BlogList>(
        `search/user?keyValue=${keyword}&page=${page}&limit=${limit}`
      )
      .json();
