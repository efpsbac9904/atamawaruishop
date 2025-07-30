document.addEventListener('DOMContentLoaded', () => {
    // Lucide Iconsの初期化
    lucide.createIcons();

    // DOM要素の取得
    const subjectInput = document.getElementById('subject-input');
    const testTitleInput = document.getElementById('test-title-input');
    const previewSubject = document.getElementById('preview-subject');
    const previewTestTitle = document.getElementById('preview-test-title');
    const addSectionBtn = document.getElementById('add-section-btn');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const testBody = document.getElementById('test-body');
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const orientationRadios = document.querySelectorAll('input[name="orientation"]');
    const testSheet = document.getElementById('test-sheet');
    const exportJsonBtn = document.getElementById('export-json-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');

    let sectionCounter = 0;
    let selectedSection = null;

    // --- KaTeXのレンダリング設定 ---
    const katexOptions = {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
    };

    // ===============================================
    // 問題作成ロジック (LaTeX対応)
    // ===============================================
    addSectionBtn.addEventListener('click', () => createSection());
    addQuestionBtn.addEventListener('click', () => {
        if (!selectedSection) {
            alert('小問を追加する大問を選択してください。');
            return;
        }
        createQuestion(selectedSection);
    });
    
    function createSection(title = '', questions = []) {
        sectionCounter++;
        const section = document.createElement('div');
        section.className = 'section';
        section.innerHTML = `<input type="text" class="section-title" placeholder="大問 ${sectionCounter} のタイトルを入力" value="${title}"><div class="questions-container"></div><div class="delete-btn" title="大問を削除"><i data-lucide="trash-2" style="width:16px; height:16px;"></i></div>`;
        testBody.appendChild(section);
        lucide.createIcons();
        questions.forEach(qText => createQuestion(section, qText));
        section.addEventListener('click', (e) => { if(e.target.classList.contains('section')) selectSection(section); });
        section.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); if (confirm('この大問を削除しますか？')) { if(selectedSection === section) { selectedSection = null; addQuestionBtn.disabled = true; } section.remove(); } });
        selectSection(section);
        return section;
    }

    function createQuestion(section, text = 'クリックして編集') {
        const questionsContainer = section.querySelector('.questions-container');
        const questionCount = questionsContainer.children.length + 1;
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        // --- 表示用のdivと編集用のtextareaを管理 ---
        const contentDiv = document.createElement('div');
        contentDiv.className = 'question-content';
        contentDiv.textContent = text;
        
        questionItem.innerHTML = `<span class="q-number">(${questionCount})</span>`;
        questionItem.appendChild(contentDiv);
        questionItem.innerHTML += `<div class="delete-btn" title="小問を削除"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></div>`;
        
        questionsContainer.appendChild(questionItem);
        renderMathInElement(contentDiv, katexOptions); // KaTeXでレンダリング
        lucide.createIcons();

        // --- クリックで編集モードに切り替える ---
        questionItem.querySelector('.question-content').addEventListener('click', (e) => {
            switchToEditMode(e.target);
        });
        
        questionItem.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); questionItem.remove(); updateQuestionNumbers(questionsContainer); });
    }

    function switchToEditMode(div) {
        if (div.tagName === 'TEXTAREA') return; // すでに編集モードなら何もしない
        const text = div.textContent;
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.className = 'question-text'; // 既存のスタイルを流用
        autoResizeTextarea.call(textarea);

        div.replaceWith(textarea);
        textarea.focus();

        textarea.addEventListener('blur', () => switchToDisplayMode(textarea));
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                switchToDisplayMode(textarea);
            }
        });
    }

    function switchToDisplayMode(textarea) {
        const text = textarea.value;
        const div = document.createElement('div');
        div.className = 'question-content';
        div.textContent = text;

        textarea.replaceWith(div);
        renderMathInElement(div, katexOptions); // 再レンダリング

        // イベントリスナーを再設定
        div.addEventListener('click', (e) => switchToEditMode(e.target));
    }

    function selectSection(section) { /* ... 変更なし ... */ }
    function autoResizeTextarea() { /* ... 変更なし ... */ }
    function updateQuestionNumbers(container) { /* ... 変更なし ... */ }

    // ===============================================
    // データ収集/構築 (LaTeX対応)
    // ===============================================
    function collectDataFromPage() {
        const data = { subject: subjectInput.value, title: testTitleInput.value, orientation: document.querySelector('input[name="orientation"]:checked').value, sections: [] };
        document.querySelectorAll('.section').forEach(sectionEl => {
            const sectionData = { title: sectionEl.querySelector('.section-title').value, questions: [] };
            // .question-contentのtextContentを読めば、元のLaTeX文字列が取得できる
            sectionEl.querySelectorAll('.question-content').forEach(qEl => sectionData.questions.push(qEl.textContent));
            data.sections.push(sectionData);
        });
        return data;
    }

    function buildTestFromData(data) {
        testBody.innerHTML = '';
        sectionCounter = 0;
        selectedSection = null;
        addQuestionBtn.disabled = true;

        subjectInput.value = data.subject || '';
        testTitleInput.value = data.title || '';
        previewSubject.textContent = data.subject || '科目';
        previewTestTitle.textContent = data.title || 'テスト名';

        const orientation = data.orientation || 'portrait';
        document.getElementById(`orientation-${orientation}`).checked = true;
        testSheet.className = 'test-sheet ' + orientation;

        if (data.sections && Array.isArray(data.sections)) {
            data.sections.forEach(sectionData => {
                createSection(sectionData.title, sectionData.questions);
            });
        }
    }
    
    // 以下、インポート/エクスポート/PDF保存のロジックは変更なし
    /* ... (前回のコードと同じなので省略) ... */
    // ===============================================
    // エクスポート機能
    // ===============================================
    exportJsonBtn.addEventListener('click', () => {
        const data = collectDataFromPage();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        downloadBlob(blob, `${data.subject || '無題'}.testdata`);
    });

    exportCsvBtn.addEventListener('click', () => {
        const data = collectDataFromPage();
        const csvString = convertToCsv(data);
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, `${data.subject || '無題'}.csv`);
    });

    function convertToCsv(data) {
        const rows = [];
        const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
        rows.push(['meta', 'subject', data.subject]);
        rows.push(['meta', 'title', data.title]);
        rows.push(['meta', 'orientation', data.orientation]);
        data.sections.forEach(section => {
            rows.push(['section', section.title]);
            section.questions.forEach(question => {
                rows.push(['question', question]);
            });
        });
        return rows.map(row => row.map(escapeCsv).join(',')).join('\n');
    }
    
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===============================================
    // インポート機能
    // ===============================================
    importBtn.addEventListener('click', () => importFileInput.click());

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let data;
                if (file.name.endsWith('.csv')) {
                    data = parseCsv(e.target.result);
                } else {
                    data = JSON.parse(e.target.result);
                }
                buildTestFromData(data);
            } catch (error) {
                alert('ファイルの読み込みに失敗しました。対応する形式のファイルではありません。');
                console.error(error);
            }
        };
        reader.readAsText(file, 'UTF-8');
        event.target.value = ''; 
    });

    function parseCsv(csvText) {
        const data = { subject: '', title: '', orientation: 'portrait', sections: [] };
        let currentSection = null;
        const lines = csvText.split('\n');
        lines.forEach(line => {
            if (!line.trim()) return;
            const columns = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(col => col.replace(/^"|"$/g, '').replace(/""/g, '"'));
            const type = columns[0], value1 = columns[1], value2 = columns[2];
            switch(type) {
                case 'meta':
                    if (value1 === 'subject') data.subject = value2;
                    if (value1 === 'title') data.title = value2;
                    if (value1 === 'orientation') data.orientation = value2;
                    break;
                case 'section':
                    currentSection = { title: value1, questions: [] };
                    data.sections.push(currentSection);
                    break;
                case 'question':
                    if (currentSection) currentSection.questions.push(value1);
                    break;
            }
        });
        return data;
    }
    
    // ===============================================
    // PDF保存機能
    // ===============================================
    savePdfBtn.addEventListener('click', () => {
        const activeTextarea = document.querySelector('.question-text');
        if (activeTextarea) {
            switchToDisplayMode(activeTextarea);
        }

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => btn.style.display = 'none');
        if (selectedSection) { selectedSection.classList.remove('selected'); }
        
        const element = document.getElementById('test-sheet');
        const opt = { margin: 0, filename: `${subjectInput.value || 'テスト'}_${testTitleInput.value || '問題'}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: document.querySelector('input[name="orientation"]:checked').value } };

        html2pdf().set(opt).from(element).save().then(() => {
            deleteButtons.forEach(btn => btn.style.display = 'flex');
            if (selectedSection) { selectedSection.classList.add('selected'); }
        });
    });
});
