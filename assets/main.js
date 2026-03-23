// =============================================
// PROJECTS DATA — JSON format
// To load from API instead, call: fetchProjects('https://your-api.com/projects')
// The function expects the response to be an array matching this same structure.
// =============================================
const defaultProjects = [];
let PROJECTS_DATA = [];
const baseUrl = "https://darkslateblue-crow-176027.hostingersite.com"; // replace with your API base URL
// const baseUrl = "http://localhost:8000"; // replace with your API base URL

// =============================================
// fetchProjects — pass a URL to load from API
// Example usage (commented out):
//
fetchProjects(`${baseUrl}/api/projects/`);

async function fetchProjects(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    PROJECTS_DATA = data.data;

    renderProjects(PROJECTS_DATA);
  } catch (e) {
    console.error("Failed to load projects:", e);
    renderProjects(defaultProjects); // fallback to local data
  }
}
// =============================================

function renderProjects(projects) {
  var grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";
  for (var i = 0; i < projects.length; i++) {
    var p = projects[i];
    var delay = (i * 0.1).toFixed(1);
    var card = document.createElement("div");
    card.className = "project-card reveal";
    card.style.transitionDelay = delay + "s";
    card.setAttribute("data-id", p.id);
    card.innerHTML =
      '<div class="project-thumb">' +
      '<img src="' +
      p.images[0] +
      '" alt="' +
      p.title +
      '" loading="lazy">' +
      '<span class="project-label" style="background:' +
      p.typeBg +
      ";color:" +
      p.typeColor +
      '">' +
      p.type.toUpperCase() +
      "</span>" +
      '<div class="project-overlay"><button class="overlay-btn" onclick="openPanel(' +
      p.id +
      ')">عرض التفاصيل</button></div>' +
      "</div>" +
      '<div class="project-body">' +
      '<h3 class="project-title">' +
      p.title +
      "</h3>" +
      '<p class="project-desc">' +
      p.shortDesc +
      "</p>" +
      '<div class="project-stack">' +
      p.stack
        .slice(0, 4)
        .map(function (t, idx) {
          return (
            '<span class="tag ' +
            (p.stackColors[idx] || "tag-teal") +
            '">' +
            t +
            "</span>"
          );
        })
        .join("") +
      "</div>" +
      "</div>";
    card.addEventListener(
      "click",
      (function (id) {
        return function () {
          openPanel(id);
          console.log(id);
        };
      })(p.id),
    );
    grid.appendChild(card);
  }
  // re-observe reveal elements
  var newReveal = grid.querySelectorAll(".reveal");
  for (var j = 0; j < newReveal.length; j++) {
    revealObserver.observe(newReveal[j]);
  }
}

function openPanel(id) {
  var p = null;

  console.log(PROJECTS_DATA);
  for (var i = 0; i < PROJECTS_DATA.length; i++) {
    if (PROJECTS_DATA[i].id === id) {
      p = PROJECTS_DATA[i];
      break;
    }
  }
  if (!p) return;

  var tagsHtml = p.stack
    .map(function (t, i) {
      return (
        '<span class="panel-tag ' +
        (p.stackColors[i] || "tag-teal") +
        '">' +
        t +
        "</span>"
      );
    })
    .join("");

  var imgsHtml = "";
  if (p.images.length >= 2) {
    imgsHtml =
      '<div class="panel-imgs">' +
      p.images
        .map(function (src) {
          return (
            '<img class="panel-img" src="' +
            src +
            '" alt="' +
            p.title +
            '" loading="lazy">'
          );
        })
        .join("") +
      "</div>";
  } else {
    imgsHtml =
      '<img class="panel-img-single" src="' +
      p.images[0] +
      '" alt="' +
      p.title +
      '" loading="lazy">';
  }

  document.getElementById("panelBody").innerHTML =
    imgsHtml +
    '<span class="panel-type" style="background:' +
    p.typeBg +
    ";color:" +
    p.typeColor +
    '">' +
    p.type +
    "</span>" +
    '<h2 class="panel-title">' +
    p.title +
    "</h2>" +
    '<p class="panel-desc">' +
    p.fullDesc +
    "</p>" +
    '<p class="panel-section-label">// التقنيات المستخدمة</p>' +
    '<div class="panel-tags">' +
    tagsHtml +
    "</div>" +
    '<p class="panel-section-label">// الروابط</p>' +
    '<div class="panel-links">' +
    '<a href="' +
    p.liveUrl +
    '" class="panel-link primary" target="_blank">مشاهدة المشروع &rarr;</a>' +
    '<a href="' +
    p.githubUrl +
    '" class="panel-link secondary" target="_blank">GitHub</a>' +
    '<a href="' +
    (p.figmaUrl
      ? p.figmaUrl + '" class="panel-link secondary" target="_blank">Figma</a>'
      : "") +
    "</div>";

  document.getElementById("panelOverlay").classList.add("active");
  document.getElementById("slidePanel").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePanel() {
  document.getElementById("panelOverlay").classList.remove("active");
  document.getElementById("slidePanel").classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closePanel();
});

// Copyright year
document.getElementById("footerCopy").textContent =
  "\u00a9 " +
  new Date().getFullYear() +
  " Abdallah Mohamed Tawfik \u2014 All Rights Reserved";

// Cursor — requestAnimationFrame للـ trail بدل setTimeout، وCSS للـ hover
var c = document.getElementById("cursor");
var t = document.getElementById("trail");
var mx = 0,
  my = 0,
  tx = 0,
  ty = 0;
document.addEventListener("mousemove", function (e) {
  mx = e.clientX;
  my = e.clientY;
  c.style.left = mx + "px";
  c.style.top = my + "px";
});
(function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  t.style.left = tx + "px";
  t.style.top = ty + "px";
  requestAnimationFrame(animateTrail);
})();

// Reveal observer
var revealObserver = new IntersectionObserver(
  function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) entries[i].target.classList.add("visible");
    }
  },
  { threshold: 0.1 },
);
var revealEls = document.querySelectorAll(".reveal");
for (var i = 0; i < revealEls.length; i++) {
  revealObserver.observe(revealEls[i]);
}

// Init
// renderProjects(PROJECTS_DATA);
