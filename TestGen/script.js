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
        
        section.addEventListener('click', () => {
            selectSection(section);
        });

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

        const textarea = question.querySelector('textarea');
        textarea.addEventListener('input', autoResizeTextarea);

        question.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            question.remove();
            updateQuestionNumbers(questionsContainer);
        });
    });

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

    // --- ここからが修正箇所 ---
    // PDFとして保存
    savePdfBtn.addEventListener('click', () => {
        // 0. PDFに出力したくない要素をすべて取得
        const deleteButtons = document.querySelectorAll('.delete-btn');

        // 1. PDF生成前に、編集用のUIを一時的に非表示にする
        deleteButtons.forEach(btn => btn.style.display = 'none');
        if (selectedSection) {
            selectedSection.classList.remove('selected');
        }
        
        // 2. PDFを生成
        const element = document.getElementById('test-sheet');
        const opt = {
            margin:       0,
            filename:     `${subjectInput.value || 'テスト'}_${testTitleInput.value || '問題'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: document.querySelector('input[name="orientation"]:checked').value }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // 3. PDF生成が終わったら、非表示にしたUIを元に戻す
            deleteButtons.forEach(btn => btn.style.display = 'flex'); // 元のdisplayプロパティに戻す
            if (selectedSection) {
                selectedSection.classList.add('selected');
            }
        });
    });
    // --- ここまでが修正箇所 ---
});
