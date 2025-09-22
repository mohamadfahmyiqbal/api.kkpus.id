export const generateMonthIndo = (month) => {
  const monthsIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return monthsIndo[month - 1];
};

export const getMonthNameIndo = (monthIndex) => {
  const monthsIndo = generateMonthIndo();
  return monthsIndo[monthIndex];
};
