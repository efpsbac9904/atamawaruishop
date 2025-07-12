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

    let sectionCounter = 0;
    let selectedSection = null;

    // 科目・テスト名のリアルタイムプレビュー
    subjectInput.addEventListener('input', () => {
        previewSubject.textContent = subjectInput.value || '科目';
    });

    testTitleInput.addEventListener('input', () => {
        previewTestTitle.textContent = testTitleInput.value || 'テスト名';
    });

    // 用紙の向き変更
    orientationRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            testSheet.classList.toggle('portrait', e.target.value === 'portrait');
            testSheet.classList.toggle('landscape', e.target.value === 'landscape');
        });
    });

    // 大問の追加
    addSectionBtn.addEventListener('click', () => {
        sectionCounter++;
        const sectionId = `section-${Date.now()}`;
        const section = document.createElement('div');
        section.className = 'section';
        section.id = sectionId;
        section.innerHTML = `
            <input type="text" class="section-title" placeholder="大問 ${sectionCounter} のタイトルを入力">
            <div class="questions-container"></div>
            <div class="delete-btn" title="大問を削除"><i data-lucide="trash-2" style="width:16px; height:16px;"></i></div>
        `;
        testBody.appendChild(section);
        lucide.createIcons();
        
        // 大問クリックで選択
        section.addEventListener('click', () => {
            selectSection(section);
        });

        // 削除ボタンのイベントリスナー
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
    });
    
    // 小問の追加
    addQuestionBtn.addEventListener('click', () => {
        if (!selectedSection) {
            alert('小問を追加する大問を選択してください。');
            return;
        }

        const questionsContainer = selectedSection.querySelector('.questions-container');
        const questionCount = questionsContainer.children.length + 1;
        const question = document.createElement('div');
        question.className = 'question-item';
        question.innerHTML = `
            <span class="q-number">(${questionCount})</span>
            <textarea class="question-text" placeholder="問題文を入力..." rows="1"></textarea>
            <div class="delete-btn" title="小問を削除"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></div>
        `;
        questionsContainer.appendChild(question);
        lucide.createIcons();

        // テキストエリアの自動リサイズ
        const textarea = question.querySelector('textarea');
        textarea.addEventListener('input', autoResizeTextarea);

        // 削除ボタンのイベントリスナー
        question.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            question.remove();
            // 小問番号を更新
            updateQuestionNumbers(questionsContainer);
        });
    });

    // 大問を選択する関数
    function selectSection(section) {
        // 他の全てのsectionからselectedクラスを削除
        document.querySelectorAll('.section').forEach(s => s.classList.remove('selected'));
        // クリックされたsectionにselectedクラスを追加
        section.classList.add('selected');
        selectedSection = section;
        addQuestionBtn.disabled = false;
    }

    // テキストエリアを内容に応じて自動リサイズする関数
    function autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }
    
    // 小問番号を更新する関数
    function updateQuestionNumbers(container) {
        const items = container.querySelectorAll('.question-item');
        items.forEach((item, index) => {
            item.querySelector('.q-number').textContent = `(${index + 1})`;
        });
    }

    // PDFとして保存
    savePdfBtn.addEventListener('click', () => {
        // 選択状態を解除してから保存
        if(selectedSection) {
            selectedSection.classList.remove('selected');
        }
        
        const element = document.getElementById('test-sheet');
        const opt = {
            margin:       0,
            filename:     `${subjectInput.value || 'テスト'}_${testTitleInput.value || '問題'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: document.querySelector('input[name="orientation"]:checked').value }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // PDF保存後に選択状態を復元
            if(selectedSection) {
                selectedSection.classList.add('selected');
            }
        });
    });
});