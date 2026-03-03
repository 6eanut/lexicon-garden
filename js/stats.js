async function init() {
  const files = ["20260303.csv"];
  let dates = [];
  let counts = [];

  for (let f of files) {
    const data = await loadCSV("data/" + f);
    dates.push(f.replace(".csv",""));
    counts.push(data.length);
  }

  new Chart(document.getElementById("statsChart"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Words Added",
        data: counts
      }]
    }
  });
}

init();