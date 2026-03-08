async function init() {
  const files = await getFileList();

  let dateCountMap = {};
  let totalWords = 0;

  // Process each file to build map
  files.forEach(f => {
    const dateStr = f.replace(".csv", "");
    dateCountMap[dateStr] = 0; // initialize, will fill later
  });

  // read files and populate counts
  for (let f of files) {
    const data = await loadCSV("data/" + f);
    const dateStr = f.replace(".csv", "");
    dateCountMap[dateStr] = data.length;
    totalWords += data.length;
  }

  // generate full date range between first and last
  const allDates = Object.keys(dateCountMap).sort();
  const startDate = parseDate(allDates[0]);
  const endDate = parseDate(allDates[allDates.length - 1]);

  let current = new Date(startDate);
  let labels = [];
  let counts = [];

  while (current <= endDate) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const key = `${y}${m}${d}`;
    labels.push(formatDateForChart(key));
    counts.push(dateCountMap[key] || 0);
    current.setDate(current.getDate() + 1);
  }

  // Update total words display
  document.getElementById('total-count').textContent = totalWords;

  // Create the chart
  new Chart(document.getElementById("statsChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Words Learned",
        data: counts,
        borderColor: "#0071e3",
        backgroundColor: "rgba(0, 113, 227, 0.1)",
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0071e3",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              return `Words: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Date",
            font: {
              size: 14,
              weight: "500"
            },
            color: "#424245"
          },
          grid: {
            color: "#f5f5f7"
          },
          ticks: {
            color: "#86868b",
            font: {
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          display: true,
          title: {
            display: true,
            text: "Words Learned",
            font: {
              size: 14,
              weight: "500"
            },
            color: "#424245"
          },
          grid: {
            color: "#f5f5f7"
          },
          ticks: {
            stepSize: 1,
            color: "#86868b",
            font: {
              size: 12
            }
          }
        }
      },
      elements: {
        point: {
          hoverBorderWidth: 3
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

function formatDateForChart(dateStr) {
  // Convert YYYYMMDD to MM/DD format
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${month}/${day}`;
}

function parseDate(dateStr) {
  const y = parseInt(dateStr.slice(0, 4));
  const m = parseInt(dateStr.slice(4, 6)) - 1;
  const d = parseInt(dateStr.slice(6, 8));
  return new Date(y, m, d);
}

init();