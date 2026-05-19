export const getFullDay = (timestamp) => {
  let date = new Date(timestamp);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${year}/${month}/${day}`;
};

export const getMonthDay = (timestamp) => {
  let date = new Date(timestamp);

  let day = date.getDate();
  let month = date.getMonth() + 1;

  return `${month}/${day}`;
};

export const getGrowDay = (timestamp) => {
  let currentDate = Date.now();

  let date = new Date(timestamp);
  date = date.getTime();

  let diff = currentDate - date;
  let diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  return diffInDays;
};

export const getFormatedBlogPublishedTime = (timestamp) => {
  let currentDate = Date.now();

  let date = new Date(timestamp);
  date = date.getTime();

  let diff = currentDate - date;
  let diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  let diffInHours = Math.floor(diff / (1000 * 60 * 60));

  let result =
    diffInDays < 1
      ? diffInHours + " hours ago"
      : diffInDays > 7
      ? getFullDay(timestamp)
      : diffInDays + " days ago";

  return result;
};
