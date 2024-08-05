// 各マーク
const CIRCLE = "●";
const CROSS = "×";

// 各マス目のIDを二次元配列にする
const ID_LIST = [
  ["s1", "s2", "s3"],
  ["s4", "s5", "s6"],
  ["s7", "s8", "s9"],
];

// ターン数
let turn = 1;

// ゲームが実行中のフラグ
let isRun = true;

// 指定のidを取得する関数
function $(id) {
  return document.getElementById(id);
}

// どちらのターンか判別する関数
function isCircle() {
  return turn % 2 === 1;
}

// ターン表示を切り替える関数
function changeNowPlayer() {
  if (isCircle()) $("tool_nowPlayer").innerHTML = CIRCLE + "のターン";
  else $("tool_nowPlayer").innerHTML = CROSS + "のターン";
}

// 3つのマス目が同じマークかどうか判定する関数
function isComplete(firstId, secondId, thirdId) {
  // 3つのマス目にマークが入っていなければ、この関数の処理は終了(return)する
  if (
    $(firstId).value === "" ||
    $(secondId).value === "" ||
    $(thirdId).value === ""
  )
    return;
  // 3つのマス目のマークが同じマークなら、trueをかえす
  if (
    $(firstId).value === $(secondId).value &&
    $(secondId).value === $(thirdId).value
  )
    return true;
  // 同じマークでなければfalseを返す
  return false;
}

// どこかに揃っている列があるか調べる関数
function completeMark() {
  // 終わりかどうか判定する変数
  let isEnd = false;

  // 横一列
  for (let row = 0; row < 3; row++) {
    isEnd = isComplete(ID_LIST[row][0], ID_LIST[row][1], ID_LIST[row][2]);
    if (isEnd) {
      winLossResults($(ID_LIST[row][0]).value + "の勝利！");
      return true;
    }
  }

  // 縦一列
  for (let col = 0; col < 3; col++) {
    isEnd = isComplete(ID_LIST[0][col], ID_LIST[1][col], ID_LIST[2][col]);
    if (isEnd) {
      winLossResults($(ID_LIST[0][col]).value + "の勝利！");
      return true;
    }
  }

  // 斜め（左下り）
  isEnd = isComplete(ID_LIST[0][2], ID_LIST[1][1], ID_LIST[2][0]);
  if (isEnd) {
    winLossResults($(ID_LIST[0][2]).value + "の勝利！");
    return true;
  }

  // 斜め（右下り）
  isEnd = isComplete(ID_LIST[0][0], ID_LIST[1][1], ID_LIST[2][2]);
  if (isEnd) {
    winLossResults($(ID_LIST[0][0]).value + "の勝利！");
    return true;
  }

  // 引き分けの場合
  if (turn >= 9) {
    winLossResults("引き分け！");
    return true;
  }

  // いずれも揃っていない
  return false;
}

// クリックされたマス目を取得してマークを入力する関数
function clickToCheck(e) {
  // ゲームが実行中でなければ終了
  if (!isRun) return;

  // イベント（e）からクリックされたマス目のIDを取得
  let id = e.target.id;

  // 取得したIDから、クリックされたマス目をDOMオブジェクトとして取得
  let object = $(id);

  // すでにマークが入っている場合は、この処理を終了
  if (object.value !== "") return;

  // そのマス目（inputタグ）のvalue属性を変更する
  if (isCircle()) object.value = CIRCLE;
  else object.value = CROSS;

  // 3マスが揃ったかどうか判定する
  if (completeMark()) return;

  // ターン数を1増やす
  turn++;

  // ターン表示を切り替える
  changeNowPlayer();
}

// 勝敗結果を表示する
function winLossResults(message) {
  // ゲームは実行中でない
  isRun = false;

  $("tool_resultText").innerHTML = message;

  // ターン表示を削除する
  $("tool_nowPlayer").style.display = "none";

  // 勝敗表示を表示
  $("tool_resultText").style.display = "block";
}

// リセットボタンの動きを設定する関数
function resetAction() {
  // ターンを1にする
  turn = 1;

  // ターン表示を切り替える
  changeNowPlayer();

  // マスのマークを消す（valueを空にする）
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      $(ID_LIST[row][col]).value = "";
    }
  }

  // 結果表示を消す（空文字にする）
  winLossResults("");

  // ターン表示を復活させる
  $("tool_nowPlayer").style.display = "block";

  // 勝敗表示を削除
  $("tool_resultText").style.display = "none";

  // ゲームを実行中のフラグにする
  isRun = true;
}

// 画面がロードされたときに実行される関数
function onloadAction() {
  // 各マス目に、クリックイベントを設定
  // 繰り返し処理で記述する
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      $(ID_LIST[row][col]).onclick = clickToCheck;
    }
  }

  // リセットボタンをクリックしたときにイベントを設定
  $("reset").onclick = resetAction;

  // リセットアクションを実行
  resetAction();
}

// 画面が完全に読み込まれたらonloadActionを実行
window.onload = onloadAction;