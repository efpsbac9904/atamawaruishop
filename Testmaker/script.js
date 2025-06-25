document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const extractKanjiBtn = document.getElementById('extract-kanji-btn');
    const kanjiListDiv = document.getElementById('kanji-list');
    const generateTestBtn = document.getElementById('generate-test-btn');
    const testOutputDiv = document.getElementById('test-output');
    const printTestBtn = document.getElementById('print-test-btn');

    let extractedKanji = []; // 抽出されたユニークな漢字を保存する配列

    // 漢字抽出ボタンのクリックイベント
    extractKanjiBtn.addEventListener('click', () => {
        const text = textInput.value;
        // 日本語の漢字をマッチさせる正規表現（常用漢字以外も含む広範囲な漢字を対象）
        const kanjiRegex = /[\u4E00-\u9FFF]/g;
        const foundKanji = text.match(kanjiRegex);

        kanjiListDiv.innerHTML = ''; // 既存の漢字リストをクリア
        extractedKanji = []; // 抽出された漢字リストをリセット

        if (foundKanji) {
            // 重複を排除し、ユニークな漢字のみを抽出
            const uniqueKanji = [...new Set(foundKanji)];
            extractedKanji = uniqueKanji;

            uniqueKanji.forEach(kanji => {
                const kanjiItem = document.createElement('div');
                kanjiItem.className = 'kanji-item';
                kanjiItem.innerHTML = `
                    <input type="checkbox" id="kanji-${kanji}" value="${kanji}">
                    <label for="kanji-${kanji}">${kanji}</label>
                `;
                kanjiListDiv.appendChild(kanjiItem);
            });
            generateTestBtn.disabled = false; // 漢字が抽出されたらテスト生成ボタンを有効化
        } else {
            kanjiListDiv.innerHTML = '<p>漢字が見つかりませんでした。</p>';
            generateTestBtn.disabled = true;
        }
        testOutputDiv.innerHTML = ''; // テストプレビューをクリア
        printTestBtn.disabled = true; // 印刷ボタンを無効化
    });

    // テスト生成ボタンのクリックイベント
    generateTestBtn.addEventListener('click', () => {
        const selectedKanji = Array.from(kanjiListDiv.querySelectorAll('input[type="checkbox"]:checked'))
                                 .map(checkbox => checkbox.value);

        if (selectedKanji.length === 0) {
            testOutputDiv.innerHTML = '<p>問題にする漢字を選択してください。</p>';
            printTestBtn.disabled = true;
            return;
        }

        let testContent = '<h2>漢字テスト</h2>\n\n';

        // 読み問題セクション
        testContent += '<h3>■ 読み問題</h3>\n';
        selectedKanji.forEach((kanji, index) => {
            testContent += `${index + 1}. ${kanji} （　　　　　　　　　　）\n`;
        });
        testContent += '\n\n'; // 問題と問題の間に十分なスペース

        // 書き問題セクション
        testContent += '<h3>■ 書き問題</h3>\n';
        selectedKanji.forEach((kanji, index) => {
            // ここでは漢字の「読み」を自動で取得することはできないため、
            // 空欄と漢字を並べる形式にします。
            // 例: 「かんじ」と読む漢字を書きなさい。
            // 正しい読みを自動で割り当てるにはサーバーサイドの辞書などが必要になります。
            // シンプルな構成のため、ここでは漢字の横に空欄を設ける形にします。
            testContent += `${index + 1}. 【　　　　】と読む漢字を書きなさい。　（　${kanji}　）\n`;
        });
        testContent += '\n\n'; // 問題と問題の間に十分なスペース

        // 解答欄
        testContent += '<h3>■ 解答欄</h3>\n';
        selectedKanji.forEach((kanji, index) => {
            testContent += `${index + 1}. ${kanji}\n`;
        });
        testContent += '\n\n';

        testOutputDiv.innerHTML = testContent;
        printTestBtn.disabled = false; // テストが生成されたら印刷ボタンを有効化
    });

    // 印刷ボタンのクリックイベント
    printTestBtn.addEventListener('click', () => {
        // window.print() を呼び出すと、ブラウザの印刷ダイアログが表示されます
        window.print();
    });
});
