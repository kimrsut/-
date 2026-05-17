let adult = 0;
let child = 0;
let staff = 0;

// グラフのX軸に表示する時間
let timeLabels = [];

// 各人数の記録
let adultData = [];
let childData = [];
let staffData = [];
let totalData = [];

// 保存されているデータを読み込む
loadData();

// グラフを作成
const ctx = document.getElementById('visitorChart');

const visitorChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: '大人',
        data: adultData,
        borderWidth: 2
      },
      {
        label: '子ども',
        data: childData,
        borderWidth: 2
      },
      {
        label: '高齢者',
        data: staffData,
        borderWidth: 2
      },
      {
        label: '全体人数',
        data: totalData,
        borderWidth: 3
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: '時間'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '人数'
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

// +1ボタン
function addCount(type) {
  if (type === 'adult') {
    adult = adult + 1;
    document.getElementById('adult').textContent = adult;
  }

  if (type === 'child') {
    child = child + 1;
    document.getElementById('child').textContent = child;
  }

  if (type === 'staff') {
    staff = staff + 1;
    document.getElementById('staff').textContent = staff;
  }

  updateTotal();
  recordData();
  saveData();
}

// -1ボタン
function minusCount(type) {
  if (type === 'adult' && adult > 0) {
    adult = adult - 1;
    document.getElementById('adult').textContent = adult;
  }

  if (type === 'child' && child > 0) {
    child = child - 1;
    document.getElementById('child').textContent = child;
  }

  if (type === 'staff' && staff > 0) {
    staff = staff - 1;
    document.getElementById('staff').textContent = staff;
  }

  updateTotal();
  recordData();
  saveData();
}

// 合計人数を更新
function updateTotal() {
  let total = adult + child + staff;
  document.getElementById('total').textContent = total;
}

// 15分単位でグラフに記録
function recordData() {
  let now = new Date();

  let hour = now.getHours();
  let minute = now.getMinutes();

  let quarterMinute;

  // 分を15分単位にする
  if (minute < 15) {
    quarterMinute = "00";
  } else if (minute < 30) {
    quarterMinute = "15";
  } else if (minute < 45) {
    quarterMinute = "30";
  } else {
    quarterMinute = "45";
  }

  let time =
    hour.toString().padStart(2, '0') + ':' + quarterMinute;

  let total = adult + child + staff;

  // すでに同じ時間帯のデータがあるか確認
  let index = timeLabels.indexOf(time);

  if (index === -1) {
    // まだその時間帯がなければ新しく追加
    timeLabels.push(time);
    adultData.push(adult);
    childData.push(child);
    staffData.push(staff);
    totalData.push(total);
  } else {
    // すでにその時間帯があれば上書き
    adultData[index] = adult;
    childData[index] = child;
    staffData[index] = staff;
    totalData[index] = total;
  }

  visitorChart.update();
}

function resetAll() {
  let result = confirm("本当にすべてのデータをリセットしますか？");

  if (result === false) {
    return;
  }

  adult = 0;
  child = 0;
  staff = 0;

  timeLabels = [];
  adultData = [];
  childData = [];
  staffData = [];
  totalData = [];

  document.getElementById('adult').textContent = adult;
  document.getElementById('child').textContent = child;
  document.getElementById('staff').textContent = staff;

  updateTotal();

  visitorChart.data.labels = timeLabels;
  visitorChart.data.datasets[0].data = adultData;
  visitorChart.data.datasets[1].data = childData;
  visitorChart.data.datasets[2].data = staffData;
  visitorChart.data.datasets[3].data = totalData;
  visitorChart.update();

  saveData();
}

// データを保存する
function saveData() {
  localStorage.setItem('adult', adult);
  localStorage.setItem('child', child);
  localStorage.setItem('staff', staff);

  localStorage.setItem('timeLabels', JSON.stringify(timeLabels));
  localStorage.setItem('adultData', JSON.stringify(adultData));
  localStorage.setItem('childData', JSON.stringify(childData));
  localStorage.setItem('staffData', JSON.stringify(staffData));
  localStorage.setItem('totalData', JSON.stringify(totalData));
}

// データを読み込む
function loadData() {
  adult = Number(localStorage.getItem('adult')) || 0;
  child = Number(localStorage.getItem('child')) || 0;
  staff = Number(localStorage.getItem('staff')) || 0;

  timeLabels = JSON.parse(localStorage.getItem('timeLabels')) || [];
  adultData = JSON.parse(localStorage.getItem('adultData')) || [];
  childData = JSON.parse(localStorage.getItem('childData')) || [];
  staffData = JSON.parse(localStorage.getItem('staffData')) || [];
  totalData = JSON.parse(localStorage.getItem('totalData')) || [];

  document.getElementById('adult').textContent = adult;
  document.getElementById('child').textContent = child;
  document.getElementById('staff').textContent = staff;

  updateTotal();
}
// CSVファイルを出力する
function downloadCSV() {
  // CSVの1行目
  let csv = "時間,大人,子ども,スタッフ,合計\n";

  // グラフに記録されているデータを1行ずつCSVにする
  for (let i = 0; i < timeLabels.length; i++) {
    csv += timeLabels[i] + ",";
    csv += adultData[i] + ",";
    csv += childData[i] + ",";
    csv += staffData[i] + ",";
    csv += totalData[i] + "\n";
  }

  // 文字化け対策
  let bom = "\uFEFF";

  // CSVデータをファイルとして作る
  let blob = new Blob([bom + csv], { type: "text/csv" });

  // ダウンロード用のリンクを作る
  let link = document.createElement("a");

  // ファイル名を指定
  link.download = "festival_count_data.csv";

  // CSVファイルのURLを作る
  link.href = URL.createObjectURL(blob);

  // 自動でクリックしてダウンロードする
  link.click();
}