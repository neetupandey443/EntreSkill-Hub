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
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    alert(data.message);

    // 🔥 Register ke baad login page pe jao
    if(data.message.includes("success")) {
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
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);

    if(data.message.includes("successful")) {
      // 🔥 TOKEN SAVE (IMPORTANT)
      localStorage.setItem("token", data.token);

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
    const idea = ideaMap[skill];

    container.innerHTML += `
      <div class="col-md-4">
        <div class="idea-card">
          <h5>${idea}</h5>
          <p>Start your journey today 🚀</p>
          <button onclick="viewRoadmap('${skill}')" class="btn btn-primary w-100">
            View Roadmap
          </button>
        </div>
      </div>
    `;
  });
}


// ================= ROADMAP NAVIGATION =================
function viewRoadmap(skill) {
  localStorage.setItem("selectedSkill", skill);
  window.location.href = "roadmap.html";
}


// ================= ROADMAP PAGE =================
const roadmapContainer = document.getElementById("roadmapContainer");

if(roadmapContainer) {

  const skill = localStorage.getItem("selectedSkill");

  if(!skill) {
    alert("Please select an idea first!");
    window.location.href = "skill.html";
  }

  const roadmapData = {
    "Web Development": [
      "Learn HTML, CSS, JavaScript",
      "Build projects",
      "Create portfolio",
      "Freelancing start",
      "Get clients"
    ],
    "Cooking": [
      "Decide menu",
      "Calculate cost",
      "Take orders",
      "Promote locally",
      "Expand"
    ],
    "Marketing": [
      "Learn marketing",
      "Run campaigns",
      "Get clients",
      "Scale business"
    ]
  };

  const steps = roadmapData[skill] || ["Research", "Plan", "Start", "Grow"];

  steps.forEach((step, index) => {
    roadmapContainer.innerHTML += `
      <div class="roadmap-step">
        <h5>Step ${index + 1}</h5>
        <p>${step}</p>
      </div>
    `;
  });
}


// ================= DASHBOARD NAVIGATION =================
function goToDashboard() {
  window.location.href = "dashboard.html";
}


// ================= DASHBOARD PROTECTION 🔥 =================
if(window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem("token");

  if(!token) {
    alert("Please login first!");
    window.location.href = "login.html";
  }
}


// ================= DASHBOARD PAGE =================
const skillDisplay = document.getElementById("selectedSkill");
const stepsContainer = document.getElementById("stepsContainer");
const progressBar = document.getElementById("progressBar");

if(skillDisplay && stepsContainer) {

  const skill = localStorage.getItem("selectedSkill");

  if(!skill) {
    alert("Please select a skill first!");
    window.location.href = "skill.html";
  }

  skillDisplay.innerText = skill;

  const roadmapData = {
    "Web Development": ["Learn basics", "Build projects", "Portfolio", "Freelance"],
    "Cooking": ["Test recipes", "Pricing", "Orders", "Expand"],
    "Marketing": ["Learn", "Practice", "Ads", "Clients"]
  };

  const steps = roadmapData[skill] || ["Research", "Plan", "Start", "Grow"];

  steps.forEach(step => {
    stepsContainer.innerHTML += `
      <div class="form-check">
        <input type="checkbox" onclick="updateProgress()" class="form-check-input">
        <label class="form-check-label">${step}</label>
      </div>
    `;
  });

  window.updateProgress = function() {
    const checkboxes = document.querySelectorAll("#stepsContainer input");

    let completed = 0;
    checkboxes.forEach(cb => {
      if(cb.checked) completed++;
    });

    const percent = Math.round((completed / checkboxes.length) * 100);

    progressBar.style.width = percent + "%";
    progressBar.innerText = percent + "%";
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