// ... (app.js の前略)

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
        <button id="readExample" class="btn secondary-btn" style="display: none;">🔊 例文を聞く</button>
      </div>
      <button id="next" class="btn next-btn" style="display: none;">次の問題へ</button>
    </div>
  `;

  // --- 音声読み上げ関数 ---
  const speak = (text) => {
    if ('speechSynthesis' in window && text) {
        // 現在読み上げ中のものがあれば停止
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        // 英語として自然に聞こえるよう、言語を設定（'en-US'や'en-GB'など）
        utterance.lang = 'en-US'; 
        utterance.rate = 0.9; // 読み上げ速度を少しゆっくりに設定
        window.speechSynthesis.speak(utterance);
    }
  };
  // -------------------------

  // 答え合わせロジックの変更
  $("#check").onclick = () => {
    const ans = $("#answer").value.trim().toLowerCase();
    // 複数の正解に対応するため、分割してチェック（例: "りんご,リンゴ"）
    const ok = q.ja.toLowerCase().split(',').map(j => j.trim()).includes(ans); 
    const resultText = ok ? "✅ 正解！" : `❌ 不正解。正解は「${q.ja}」です。`;
    
    $("#result").textContent = resultText;
    $("#result").classList.add(ok ? 'correct' : 'incorrect');
    $("#result").classList.remove(ok ? 'incorrect' : 'correct'); // クラスを確実に切り替える
    
    // 例文を表示
    const exampleText = q.example || '例文が登録されていません。';
    $("#example").textContent = `例文: ${exampleText}`;
    
    // 答え合わせボタンを非表示にし、次の問題へボタンと読み上げボタンを表示
    $("#check").style.display = 'none';
    $("#next").style.display = 'block';

    if (q.example) {
        $("#readExample").style.display = 'inline-block';
        
        // 答え合わせ後、自動で例文を読み上げる
        speak(q.example); 
    }
  };
  
  // 読み上げボタンのイベント設定
  $("#readExample").onclick = () => {
      speak(q.example);
  };
  
  $("#next").onclick = renderLearn;
  
  // Enterキーで答え合わせができるように
  $("#answer").addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          // 答え合わせがまだの場合のみクリック
          if ($("#check").style.display !== 'none') {
             $("#check").click();
          }
      }
  });
}

// ... (renderList, renderAdd 関数が続きます)
