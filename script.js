let wordList = [];
let currentIndex = 0;
let step = 0; // 0: 仅单词, 1: 显示例句, 2: 显示中文

async function fetchLatestWords() {
    const today = new Date();
    const displayWord = document.getElementById('display-word');
    
    // 尝试寻找最近 7 天内的文件
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // 格式化日期为 YYYYMMDD
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${y}${m}${d}`;

        try {
            // 注意：添加 ./ 确保相对路径正确
            const response = await fetch(`./data/${dateStr}.csv`);
            
            if (response.ok) {
                const text = await response.text();
                const lines = text.trim().split('\n');
                
                // 排除只有表头的情况
                if (lines.length <= 1) continue; 

                parseCSV(text);
                currentIndex = 0; // 重置索引
                renderCard();
                console.log(`成功加载数据: ${dateStr}.csv`);
                return; // 找到后立即退出循环
            }
        } catch (e) {
            console.error(`未找到 ${dateStr}.csv，继续尝试前一天...`);
        }
    }

    // 如果循环结束还没 return，说明没找到文件
    displayWord.innerText = "花园里还没有种子 (未找到近期 CSV)";
    document.getElementById('action-area').style.display = 'none';
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