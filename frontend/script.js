// ================= BASE URL =================
const BASE_URL = "https://entreskill-backend.onrender.com";


// ================= REGISTER FORM =================
document.getElementById("registerForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(name === "" || email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);

    if(data.message.toLowerCase().includes("success")) {
      window.location.href = "login.html";
    }

  } catch (error) {
    alert("Server error ❌");
  }
});


// ================= LOGIN FORM =================
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);

    if(data.message.toLowerCase().includes("successful")) {
      localStorage.setItem("token", data.token);

      // 🔥 IMPORTANT FIX
      window.location.href = "skill.html";
    }

  } catch (error) {
    alert("Server error ❌");
  }
});


// ================= SKILL CARD SELECTION =================
let selectedSkills = [];

function toggleSkill(element, skill) {
  element.classList.toggle("active");

  if(selectedSkills.includes(skill)) {
    selectedSkills = selectedSkills.filter(s => s !== skill);
  } else {
    selectedSkills.push(skill);
  }
}


// ================= SUBMIT SKILLS =================
function submitSkills() {
  if(selectedSkills.length === 0) {
    alert("Please select at least one skill");
    return;
  }

  localStorage.setItem("ideas", JSON.stringify(selectedSkills));
  window.location.href = "ideas.html";
}


// ================= IDEAS PAGE =================
const container = document.getElementById("ideasContainer");

if(container) {

  const skills = JSON.parse(localStorage.getItem("ideas")) || [];

  if(skills.length === 0) {
    alert("Please select skills first!");
    window.location.href = "skill.html";
  }

  const ideaMap = {
    "Web Development": "Freelance Website Developer 💻",
    "Graphic Design": "Logo & Branding Business 🎨",
    "Content Writing": "Content Writing Services ✍️",
    "Social Media": "Social Media Manager 📱",
    "Photography": "Photography Studio 📸",
    "Makeup": "Freelance Makeup Artist 💄",
    "Handicraft": "Handmade Products Store 🎨",
    "Video Editing": "Video Editing Service 🎬",
    "Cooking": "Tiffin Service 🍱",
    "Tailoring": "Boutique Business 👗",
    "Fitness": "Fitness Coaching 🏋️",
    "Teaching": "Online Tuition 📚",
    "Marketing": "Digital Marketing Agency 📊",
    "Sales": "Reselling Business 🛒",
    "Communication": "Public Speaking Coach 🗣️",
    "Management": "Business Consultancy 📈"
  };

  skills.forEach(skill => {
    const idea = ideaMap[skill] || "Startup Idea 🚀";

    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="idea-card p-3 shadow">
          <h5>${idea}</h5>
          <p>Start your journey today 🚀</p>

          <!-- 🔥 FIXED BUTTON -->
          <button onclick="viewRoadmap('${skill}')" class="btn btn-primary w-100">
            View Roadmap
          </button>

        </div>
      </div>
    `;
  });
}


// ================= ROADMAP =================
function viewRoadmap(skill) {
  localStorage.setItem("selectedSkill", skill);
  window.location.href = "roadmap.html";
}


// ================= DASHBOARD PROTECTION =================
if(window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem("token");

  if(!token) {
    alert("Please login first!");
    window.location.href = "login.html";
  }
}


// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


// ================= RESET =================
function resetApp() {
  localStorage.clear();
  window.location.href = "index.html";
}