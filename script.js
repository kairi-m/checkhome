document.addEventListener('DOMContentLoaded', () => {

    // HTML要素を取得
    const lockButton = document.getElementById('lockButton');
    const timestampDisplay = document.getElementById('timestampDisplay');
    const editButton = document.getElementById('editButton');
    const editModal = document.getElementById('editModal');
    const datetimeInput = document.getElementById('datetimeInput');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    // ローカルストレージで使用するキー
    const STORAGE_KEY = 'lastLockedTimestamp';

    /**
     * 数値を2桁の文字列にフォーマット
     */
    const padZero = (num) => String(num).padStart(2, '0');

    /**
     * Dateオブジェクトを指定のフォーマットの文字列に変換する
     * @param {Date} date - 変換するDateオブジェクト
     * @returns {string} フォーマットされた日時文字列
     */
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = padZero(date.getMonth() + 1);
        const day = padZero(date.getDate());
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        const seconds = padZero(date.getSeconds());
        return `最終確認日時： ${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    };
    
    /**
     * ローカルストレージから時刻を読み込み、画面に表示する
     */
    const displayLastTimestamp = () => {
        const savedTimestamp = localStorage.getItem(STORAGE_KEY);

        if (savedTimestamp) {
            const date = new Date(savedTimestamp);
            timestampDisplay.textContent = formatDate(date);
            editButton.hidden = false; // 記録があるので編集ボタンを表示
        } else {
            timestampDisplay.textContent = 'まだ記録がありません';
            editButton.hidden = true; // 記録がないので編集ボタンを非表示
        }
    };

    /**
     * 「鍵かけた」ボタンがクリックされたときの処理
     */
    const handleLockClick = () => {
        const now = new Date();
        localStorage.setItem(STORAGE_KEY, now.toISOString());
        displayLastTimestamp();
    };

    /**
     * 「編集」ボタンがクリックされたときの処理
     */
    const handleEditClick = () => {
        const savedTimestamp = localStorage.getItem(STORAGE_KEY);
        if (savedTimestamp) {
            const date = new Date(savedTimestamp);
            // datetime-localの形式 (YYYY-MM-DDTHH:mm) に変換
            const year = date.getFullYear();
            const month = padZero(date.getMonth() + 1);
            const day = padZero(date.getDate());
            const hours = padZero(date.getHours());
            const minutes = padZero(date.getMinutes());
            
            datetimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            editModal.hidden = false;
        }
    };
    
    /**
     * 「保存する」ボタンがクリックされたときの処理
     */
    const handleSaveClick = () => {
        const newDate = new Date(datetimeInput.value);
        // 入力が不正でないかチェック
        if (!isNaN(newDate.getTime())) {
            localStorage.setItem(STORAGE_KEY, newDate.toISOString());
            displayLastTimestamp();
            closeModal();
        } else {
            alert('有効な日時を入力してください。');
        }
    };

    /**
     * モーダルを閉じる処理
     */
    const closeModal = () => {
        editModal.hidden = true;
    };

    // --- イベントリスナーと初期化処理 ---

    lockButton.addEventListener('click', handleLockClick);
    editButton.addEventListener('click', handleEditClick);
    saveButton.addEventListener('click', handleSaveClick);
    cancelButton.addEventListener('click', closeModal);

    // モーダルの外側をクリックしたときも閉じる
    editModal.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeModal();
        }
    });
    
    // ページ読み込み時に初期表示
    displayLastTimestamp();
});
