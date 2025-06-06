// ====================================================================
// ★★★ ここからが修正点: グローバル定数と関数定義の順序を整理しました ★★★
// ====================================================================

// Supabaseプロジェクトの情報をここに反映済み
const SUPABASE_URL = 'https://vmsffshqmgerqjmmwwvh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtc2Zmc2hxbWdlcnFqbW13d3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjI4ODAsImV4cCI6MjA2NDIzODg4MH0.xxHCh9IXqvVkqUkzgEqk9Vbtso-EQDDPEvgwgf5S9G4';

// Supabaseクライアントの初期化関数は、その呼び出しより前に定義される必要がある
function createClient(supabaseUrl, supabaseKey) {
    // グローバルにSupabaseが利用可能かチェック
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.error("Supabaseライブラリが読み込まれていません。index.htmlで<script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script>が正しく設定されているか確認してください。");
        return null;
    }
    return window.supabase.createClient(supabaseUrl, supabaseKey);
}

// createClient関数が定義された後で、その関数を呼び出し、supabaseクライアントを初期化する
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// supabaseクライアントが正しく初期化されていない場合は処理を中断
if (!supabase) {
    console.error("Supabaseクライアントの初期化に失敗しました。処理を中断します。");
    const postsList = document.getElementById('posts-list');
    if (postsList) {
        postsList.innerHTML = '<p style="color: red;">掲示板機能が利用できません。管理者にSupabaseの設定を確認するよう連絡してください。</p>';
    }
    const submitPostButton = document.getElementById('submit-post');
    if (submitPostButton) {
        submitPostButton.disabled = true;
    }
    throw new Error("Supabase initialization failed."); // これで以降のスクリプト実行を停止
}

// ====================================================================
// ★★★ 修正点終わり ★★★
// ====================================================================


const tableNameInput = document.getElementById('table-name-input'); // テーブル名入力フィールド
const postUsernameInput = document.getElementById('post-username');
const postContentInput = document.getElementById('post-content');
const submitPostButton = document.getElementById('submit-post');
const postsList = document.getElementById('posts-list');

// カスタムモーダル要素の取得
const customModalOverlay = document.getElementById('custom-modal-overlay');
const customModal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalOkButton = document.getElementById('modal-ok-button');
const modalCancelButton = document.getElementById('modal-cancel-button');

/**
 * カスタムモーダルを表示する関数
 * @param {string} message - 表示するメッセージ
 * @param {boolean} isConfirm - 確認ダイアログかどうか (true: OK/Cancelボタン, false: OKボタンのみ)
 * @returns {Promise<boolean>} - OKがクリックされたらtrue、キャンセルがクリックされたらfalseを解決するPromise
 */
function showCustomModal(message, isConfirm = false) {
    return new Promise(resolve => {
        modalMessage.textContent = message;
        modalCancelButton.style.display = isConfirm ? 'inline-block' : 'none'; // isConfirmがtrueならCancelボタンを表示

        customModalOverlay.classList.add('active');
        customModal.classList.add('active');

        // イベントリスナーを一度だけ設定し、解決時に削除する
        const handleOk = () => {
            customModalOverlay.classList.remove('active');
            customModal.classList.remove('active');
            modalOkButton.removeEventListener('click', handleOk);
            modalCancelButton.removeEventListener('click', handleCancel);
            resolve(true);
        };

        const handleCancel = () => {
            customModalOverlay.classList.remove('active');
            customModal.classList.remove('active');
            modalOkButton.removeEventListener('click', handleOk);
            modalCancelButton.removeEventListener('click', handleCancel);
            resolve(false);
        };

        modalOkButton.addEventListener('click', handleOk);
        modalCancelButton.addEventListener('click', handleCancel);

        // オーバーレイクリックでキャンセルできるようにする（isConfirmの場合のみ）
        const handleOverlayClick = (event) => {
            if (event.target === customModalOverlay && isConfirm) {
                handleCancel();
            }
        };
        customModalOverlay.addEventListener('click', handleOverlayClick);
        // Promise解決時にオーバーレイのイベントリスナーも削除
        customModalOverlay.removeEventListener('click', handleOverlayClick);
    });
}


// 投稿をロードする関数
async function loadPosts() {
    const tableName = tableNameInput.value.trim(); // 現在のテーブル名を取得
    if (!tableName) {
        postsList.innerHTML = '<p style="color: orange;">テーブル名を入力してください。</p>';
        return;
    }

    postsList.innerHTML = '<p>投稿を読み込み中...</p>';
    const { data, error } = await supabase
        .from(tableName) // 動的にテーブル名を指定
        .select('*')
        .order('created_at', { ascending: false }); // 新しい投稿が上にくるように並べ替え

    if (error) {
        console.error('投稿の読み込み中にエラーが発生しました:', error.message);
        postsList.innerHTML = `<p style="color: red;">投稿の読み込みに失敗しました: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        postsList.innerHTML = '<p>まだ投稿がありません。</p>';
        return;
    }

    postsList.innerHTML = ''; // 既存のメッセージをクリア
    data.forEach(post => {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';

        const username = post.username || 'ななっしんぐ'; // 名前がなければ「匿名」と表示
        const date = new Date(post.created_at).toLocaleString('ja-JP');

        // ★★★ 修正点: 削除ボタンを追加し、data-id属性に投稿のIDを持たせる ★★★
        postItem.innerHTML = `
            <div class="post-content-wrapper">
                <div class="post-meta">
                    <strong>${username}</strong> <span class="timestamp">${date}</span>
                </div>
                <div class="post-content">${post.content}</div>
            </div>
            <button class="delete-button delete-post-btn" data-id="${post.id}">削除</button>
        `;
        postsList.appendChild(postItem);
    });

    // ★★★ 追加点: 削除ボタンにイベントリスナーを設定する ★★★
    document.querySelectorAll('.delete-post-btn').forEach(button => {
        button.addEventListener('click', handleDeletePost);
    });
}

// 投稿を送信する関数
submitPostButton.addEventListener('click', async () => {
    const tableName = tableNameInput.value.trim(); // 現在のテーブル名を取得
    if (!tableName) {
        await showCustomModal('テーブル名を入力してください！');
        return;
    }

    const username = postUsernameInput.value.trim();
    const content = postContentInput.value.trim();

    if (!content) {
        await showCustomModal('メッセージを入力してください！');
        return;
    }

    submitPostButton.disabled = true; // 二重投稿防止
    submitPostButton.textContent = '投稿中...';

    const { data, error } = await supabase
        .from(tableName) // 動的にテーブル名を指定
        .insert([
            { username: username || null, content: content } // 名前が空ならnullを送信
        ]);

    if (error) {
        console.error('投稿中にエラーが発生しました:', error.message);
        await showCustomModal('投稿に失敗しました。エラー: ' + error.message); // エラーメッセージを表示
    } else {
        postContentInput.value = ''; // 投稿フォームをクリア
        postUsernameInput.value = ''; // 名前フォームもクリア
        console.log('投稿成功:', data);
        loadPosts(); // 投稿後、リストを再読み込み
    }

    submitPostButton.disabled = false;
    submitPostButton.textContent = '投稿する';
});

// ★★★ 追加点: 投稿を削除する関数 ★★★
async function handleDeletePost(event) {
    const postId = event.target.dataset.id; // ボタンのdata-id属性から投稿IDを取得
    const tableName = tableNameInput.value.trim(); // 現在のテーブル名を取得

    if (!tableName) {
        await showCustomModal('テーブル名が指定されていません。');
        return;
    }

    const confirmed = await showCustomModal('本当にこの投稿を削除しますか？', true);
    if (!confirmed) {
        return; // キャンセルされたら何もしない
    }

    event.target.disabled = true; // ボタンを無効化して二重クリック防止
    event.target.textContent = '削除中...';

    const { error } = await supabase
        .from(tableName) // 動的にテーブル名を指定
        .delete()
        .eq('id', postId); // 指定されたIDの投稿を削除

    if (error) {
        console.error('投稿の削除中にエラーが発生しました:', error.message);
        await showCustomModal('投稿の削除に失敗しました。エラー: ' + error.message);
    } else {
        console.log('投稿を削除しました:', postId);
        loadPosts(); // 削除後、投稿リストを再読み込み
    }
    event.target.disabled = false;
    event.target.textContent = '削除';
}

// テーブル名入力フィールドの変更を監視し、変更されたら投稿を再ロード
tableNameInput.addEventListener('change', () => {
    // 既存の購読を停止（もしあれば）
    if (window.supabaseRealtimeChannel) {
        window.supabaseRealtimeChannel.unsubscribe();
        console.log('以前のリアルタイム購読を停止しました。');
    }
    loadPosts();
    // 新しいテーブル名でリアルタイム更新を再購読
    subscribeToRealtimeUpdates(tableNameInput.value.trim());
});


// リアルタイム更新の購読関数
function subscribeToRealtimeUpdates(tableName) {
    if (!tableName) {
        console.warn('リアルタイム更新を購読するためのテーブル名が指定されていません。');
        return;
    }
    // 既存の購読がある場合は、ここで停止するロジックが必要になる場合があるが、
    // ここではtableNameInputのchangeイベントで制御しているので、重複購読は避けられるはず。

    // Supabaseのリアルタイムチャンネルを新しいグローバル変数に割り当てて、後で参照できるようにする
    window.supabaseRealtimeChannel = supabase
        .channel(`public:${tableName}`) // 動的にテーブル名を指定
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, payload => {
            console.log('リアルタイム変更を検知しました:', payload);
            loadPosts(); // 変更があったら再読み込み
        })
        .subscribe();

    console.log(`リアルタイム更新をテーブル '${tableName}' で購読しました。`);
}


// 初期ロードと初期テーブル名でのリアルタイム購読
window.onload = function() {
    loadPosts();
    subscribeToRealtimeUpdates(tableNameInput.value.trim());
};

