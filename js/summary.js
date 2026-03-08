let allWords = [];
let groupedWords = {};

async function init() {
  const files = await getFileList();

  // Load all words from all files
  for (let file of files) {
    const words = await loadCSV("data/" + file);
    const date = file.replace('.csv', '');

    // Add date to each word
    words.forEach(word => {
      word.date = date;
    });

    allWords = allWords.concat(words);
  }

  // Group words by date (newest first)
  groupWordsByDate();
  displayWords();
}

function groupWordsByDate() {
  groupedWords = {};

  // Sort dates in descending order (newest first) using a compare function
  // to ensure correct numeric order even with string sorting.
  const dates = [...new Set(allWords.map(w => w.date))]
    .sort((a, b) => b.localeCompare(a));

  dates.forEach(date => {
    groupedWords[date] = allWords.filter(w => w.date === date);
  });
}

function displayWords() {
  const container = document.getElementById('summary-content');
  container.innerHTML = '';

  // Ensure dates are displayed in descending order (newest first)
  const sortedDates = Object.keys(groupedWords).sort((a, b) => b.localeCompare(a));

  sortedDates.forEach(date => {
    const dateSection = document.createElement('div');
    dateSection.className = 'date-section';

    const dateHeader = document.createElement('h2');
    dateHeader.className = 'date-header';
    dateHeader.textContent = formatDate(date);
    dateSection.appendChild(dateHeader);

    const wordsList = document.createElement('div');
    wordsList.className = 'words-list';

    groupedWords[date].forEach(word => {
      const wordCard = document.createElement('div');
      wordCard.className = 'word-card';

      const wordLine = document.createElement('div');
      wordLine.className = 'word-line';
      wordLine.innerHTML = `<span class="word-text">${word.word}</span><span class="phonetic">${word.phonetic}</span>`;
      wordCard.appendChild(wordLine);

      const sentenceLine = document.createElement('div');
      sentenceLine.className = 'sentence-line';
      sentenceLine.textContent = word.sentence;
      wordCard.appendChild(sentenceLine);

      const meaningLine = document.createElement('div');
      meaningLine.className = 'meaning-line';
      meaningLine.textContent = word.chinese;
      wordCard.appendChild(meaningLine);

      wordsList.appendChild(wordCard);
    });

    dateSection.appendChild(wordsList);
    container.appendChild(dateSection);
  });
}

function formatDate(dateStr) {
  // Convert YYYYMMDD to readable format
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function shuffleWords() {
  Object.keys(groupedWords).forEach(date => {
    // Shuffle words within each date group
    groupedWords[date] = shuffle(groupedWords[date]);
  });
  displayWords();
}

// Event listeners
document.getElementById('shuffle-btn').onclick = shuffleWords;

init();