let words = [];
let currentIndex = 0;

async function init() {
  const files = await getFileList();

  if (files.length === 0) {
    alert("No data files found.");
    return;
  }

  const latest = files.sort().reverse()[0];
  words = await loadCSV("data/" + latest);

  showWord();
}

function showWord() {
  const w = words[currentIndex];
  document.getElementById("word").innerText = w.word;
  document.getElementById("sentence").classList.add("hidden");
  document.getElementById("meaning").classList.add("hidden");
}

document.getElementById("remember").onclick = nextWord;

document.getElementById("forget").onclick = () => {
  const sentence = document.getElementById("sentence");
  const meaning = document.getElementById("meaning");

  if (sentence.classList.contains("hidden")) {
    sentence.innerText = words[currentIndex].sentence;
    sentence.classList.remove("hidden");
  } else {
    meaning.innerText = words[currentIndex].chinese;
    meaning.classList.remove("hidden");
  }
};

function nextWord() {
  currentIndex++;
  if (currentIndex < words.length) {
    showWord();
  } else {
    alert("Finished!");
  }
}

init();