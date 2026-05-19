export const getFullDate = () => {
  let currentDate = new Date();
  
  let cDay = currentDate.getDate();
  let cMonth = Number(currentDate.getMonth()) + 1;
  let cYear = currentDate.getFullYear();

  cDay = cDay < 10 ? "0" + cDay : cDay;
  cMonth = cMonth < 10 ? "0" + cMonth : cMonth;

  return `${cYear}${cMonth}${cDay}`;
};
