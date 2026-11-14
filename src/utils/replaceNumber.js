const e2p = (s) => {
  if (s === undefined || s === null) return ""; // جلوگیری از ارور وقتی مقدار وجود ندارد
  return s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

const p2e = (s) => {
  if (s === undefined || s === null) return "";
  return s.toString().replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
};

const sp = (number) => {
  const seperatedNumber = number
    .toString()
    .match(/(\d+?)(?=(\d{3})+(?!\d)|$)/g);
  const joinedNumber = seperatedNumber.join(",");
  return e2p(joinedNumber);
};

export { e2p, p2e, sp };
