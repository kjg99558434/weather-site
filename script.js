const API_KEY = "28995c1bbe4e734196be4efa91be0792789458ffc3d89d9abf04ac9df4d5abdb";
const NX = "59";
const NY = "125";

// 날씨 데이터를 불러오는 함수
function updateWeather() {
  const now = new Date();
  now.setHours(now.getHours() - 1);
  const baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");
  const baseTime = now.getHours().toString().padStart(2, "0") + "00";

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${NX}&ny=${NY}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const items = data.response.body.items.item;
      const findValue = (cat) => items.find((i) => i.category === cat)?.obsrValue || 0;

      const T1H = parseFloat(findValue("T1H"));
      const REH = parseFloat(findValue("REH"));
      const WSD = parseFloat(findValue("WSD"));

      const e = (REH / 100) * 6.105 * Math.pow(10, (7.5 * T1H) / (237.7 + T1H));
      const heatIndex = parseFloat((T1H + 0.33 * e - 0.7 * WSD - 4).toFixed(1));

      let statusText, statusColor;
      if (heatIndex < 31) { statusText = "안전"; statusColor = "#333333"; }
      else if (heatIndex < 33) { statusText = "관심"; statusColor = "#3498db"; }
      else if (heatIndex < 35) { statusText = "주의"; statusColor = "#f1c40f"; }
      else if (heatIndex < 38) { statusText = "경고"; statusColor = "#e67e22"; }
      else { statusText = "폭염 중대경보"; statusColor = "#e74c3c"; }

      document.getElementById("temp-display").innerText = `${heatIndex}°C`;
      document.getElementById("temp-display").style.color = statusColor;
      document.getElementById("status-label").innerText = statusText;
      document.getElementById("status-label").style.color = statusColor;
      document.getElementById("details").innerText = `최근 업데이트: ${new Date().toLocaleTimeString()} | 기온 ${T1H}°C | 습도 ${REH}% | 풍속 ${WSD}m/s`;
    })
    .catch((err) => console.error("업데이트 오류:", err));
}

// 1. 처음 페이지 열 때 실행
updateWeather();

// 2. 10분마다(600,000ms) 자동으로 실행
setInterval(updateWeather, 600000);
