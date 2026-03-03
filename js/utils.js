async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();
  return parseCSV(text);
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  lines.shift();
  return lines.map(line => {
    const [word, sentence, chinese] = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return {
      word: word.replace(/"/g, ""),
      sentence: sentence.replace(/"/g, ""),
      chinese: chinese.replace(/"/g, "")
    };
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}