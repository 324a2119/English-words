const KEY = "vocab_words_v1";
let words = JSON.parse(localStorage.getItem(KEY) || "[]");
const $ = (s) => document.querySelector(s);
const view = $("#view");

// 初回ロード時
if (words.length === 0) {
  fetch("words.json")
    .then(r => r.json())
    .then(d => { words = d; save(); renderLearn(); });
} else {
  renderLearn();
}
function save() { localStorage.setItem(KEY, JSON.stringify(words)); }

$("#modeLearn").onclick = renderLearn;
$("#modeList").onclick = renderList;
$("#modeAdd").onclick = renderAdd;

function renderLearn() {
  if (words.length === 0) return view.innerHTML = "<p>単語がありません</p>";
  const q = words[Math.floor(Math.random() * words.length)];
  view.innerHTML = `
    <div class="card">
      <h2 class="word-en">${q.en}</h2>
      <div class="answer-section">
        <input id="answer" placeholder="答えは？" class="input-text" />
        <button id="check" class="btn primary-btn">答え合わせ</button>
      </div>
      <div id="result-area" class="result-area">
        <p id="result" class="result-message"></p>
        <p id="example" class="example-text"></p>
      </div>
      <button id="next" class="btn next-btn" style="display: none;">次の問題へ</button>
    </div>
  `;

  // 答え合わせロジック
  $("#check").onclick = () => {
    const ans = $("#answer").value.trim().toLowerCase();
    // 複数の正解に対応（カンマ区切りでチェック）
    const ok = q.ja.toLowerCase().split(',').map(j => j.trim()).includes(ans);
    const resultText = ok ? "✅ 正解！" : `❌ 不正解。正解は「${q.ja}」です。`;
    
    $("#result").textContent = resultText;
    $("#result").classList.add(ok ? 'correct' : 'incorrect');
    $("#result").classList.remove(ok ? 'incorrect' : 'correct');

    // 例文を表示する機能は残します
    const exampleText = q.example || '例文が登録されていません。';
    $("#example").textContent = `例文: ${exampleText}`;
    
    // UIの切り替え
    $("#check").style.display = 'none';
    $("#next").style.display = 'block';
  };
  
  $("#next").onclick = renderLearn;
  
  // Enterキーで答え合わせができるように
  $("#answer").addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          // 答え合わせボタンが非表示でなければクリック
          if ($("#check").style.display !== 'none') {
             $("#check").click();
          }
      }
  });
}

function renderList() {
  view.innerHTML = `
    <div class="card list-view">
      <h2>単語リスト</h2>
      <ul class="word-list">
      ${words.map(w => `
        <li>
          <span class="word-en-list">${w.en}</span> - 
          <span class="word-ja-list">${w.ja}</span>
          ${w.example ? `<span class="word-example-list">(${w.example})</span>` : ''}
        </li>
      `).join("")}
      </ul>
    </div>
  `;
}

function renderAdd() {
  view.innerHTML = `
    <div class="card add-form">
      <h2>単語追加</h2>
      <input id="en" placeholder="英語 (必須)" class="input-text" />
      <input id="ja" placeholder="日本語 (必須)" class="input-text" />
      <input id="example" placeholder="例文 (任意)" class="input-text" />
      <button id="add" class="btn success-btn">リストに追加</button>
    </div>
  `;
  
  $("#add").onclick = () => {
    const en = $("#en").value.trim();
    const ja = $("#ja").value.trim();
    const example = $("#example").value.trim();
    
    if (!en || !ja) {
        alert("英語と日本語は必須です。");
        return;
    }
    
    words.push({ en: en, ja: ja, example: example });
    save();
    alert(`「${en}」を追加しました！`);
    renderList();
  };
}
