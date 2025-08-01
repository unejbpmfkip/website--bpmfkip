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
  const programStudi = document.getElementById("programStudi")?.value || "-";
  const timestamp = new Date().toISOString();

  const attachmentInput = document.getElementById("attachment");
  let imageBase64 = "";

  if (attachmentInput.files.length > 0) {
    const reader = new FileReader();
    reader.onloadend = async function () {
      imageBase64 = reader.result;

      const data = {
        name,
        nim,
        topic,
        aspiration,
        programStudi,
        timestamp,
        image: imageBase64,
      };

      await saveAspirasi(data);
    };
    reader.readAsDataURL(attachmentInput.files[0]);
  } else {
    const data = {
      name,
      nim,
      topic,
      aspiration,
      programStudi,
      timestamp,
      image: "",
    };

    await saveAspirasi(data);
  }

  // Reset form
  document.getElementById("aspirationForm").reset();
  alert("Aspirasi berhasil dikirim!");
});

// Simpan aspirasi ke localStorage + kirim ke Google Sheets
async function saveAspirasi(data) {
  // Simpan ke localStorage
  const aspirations = JSON.parse(localStorage.getItem("aspirations") || "[]");
  aspirations.push(data);
  localStorage.setItem("aspirations", JSON.stringify(aspirations));

  // Kirim ke Google Sheets
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxTYIYocBhFat9RYphCaOLcdwboIdKwua7szNTyejc7EkXbJsuaLb1pVZb3UjFqQmZc/exec", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.text();
    if (!result.includes("Success")) {
      console.warn("Gagal kirim ke Google Sheets:", result);
    }
  } catch (error) {
    console.error("Gagal kirim aspirasi ke Google Sheets:", error.message);
  }
}