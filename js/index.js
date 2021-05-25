window.addEventListener("load", function () {
  const loader = document.querySelector(".loader");
  loader.classList.add("hidden");
});

window.addEventListener("DOMContentLoaded", function () {
  var status = "lower200";
  var menu = document.querySelector(".menu");
  var scrollTop = document.querySelector(".scrollTop");
  var btn = document.querySelector(".btn");
  const copyGuide = document.querySelector(".guide__btn");
  const copyGuideCode = document.querySelector(".guide__btn-code");
  const inputGuide = document.querySelector(".guide__input");
  const code = document.querySelector("#code");

  if (code) {
    code.value = `
    function doGet() {

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const ws = ss.getSheetByName("vocabulary");
      const data = ws.getRange("A1").getDataRegion().getValues();
      const headers = data.shift();
  
      const jsonArray = data.map(r => {
          let obj = {};
          headers.forEach((h, i) => {
              obj[h] = r[i];
          })
          return obj;
      })
  
      const response = [{ status: 200, data: jsonArray }];
  
      return sendJSON_(response);
  
  }
  
  function doPost(e) {
  
    const type = e.parameter.func;
    const item = e.parameter.item;
    if (type === "remove") {
      deleteRow(item);
    }
    if (type === "edit") {
      const arr = item.split(":");
      replaceRow(arr);
    }
  
    const requiredColumns = ["Terms", "Category","VietnameseMeaning"];
    let jsonResponse;
  
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName("vocabulary");
    const headers = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];
    const headersOriginalOrder = headers.slice();
  
    headers.sort();
  
    const body = e.postData.contents;
    const bodyJSON = JSON.parse(body);
    const headersPassed = Object.keys(bodyJSON).sort();
      if (!checkColumnsPassed_(headers, headersPassed, requiredColumns)) {
        jsonResponse = { status: 500, message: "Invalid Agruments Passed" };
        return sendJSON_(jsonResponse);
     }
    const arrayOfData = headersOriginalOrder.map(h => bodyJSON[h]);
    ws.appendRow(arrayOfData);
    return sendJSON_(bodyJSON);
  
  }
  
  function checkColumnsPassed_(arrAllColumns, arrColumnsPassed, arrRequiredColumns) {
    if (!arrRequiredColumns.every((item) => arrColumnsPassed.includes(item)))return false;
    if (!arrColumnsPassed.every((item) => arrAllColumns.includes(item)))return false;
    return true;
  }
  
  function sendJSON_(jsonResponse) {
    return ContentService
        .createTextOutput(JSON.stringify(jsonResponse))
        .setMimeType(ContentService.MimeType.JSON);
  }
  
  function deleteRow(item){
    var  ss = SpreadsheetApp.getActiveSpreadsheet();
    var editSheet = ss.getSheetByName("vocabulary");
    var lastRowEdit = editSheet.getLastRow();
  
    for(var i = 2; i <= lastRowEdit; i++){
      if (editSheet.getRange(i, 1).getValue() == item)
      editSheet.deleteRow(i);
    }
  }
  
  function replaceRow(item) {
      var  ss = SpreadsheetApp.getActiveSpreadsheet();
      var editSheet = ss.getSheetByName("vocabulary");
      var lastRowEdit = editSheet.getLastRow();
  
      for (var i = 2; i <= lastRowEdit; i++) {
        if (editSheet.getRange(i, 1).getValue() === item[0]) {
          editSheet.getRange('A' + i + ':E' + i).setValues([item]);
        }
      }
    }
  
  `;
  }

  if (copyGuide) {
    copyGuide.addEventListener("click", (e) => {
      inputGuide.select();
      document.execCommand("copy");
      copyGuide.textContent = "Copied!";

      setTimeout(() => {
        copyGuide.textContent = "Copy";
      }, 2000);
    });
  }

  if (copyGuideCode) {
    copyGuideCode.addEventListener("click", (e) => {
      code.select();
      document.execCommand("copy");
      copyGuideCode.textContent = "Copied!";

      setTimeout(() => {
        copyGuideCode.textContent = "Copy";
      }, 2000);
    });
  }

  window.addEventListener("scroll", function () {
    var offset = window.pageYOffset;
    if (offset > 200) {
      if (status === "lower200") {
        menu.classList.add("menu--scroll");
        scrollTop.classList.add("scrollTop--animate");
        status = "higher200";
      }
    } else {
      if (status === "higher200") {
        menu.classList.remove("menu--scroll");
        scrollTop.classList.remove("scrollTop--animate");
        status = "lower200";
      }
    }
  });

  function smoothScroll(target, duration) {
    var target = document.querySelector(target);
    var targetPosition = target.offsetTop - 200;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;

    function animationScroll(currentTime) {
      if (startTime === null) startTime = currentTime; // sau 7s khi refesh  mới nhấn nút để chuyển động thì current time lúc đầu bằng 7 và thay đổi đến khi hết hiệu ứng
      var timeElapsed = currentTime - startTime; // thời gian trôi qua
      var run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    function easeInOutCubic(t, b, c, d) {
      // function ease http://gizma.com/easing/#cub3
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animationScroll);
  }

  scrollTop.addEventListener("click", function () {
    smoothScroll(".menu", 1000); // menu top
  });

  if (btn !== null) {
    // khi sang trang khác thì ko có nút learn more nữa nên bị lỗi btn là null
    btn.addEventListener("click", function () {
      smoothScroll(".section-dns", 1000);
    });
  }
});
