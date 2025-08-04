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
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const body = document.body;
    // --- 新しい要素 ---
    const copyCsvBtn = document.getElementById('copy-csv-btn');
    const pasteCsvBtn = document.getElementById('paste-csv-btn');


    let sectionCounter = 0;
    let selectedSection = null;

    const katexOptions = { /* ... 変更なし ... */ delimiters: [ {left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}, {left: '\\(', right: '\\)', display: false}, {left: '\\[', right: '\\]', display: true} ], throwOnError: false };

    // ===============================================
    // サイドバー制御
    // ===============================================
    toggleSidebarBtn.addEventListener('click', () => {
        body.classList.toggle('sidebar-hidden');
        updateToggleButtonIcon();
    });

    function updateToggleButtonIcon() {
        const icon = toggleSidebarBtn.querySelector('i');
        if (body.classList.contains('sidebar-hidden')) {
            icon.setAttribute('data-lucide', 'panel-left-open');
        } else {
            icon.setAttribute('data-lucide', 'panel-left-close');
        }
        lucide.createIcons();
    }

    if (window.innerWidth <= 768) {
        body.classList.add('sidebar-hidden');
    }
    updateToggleButtonIcon();
    
    // ===============================================
    // ★★★★★ クリップボード機能 ★★★★★
    // ===============================================
    copyCsvBtn.addEventListener('click', () => {
        try {
            const data = collectDataFromPage();
            const csvString = convertToCsv(data);

            navigator.clipboard.writeText(csvString).then(() => {
                // 成功時のフィードバック
                const originalText = copyCsvBtn.innerHTML;
                copyCsvBtn.innerHTML = `<i data-lucide="check"></i>コピーしました!`;
                lucide.createIcons();
                setTimeout(() => {
                    copyCsvBtn.innerHTML = originalText;
                    lucide.createIcons();
                }, 2000);
            }, () => {
                alert('クリップボードへのコピーに失敗しました。');
            });
        } catch (error) {
            alert('データの変換に失敗しました。');
            console.error(error);
        }
    });

    pasteCsvBtn.addEventListener('click', () => {
        navigator.clipboard.readText().then(text => {
            if (!text) {
                alert('クリップボードが空です。');
                return;
            }
            try {
                const data = parseCsv(text);
                buildTestFromData(data);
            } catch (error) {
                alert('クリップボードのデータ形式が正しくありません。');
                console.error(error);
            }
        }).catch(err => {
            alert('クリップボードの読み取りに失敗しました。ブラウザの権限を確認してください。');
            console.error('Clipboard read failed: ', err);
        });
    });


    // ===============================================
    // 問題作成ロジック (変更なし)
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
        
        section.addEventListener('click', () => selectSection(section));
        section.querySelector('.delete-btn').addEventListener('click', (e) => { 
            e.stopPropagation();
            if (confirm('この大問を削除しますか？')) { 
                if(selectedSection === section) { 
                    selectedSection = null; 
                    addQuestionBtn.disabled = true; 
                } 
                section.remove(); 
            } 
        });
        selectSection(section);
        return section;
    }

    function createQuestion(section, text = 'クリックして編集') {
        const questionsContainer = section.querySelector('.questions-container');
        const questionCount = questionsContainer.children.length + 1;
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        const qNumberSpan = document.createElement('span');
        qNumberSpan.className = 'q-number';
        qNumberSpan.textContent = `(${questionCount})`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'question-content';
        contentDiv.textContent = text;

        const deleteBtnDiv = document.createElement('div');
        deleteBtnDiv.className = 'delete-btn';
        deleteBtnDiv.title = '小問を削除';
        deleteBtnDiv.innerHTML = `<i data-lucide="trash-2" style="width:14px; height:14px;"></i>`;

        questionItem.appendChild(qNumberSpan);
        questionItem.appendChild(contentDiv);
        questionItem.appendChild(deleteBtnDiv);
        
        questionsContainer.appendChild(questionItem);
        
        renderMathInElement(contentDiv, katexOptions);
        lucide.createIcons();

        contentDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            switchToEditMode(e.currentTarget);
        });
        
        deleteBtnDiv.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            questionItem.remove(); 
            updateQuestionNumbers(questionsContainer); 
        });
    }

    function switchToEditMode(div) {
        if (div.tagName === 'TEXTAREA') return;
        const text = div.textContent;
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.className = 'question-text';
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
        renderMathInElement(div, katexOptions);

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            switchToEditMode(e.currentTarget);
        });
    }

    function selectSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('selected'));
        section.classList.add('selected');
        selectedSection = section;
        addQuestionBtn.disabled = false;
    }

    function autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    function updateQuestionNumbers(container) {
        const items = container.querySelectorAll('.question-item');
        items.forEach((item, index) => {
            item.querySelector('.q-number').textContent = `(${index + 1})`;
        });
    }

    function collectDataFromPage() {
        const data = { subject: subjectInput.value, title: testTitleInput.value, orientation: document.querySelector('input[name="orientation"]:checked').value, sections: [] };
        document.querySelectorAll('.section').forEach(sectionEl => {
            const sectionData = { title: sectionEl.querySelector('.section-title').value, questions: [] };
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
    
    // ===============================================
    // ファイル入出力 (エクスポート先をJSONのみに変更)
    // ===============================================
    exportJsonBtn.addEventListener('click', () => {
        const data = collectDataFromPage();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        downloadBlob(blob, `${data.subject || '無題'}.testdata`);
    });

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

    function parseCsv(csvText) {
        const data = { subject: '', title: '', orientation: 'portrait', sections: [] };
        let currentSection = null;
        const lines = csvText.split('\n');
        lines.forEach(line => {
            if (!line.trim()) return;
            // 修正：より堅牢なCSVパース
            const columns = (line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []).map(col => col.replace(/^"|"$/g, '').replace(/""/g, '"'));
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
    // PDF保存機能 (変更なし)
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
        const opt = { 
            margin: 0, 
            filename: `${subjectInput.value || 'テスト'}_${testTitleInput.value || '問題'}.pdf`, 
            image: { type: 'jpeg', quality: 0.98 }, 
            html2canvas: { scale: 2, useCORS: true, letterRendering: true }, 
            jsPDF: { unit: 'mm', format: 'a4', orientation: document.querySelector('input[name="orientation"]:checked').value } 
        };

        html2pdf().set(opt).from(element).save().then(() => {
            deleteButtons.forEach(btn => btn.style.display = 'flex');
            if (selectedSection) { selectedSection.classList.add('selected'); }
        });
    });
});

