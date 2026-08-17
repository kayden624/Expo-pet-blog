import defaultImg from "../imgs/defaultImg.jpg";

export const getAuthorView = (author) => {
  const profile = author?.personal_info ?? {};

  return {
    hasAuthor: Boolean(author?.userId || author?._id),
    userId: author?.userId ?? null,
    authorId: author?._id ?? null,
    username: profile.username || "Unknown author",
    profileImage: profile.profile_img || defaultImg,
    bio: profile.bio || "",
    verifiedFollowers: author?.verified_followers ?? [],
  };
};
