async function getFileList() {
  const response = await fetch("data/index.json");
  const data = await response.json();
  return data.files.sort(); // 升序排列
}

async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();
  return parseCSV(text);
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  lines.shift();

  return lines.map(line => {
    const [word, phonetic, sentence, chinese] =
      line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    return {
      word: word.replace(/"/g, ""),
      phonetic: phonetic.replace(/"/g, ""),
      sentence: sentence.replace(/"/g, ""),
      chinese: chinese.replace(/"/g, "")
    };
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}