// biến
const login_btn = document.getElementById('login-btn')
const password = document.getElementById('password')
const login_page = document.getElementById('login-page')
const homecontrol = document.getElementById('homecontrol')
const wifisetup = document.getElementById('wifisetup')


//-----------Hàm khởi tạo đối tượng request----------------
function create_obj() {
  var td = navigator.appName;
  var obj;
  if (td == "Microsoft Internet Explorer") {
    obj = new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    obj = new XMLHttpRequest();
  }
  return obj;
}

//------------Khởi tạo biến toàn cục-----------------------------
var xhttp = create_obj(); // Đối tượng request cho setup wifi
var xhttp_statusD = create_obj(); // Đối tượng request cho cập nhật trạng thái
var d1, d2, d3, d4, u, h;

//-----------Gửi yêu cầu lấy trạng thái các chân D-----------------
function getstatusD() {
  xhttp_statusD.open("GET", "/getSTATUSD", true);
  xhttp_statusD.onreadystatechange = process_statusD;
  xhttp_statusD.send();
}

//------Update trạng thái led tín hiệu lên panel điều khiển----
function process_statusD() {
  if (xhttp_statusD.readyState == 4 && xhttp_statusD.status == 200) {
    //------Update trạng thái led tín hiệu lên panel điều khiển----
    var statusD = xhttp_statusD.responseText;
    var obj = JSON.parse(statusD);
    d1 = obj.H;
    d2 = obj.M;
    updateLedstatus(d1, d2);
  }
}

//----------Hiển thị trạng thái Led lên trình duyệt---------------------
function updateLedstatus(D1, D2) {
  document.getElementById("clock-display").innerText = D1;
}

//-----------Kiểm tra response -------------------------------------------
function process() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    //------Updat data sử dụng javascript----------
    var ketqua = xhttp.responseText;
    document.getElementById("reponsetext").innerHTML = ketqua;
  }
}

//--------Load lại trang để quay về Home control-------------------------
function backHOME() {
  login_page.style.display = 'none';
  homecontrol.style.display = "block";
  wifisetup.style.display = "none";
  deleteBtnSettingRow();
}

//============Hàm thực hiện chứ năng khác================================
//--------Cập nhật trạng thái tự động sau 2 giây----------------------
setInterval(function () {
  getstatusD();
}, 2000);

//----------------------------CHECK EMPTY--------------------------------
function Empty(element, AlertMessage) {
  if (element.value.trim() == "") {
    alert(AlertMessage);
    element.focus();
    return false;
  } else {
    return true;
  }
}

//===========Configure WiFi=====================================
function configurewifi() {
  document.getElementById("homecontrol").style.display = "none";
  document.getElementById("wifisetup").style.display = "block";
  for (let i = 0; i < 40; i++) {
    createBtnSettingRow(i);
  }

}

function updateClock() {
  const hourInput = document.getElementById("hour").value;
  const minuteInput = document.getElementById("minute").value;

  const isValidInput = /^\d{1,2}$/.test(hourInput) && /^\d{1,2}$/.test(minuteInput);

  if (isValidInput) {
    const formattedHour = hourInput.padStart(2, "0");
    const formattedMinute = minuteInput.padStart(2, "0");
    const formattedTime = `${formattedHour}:${formattedMinute}`;

    document.getElementById("clock-display").innerText = formattedTime;
  } else {
    alert("Vui lòng nhập giờ và phút hợp lệ.");
  }
}

function createSettingRow(index) {
  const container = document.getElementById("settings-container");

  const settingRow = document.createElement("div");
  settingRow.className = "setting-row";

  // <div style="display:flex; width:30%;">
  // </div>
  settingRow.innerHTML = `
  <div class="setting-number">${index + 1}</div>
  <input class="setting-input" type="number" id="run-time-hour-${index}" placeholder="Giờ">
  <input class="setting-input" type="number" id="run-time-minute-${index}" placeholder="Phút">
  <input class="setting-input" type="number" id="repeat-${index}" placeholder="Ngày" style="width:20%;">
  <select class="setting-input mode-select" id="mode-${index}" style="width:20%">
    <option value="A">Mode A</option>
    <option value="B">Mode B</option>
    <option value="C">Mode C</option>
    <option value="D">Mode D</option>
    <option value="E">Mode E</option>
    <option value="F">Mode F</option>
    <option value="G">Mode G</option>
    <option value="H">Mode H</option>
    <option value="I">Mode I</option>              
  </select>
  <div style="width:20%">
    <input class="setting-checkbox" type="checkbox" id="save-settings-${index}"/>
    <label class="setting-label" for="save-settings-${index}">Lưu ${index + 1}</label>
  </div>
  `;
  container.appendChild(settingRow);
}
// btn setting element
function createBtnSettingRow(index) {
  const container = document.querySelectorAll(".settings-container");
  container.forEach((element) => {
    const settingRow = document.createElement("div");
    settingRow.className = "btn-setting-row";
    settingRow.innerHTML = `
    <select class="dropdown" id="dropdown${index + 1}">
      <option value="0">Không nhấn</option>
      <option value="1">Nhấn nhả</option>
      <option value="2">Nhấn giữ</option>
    </select>
    `;
    element.appendChild(settingRow);
  })
}
function deleteBtnSettingRow() {
  const container = document.querySelectorAll('.btn-setting-row');
  container.forEach((element) => {
    element.remove();
  })
}

function startTimer() {
  const selectedSettingsContainer = document.getElementById("selected-settings");
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.innerText = ""; // Xóa thông báo lỗi trước khi kiểm tra mới
  let isSaveSettingsChecked = document.querySelectorAll('.setting-checkbox');
  // Lặp qua 10 phần cài đặt để lấy thông tin
  let modeArray = []
  let runTimeHourArray = []
  let runTimeMinuteArray = []
  let repeatCountArray = []
  for (let i = 0; i < 10; i++) {
    let selectedModeId = 'mode-' + i
    let runTimeHourInputId = 'run-time-hour-' + i
    let runTimeMinuteInputId = 'run-time-minute-' + i
    let repeatCountId = 'repeat-' + i
    let runTimeHourInput = document.getElementById(runTimeHourInputId).value;
    let runTimeMinuteInput = document.getElementById(runTimeMinuteInputId).value;
    let selectedMode = document.getElementById(selectedModeId).value;
    let repeatCount = document.getElementById(repeatCountId).value;
    // Thêm phần tử vào mảng
    modeArray.push(selectedMode)
    runTimeHourArray.push(runTimeHourInput)
    runTimeMinuteArray.push(runTimeMinuteInput)
    repeatCountArray.push(repeatCount)
    // Hàm gửi thông tin cài đặt
    function send(id) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", `/send_${id + 1}?mode=` + modeArray[id] + "&hour=" + runTimeHourArray[id] + "&minute=" + runTimeMinuteArray[id] + "&date=" + repeatCountArray[id], true);
      xhttp.onreadystatechange = process;
      xhttp.send();
    }
  }
  // Hàm gửi checkbox
  function send_check() {
    let checks = []
    isSaveSettingsChecked.forEach((element) => {
      if (element.checked) {
        checks.push(1)
      } else {
        checks.push(0)
      }
    })
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/send_checkbox?checkbox0=" + checks[0] + "&checkbox1=" + checks[1] + "&checkbox2=" + checks[2] + "&checkbox3=" + checks[3] + "&checkbox4=" + checks[4] + "&checkbox5=" + checks[5] + "&checkbox6=" + checks[5] + "&checkbox7=" + checks[7] + "&checkbox8=" + checks[8] + "&checkbox9=" + checks[9], true);
    xhttp.onreadystatechange = process;
    xhttp.send();
  }
  let checks = []
  isSaveSettingsChecked.forEach((e) => {
    if (e.checked) {
      checks.push(e)
    }

  })
  send_check()
  checks.forEach((e) => {
    let id = parseInt(e.id.replace('save-settings-', ''))
    // Kiểm tra nếu checkbox được chọn mà chưa điền đầy đủ thông tin
    if (checks && (runTimeHourArray[id] > 23 || runTimeHourArray[id] < 0 || runTimeMinuteArray[id] < 0 || runTimeMinuteArray[id] > 59 || repeatCountArray[id] <= 0)) {
      const errorElement = document.createElement('div')
      errorElement.innerText = `Vui lòng nhập đúng định dạng thời gian cho cài đặt ${id + 1}`;
      errorMessageElement.appendChild(errorElement)
      return
    }
    if (checks && (runTimeHourArray[id] === '' || runTimeMinuteArray[id] === '' || repeatCountArray[id] === '')) {
      const errorElement = document.createElement('div')
      errorElement.innerText = `Vui lòng nhập giờ chạy cho cài đặt ${id + 1}`;
      errorMessageElement.appendChild(errorElement)
      return
    }
    if (id === 0) {
      send(id);
    } else if (id === 1) {
      send(id);
    } else if (id === 2) {
      send(id)
    } else if (id === 3) {
      send(id)
    } else if (id === 4) {
      send(id);
    } else if (id === 5) {
      send(id)
    } else if (id === 6) {
      send(id)
    } else if (id === 7) {
      send(id);
    } else if (id === 8) {
      send(id)
    } else if (id === 9) {
      send(id)
    }

    const settingInfo = `Cài đặt ${id + 1} - Giờ Chạy ${runTimeHourArray[id]}:${runTimeMinuteArray[id]}, Mode ${modeArray[id]}, Số lần lặp lại ${repeatCountArray[id]}`;
    const settingInfoElement = document.createElement("div");
    settingInfoElement.innerText = settingInfo;
    selectedSettingsContainer.appendChild(settingInfoElement);
    setInterval(() => {
      settingInfoElement.remove()
    }, 5000)
  })
}

// Tạo 10 phần cài đặt khi trang web được tải
document.addEventListener("DOMContentLoaded", function () {
  for (let i = 0; i < 10; i++) {
    createSettingRow(i);
  }
});


// Hàm kiểm tra đăng nhập
login_btn.addEventListener('click', (e) => {
  e.preventDefault()
  if (password.value === 'iot1234') {
    login_page.style.display = 'none';
    homecontrol.style.display = "block";
    getstatusD()
  }
})
// Hàm ẩn hiện mật khẩu
function togglePasswordVisibility() {
  var passwordInput = document.getElementById("password");
  var toggleIcon = document.querySelector(".toggle-password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.textContent = "Ẩn"; // Hiển thị biểu tượng mở mắt
  } else {
    passwordInput.type = "password";
    toggleIcon.textContent = "Hiện"; // Hiển thị biểu tượng đóng mắt
  }
}

// wifisetup page
function applySettings() {
  const modeDropdown = document.getElementById("mode-dropdown").value;
  const dropdown = document.querySelectorAll(".dropdown");
  let buttons = []
  var startValue = 0
  if (modeDropdown === "B") {
    startValue = 10
  } else if (modeDropdown === "C") {
    startValue = 20
  } else if (modeDropdown === "D") {
    startValue = 30
  } else if (modeDropdown === "E") {
    startValue = 40
  } else if (modeDropdown === "F") {
    startValue = 50
  } else if (modeDropdown === "G") {
    startValue = 60
  } else if (modeDropdown === "H") {
    startValue = 70
  } else if (modeDropdown === "I") {
    startValue = 80
  }
  dropdown.forEach((e) => {
    buttons.push(e.value)
  })
  function send_case() {
    var xhttp = new XMLHttpRequest();
    var url = "/send_case?mode=" + modeDropdown
    for (var i = startValue; i < startValue + 10; i++) {
      var caseParams = buttons.slice(i * 4, (i + 1) * 4).join('/')
      url += "&case" + (i - startValue + 1) + "=" + `${caseParams}`
    }
    xhttp.open("GET", url, true);
    xhttp.onreadystatechange = process;
    xhttp.send();
  }
  send_case();
}
function modeChange(e) {
  const container = document.querySelectorAll(".settings-container");
  let elements = []
  container.forEach((e) => {
    elements.push(e)
  })
  if (e.value === "A") {
    for (let i = 0; i < 9; i++) {
      if (i === 0) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "B") {
    for (let i = 0; i < 9; i++) {
      if (i === 1) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "C") {
    for (let i = 0; i < 9; i++) {
      if (i === 2) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "D") {
    for (let i = 0; i < 9; i++) {
      if (i === 3) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "E") {
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "F") {
    for (let i = 0; i < 9; i++) {
      if (i === 5) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "G") {
    for (let i = 0; i < 9; i++) {
      if (i === 6) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "H") {
    for (let i = 0; i < 9; i++) {
      if (i === 7) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  } else if (e.value === "I") {
    for (let i = 0; i < 9; i++) {
      if (i === 8) {
        elements[i].style.display = "grid"
      } else {
        elements[i].style.display = "none"
      }
    }
  }

}
