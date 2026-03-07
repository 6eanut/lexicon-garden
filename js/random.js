let words = [];
let currentIndex = 0;

async function init() {
  const files = await getFileList();

  let allWords = [];

  for (let f of files) {
    const data = await loadCSV("data/" + f);
    allWords = allWords.concat(data);
  }

  words = shuffle(allWords).slice(0, 20);

  showWord();
}

function showWord() {
  const w = words[currentIndex];
  document.getElementById("word").innerText = w.word;
  document.getElementById("phonetic").innerText = w.phonetic;
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
    alert("Test Completed!");
  }
}

init();