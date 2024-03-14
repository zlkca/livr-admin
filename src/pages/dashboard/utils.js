// salesMonthly: {
//     labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//     datasets: { label: "Mobile apps", data: [50, 40, 300, 320, 500, 350, 200, 230, 500] },
//   },

function getMonthIndex(d) {
  const m = parseInt(d.split("-")[1]);
  return m - 1;
}

export const getReceivedPaymentMonthly = (payments) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date();
  const monthIndex = d.getMonth();
  const filteredMonths = months.filter((value, index) => index <= monthIndex);
  const paymentMonthly = [];

  filteredMonths.forEach((it) => {
    paymentMonthly.push(0);
  });

  payments.forEach((it) => {
    const index = getMonthIndex(it.created);
    paymentMonthly[index] += parseFloat(it.amount);
  });

  return { months: filteredMonths, payments: paymentMonthly };
};
