let wordList = [];
let currentIndex = 0;
let step = 0; // 0: 仅单词, 1: 显示例句, 2: 显示中文

// 自动寻找最近一天的文件
async function fetchLatestWords() {
    const today = new Date();
    // 尝试寻找最近7天内的文件
    for(let i=0; i<7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        try {
            const response = await fetch(`data/${dateStr}.csv`);
            if (response.ok) {
                const text = await response.text();
                parseCSV(text);
                renderCard();
                return;
            }
        } catch (e) { continue; }
    }
    document.getElementById('display-word').innerText = "未找到近期词库";
}

function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    wordList = lines.slice(1).map(line => {
        const [word, sentence, chinese] = line.split(',');
        return { word, sentence, chinese };
    });
}

function renderCard() {
    if (currentIndex >= wordList.length) {
        document.getElementById('card-container').innerHTML = "<h2 class='text-2xl font-bold'>🎉 完成复习!</h2>";
        return;
    }
    const current = wordList[currentIndex];
    const displayWord = document.getElementById('display-word');
    const displayExtra = document.getElementById('display-extra');
    
    displayWord.innerText = current.word;
    
    if (step === 0) {
        displayExtra.classList.add('opacity-0');
        displayExtra.innerText = "";
    } else if (step === 1) {
        displayExtra.innerText = current.sentence;
        displayExtra.classList.remove('opacity-0');
    } else if (step === 2) {
        displayExtra.innerText = `${current.sentence}\n\n${current.chinese}`;
        displayExtra.classList.remove('opacity-0');
    }
    
    document.getElementById('progress').innerText = `${currentIndex + 1} / ${wordList.length}`;
}

function handleKnown(known) {
    if (known) {
        currentIndex++;
        step = 0;
        renderCard();
    } else {
        if (step < 2) {
            step++;
            renderCard();
        } else {
            // 如果到了中文还不记得，强制进入下一个，但你可以增加错题标记逻辑
            currentIndex++;
            step = 0;
            renderCard();
        }
    }
}

// 随机测试功能
function startRandomTest() {
    // 这里简化处理：实际需要遍历data目录下所有文件。
    // 建议：GitHub Pages 环境下，你可能需要一个 index.json 来记录有哪些 CSV。
    alert("随机测试功能需结合后端索引或固定文件名列表实现。");
}

window.onload = fetchLatestWords;