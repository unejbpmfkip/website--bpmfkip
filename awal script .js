// Buka dan tutup modal login
function openLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden");
}
function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}

// Login Admin
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "traveda25bpm" && password === "fkip2025") {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin.html";
  } else {
    document.getElementById("loginMessage").classList.remove("hidden");
  }
});

// Kirim Aspirasi
document.getElementById("aspirationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const nim = document.getElementById("nim").value;
  const topic = document.getElementById("topic").value;
  const aspiration = document.getElementById("aspirationText").value;
  const timestamp = new Date().toLocaleString("id-ID");
  const attachmentInput = document.getElementById("attachment");
  const attachment = attachmentInput.files[0] ? attachmentInput.files[0].name : "";

  const data = {
    name,
    nim,
    topic,
    aspiration,
    attachment,
    timestamp,
  };

  // Simpan ke localStorage
  const aspirations = JSON.parse(localStorage.getItem("aspirations") || "[]");
  aspirations.push(data);
  localStorage.setItem("aspirations", JSON.stringify(aspirations));

  // Kirim ke Google Sheets (dengan JSON format)
  function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("BPM SAMARASI 2025");
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.nim || "",
      data.topic || "",
      data.aspiration || "",
      data.attachment || "",
      data.timestamp || ""
    ]);

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}