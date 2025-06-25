document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const textInput = document.getElementById('text-input');
    const extractKanjiBtn = document.getElementById('extract-kanji-btn');
    const manualTextInput = document.getElementById('manual-text-input');
    const manualTargetKanjiInput = document.getElementById('manual-target-kanji-input');
    const manualYomiInput = document.getElementById('manual-yomi-input');
    const addProblemBtn = document.getElementById('add-problem-btn');
    const problemItemsListDiv = document.getElementById('problem-items-list');
    const generateTestBtn = document.getElementById('generate-test-btn');
    const testOutputDiv = document.getElementById('test-output');
    const printTestBtn = document.getElementById('print-test-btn');

    // 問題形式ラジオボタン
    const readingOnlyRadio = document.getElementById('reading-only');
    const writingOnlyRadio = document.getElementById('writing-only');
    const bothTypesRadio = document.getElementById('both-types');

    // 抽出・追加された問題アイテムを保存する配列
    // 各アイテムは { id: string, text: string, targetKanji: string, yomi: string, type: 'auto' | 'manual' } の形式
    let problemItems = [];

    // --- ヘルパー関数 ---

    // ユニークなIDを生成
    const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

    // 問題アイテムリストをUIに表示する関数
    const renderProblemItems = () => {
        problemItemsListDiv.innerHTML = ''; // 既存のリストをクリア

        if (problemItems.length === 0) {
            problemItemsListDiv.innerHTML = '<p class="placeholder-text" style="text-align: center; color: #888; padding: 20px;">問題にする漢字が見つかりません。文章を入力するか、手動で追加してください。</p>';
            generateTestBtn.disabled = true;
            return;
        }

        problemItems.forEach(item => {
            const kanjiItemDiv = document.createElement('div');
            kanjiItemDiv.className = 'kanji-item';
            kanjiItemDiv.dataset.id = item.id; // データIDを設定

            // チェックボックスと表示漢字
            const checkboxContainer = document.createElement('label');
            checkboxContainer.innerHTML = `
                <input type="checkbox" id="item-${item.id}" value="${item.id}" checked>
                <span class="kanji-display">${item.targetKanji}</span>
            `;
            // チェックボックスの状態変更時にテスト生成ボタンの状態を更新
            checkboxContainer.querySelector('input[type="checkbox"]').addEventListener('change', () => {
                updateGenerateButtonState();
            });

            // 読み入力欄
            const yomiInput = document.createElement('input');
            yomiInput.type = 'text';
            yomiInput.className = 'yomi-input';
            yomiInput.placeholder = '読みを入力 (例: かんじ)';
            yomiInput.value = item.yomi || ''; // 既存の読みがあれば表示
            yomiInput.dataset.id = item.id; // データIDを設定

            // 読み入力欄の変更イベント
            yomiInput.addEventListener('input', (e) => {
                // 該当するアイテムの読みを更新
                const itemId = e.target.dataset.id;
                const itemToUpdate = problemItems.find(i => i.id === itemId);
                if (itemToUpdate) {
                    itemToUpdate.yomi = e.target.value;
                }
            });

            kanjiItemDiv.appendChild(checkboxContainer);
            kanjiItemDiv.appendChild(yomiInput);
            problemItemsListDiv.appendChild(kanjiItemDiv);
        });
        updateGenerateButtonState(); // 初期表示後にボタン状態を更新
    };

    // テスト生成ボタンの有効/無効を更新する関数
    const updateGenerateButtonState = () => {
        const selectedCount = problemItemsListDiv.querySelectorAll('input[type="checkbox"]:checked').length;
        generateTestBtn.disabled = selectedCount === 0;
    };

    // --- イベントリスナー ---

    // 漢字抽出ボタンのクリックイベント
    extractKanjiBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text.trim()) {
            testOutputDiv.innerHTML = '<p class="placeholder-text">文章を入力してください。</p>';
            printTestBtn.disabled = true;
            problemItems = []; // 空にする
            renderProblemItems();
            return;
        }

        // 日本語の漢字をマッチさせる正規表現
        const kanjiRegex = /[\u4E00-\u9FFF々ヶ〆]/g; // 常用漢字以外も含む
        const sentences = text.split(/[\n。？！．]/).filter(s => s.trim() !== ''); // 改行や句読点で文を区切る

        problemItems = []; // リセット

        sentences.forEach(sentence => {
            const foundKanji = sentence.match(kanjiRegex);
            if (foundKanji) {
                // 重複を排除し、ユニークな漢字のみを抽出
                const uniqueKanjiInSentence = [...new Set(foundKanji)];
                uniqueKanjiInSentence.forEach(kanji => {
                    // 同じtargetKanjiとtextの組み合わせは追加しない
                    const exists = problemItems.some(item =>
                        item.targetKanji === kanji && item.text === sentence && item.type === 'auto'
                    );
                    if (!exists) {
                        problemItems.push({
                            id: generateUniqueId(),
                            text: sentence.trim(), // 文全体を問題文として保持
                            targetKanji: kanji,
                            yomi: '', // 読みは手動で入力
                            type: 'auto' // 自動抽出
                        });
                    }
                });
            }
        });

        testOutputDiv.innerHTML = '<p class="placeholder-text">問題にする漢字を選択し、「テストを生成」ボタンを押してください。</p>';
        printTestBtn.disabled = true;
        renderProblemItems(); // リストを再描画
    });

    // 問題追加ボタンのクリックイベント (手動追加)
    addProblemBtn.addEventListener('click', () => {
        const text = manualTextInput.value.trim();
        const targetKanji = manualTargetKanjiInput.value.trim();
        const yomi = manualYomiInput.value.trim();

        if (!text || !targetKanji) {
            // alert() の代わりに、カスタムメッセージを表示
            testOutputDiv.innerHTML = '<p class="placeholder-text" style="color: red;">問題文と問題にする漢字/熟語は必須です。</p>';
            return;
        }

        // 同じtargetKanjiとtextの組み合わせは追加しない
        const exists = problemItems.some(item =>
            item.targetKanji === targetKanji && item.text === text && item.type === 'manual'
        );
        if (exists) {
            testOutputDiv.innerHTML = '<p class="placeholder-text" style="color: orange;">その問題は既に追加されています。</p>';
            return;
        }

        problemItems.push({
            id: generateUniqueId(),
            text: text,
            targetKanji: targetKanji,
            yomi: yomi,
            type: 'manual' // 手動追加
        });

        // 入力フィールドをクリア
        manualTextInput.value = '';
        manualTargetKanjiInput.value = '';
        manualYomiInput.value = '';

        testOutputDiv.innerHTML = '<p class="placeholder-text">問題にする漢字を選択し、「テストを生成」ボタンを押してください。</p>';
        printTestBtn.disabled = true;
        renderProblemItems(); // リストを再描画
    });


    // テスト生成ボタンのクリックイベント
    generateTestBtn.addEventListener('click', () => {
        const selectedItemIds = Array.from(problemItemsListDiv.querySelectorAll('input[type="checkbox"]:checked'))
                                 .map(checkbox => checkbox.value);

        if (selectedItemIds.length === 0) {
            testOutputDiv.innerHTML = '<p class="placeholder-text">問題にする漢字を選択してください。</p>';
            printTestBtn.disabled = true;
            return;
        }

        // 選択されたアイテムオブジェクトを取得
        const selectedItems = problemItems.filter(item => selectedItemIds.includes(item.id));

        let testContent = '<h2>漢字テスト</h2>\n\n';
        let answerContent = '<h2>漢字テスト 解答</h2>\n\n';

        const testType = document.querySelector('input[name="testType"]:checked').value;

        // 読み問題セクション
        if (testType === 'reading' || testType === 'both') {
            testContent += '<h3>■ 読み問題</h3>\n';
            answerContent += '<h3>■ 読み問題 解答</h3>\n';
            selectedItems.forEach((item, index) => {
                // 問題文中のtargetKanjiを強調表示（下線）
                const problemSentence = item.text.replace(
                    new RegExp(item.targetKanji, 'g'),
                    `<u>${item.targetKanji}</u>`
                );
                testContent += `${index + 1}. ${problemSentence} （　　　　　　　　　　）\n`;
                answerContent += `${index + 1}. ${item.targetKanji} : ${item.yomi || '（読み不明）'}\n`;
            });
            testContent += '\n\n';
            answerContent += '\n\n';
        }

        // 書き問題セクション
        if (testType === 'writing' || testType === 'both') {
            testContent += '<h3>■ 書き問題</h3>\n';
            answerContent += '<h3>■ 書き問題 解答</h3>\n';
            selectedItems.forEach((item, index) => {
                const yomiForProblem = item.yomi ? `「${item.yomi}」` : '【読み】'; // 読みがあれば使用、なければ汎用
                // 問題文中のtargetKanjiを空欄（下線）に置き換え
                const problemSentence = item.text.replace(
                    new RegExp(item.targetKanji, 'g'),
                    `（　　　　　　　　）`
                );
                testContent += `${index + 1}. ${problemSentence} (${yomiForProblem}と読む漢字を書きなさい。)\n`;
                answerContent += `${index + 1}. ${item.targetKanji} : ${item.yomi || '（読み不明）'}\n`;
            });
            testContent += '\n\n';
            answerContent += '\n\n';
        }

        // 全体の解答欄を追加
        testContent += '<div style="page-break-before: always;"></div>'; // 印刷時の改ページ
        testContent += answerContent;

        testOutputDiv.innerHTML = testContent;
        printTestBtn.disabled = false; // テストが生成されたら印刷ボタンを有効化
    });

    // 印刷ボタンのクリックイベント
    printTestBtn.addEventListener('click', () => {
        window.print(); // ブラウザの印刷ダイアログを表示
    });

    // 初期状態のセットアップ
    renderProblemItems(); // ページ読み込み時にリストを初期表示

    // 初期化時にテスト出力エリアのプレースホルダーを表示
    testOutputDiv.innerHTML = '<p class="placeholder-text">問題文を入力して漢字を抽出するか、手動で問題を追加してください。</p>';
});

