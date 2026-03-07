async function init() {
  const files = await getFileList();

  let dates = [];
  let counts = [];
  let totalWords = 0;

  // Process each file
  for (let f of files) {
    const data = await loadCSV("data/" + f);
    const dateStr = f.replace(".csv", "");

    // Format date for display
    const formattedDate = formatDateForChart(dateStr);
    dates.push(formattedDate);
    counts.push(data.length);
    totalWords += data.length;
  }

  // Update total words display
  document.getElementById('total-count').textContent = totalWords;

  // Create the chart
  new Chart(document.getElementById("statsChart"), {
    type: "line",
    data: {
      labels: dates,
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

init();