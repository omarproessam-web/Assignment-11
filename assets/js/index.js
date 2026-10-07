let NASA_KEY = "DEMO_KEY";

let links = document.querySelectorAll(".nav-link");
let sections = document.querySelectorAll(".app-section");
let sidebar = document.getElementById("sidebar");
let toggleBtn = document.getElementById("sidebar-toggle");

let apodImg = document.getElementById("apod-image");
let apodTitle = document.getElementById("apod-title");
let apodDateDisplay = document.getElementById("apod-date");
let apodExp = document.getElementById("apod-explanation");
let apodDateInfo = document.getElementById("apod-date-info");
let apodMediaType = document.getElementById("apod-media-type");
let apodDateDetail = document.getElementById("apod-date-detail");
let apodLoading = document.getElementById("apod-loading");
let dateInput = document.getElementById("apod-date-input");
let loadBtn = document.getElementById("load-date-btn");
let todayBtn = document.getElementById("today-apod-btn");

let launchesGrid = document.getElementById("launches-grid");
let launchesCount = document.getElementById("launches-count");
let launchesCountMobile = document.getElementById("launches-count-mobile");

let planetCards = document.querySelectorAll(".planet-card");
let planetImg = document.getElementById("planet-detail-image");
let planetName = document.getElementById("planet-detail-name");
let planetDesc = document.getElementById("planet-detail-description");
let planetDist = document.getElementById("planet-distance");
let planetRad = document.getElementById("planet-radius");
let planetMass = document.getElementById("planet-mass");
let planetDens = document.getElementById("planet-density");
let planetOrb = document.getElementById("planet-orbital-period");
let planetRot = document.getElementById("planet-rotation");
let planetMoons = document.getElementById("planet-moons");
let planetGrav = document.getElementById("planet-gravity");
let planetDisc = document.getElementById("planet-discoverer");
let planetDiscDate = document.getElementById("planet-discovery-date");

let planetsCache = [];

function initNav() {
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let target = link.getAttribute("data-section");

      links.forEach((l) => {
        l.classList.remove("bg-blue-500/10", "text-blue-400");
        l.classList.add("text-slate-300");
      });
      link.classList.add("bg-blue-500/10", "text-blue-400");
      link.classList.remove("text-slate-300");

      sections.forEach((sec) => {
        if (sec.id === target) {
          sec.classList.remove("hidden");
        } else {
          sec.classList.add("hidden");
        }
      });
    });
  });

  if (toggleBtn) {
    if (sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("-translate-x-full");
      });
    }
  }
}

async function fetchApod(dateStr) {
  apodImg.classList.add("hidden");
  apodLoading.classList.remove("hidden");

  let url = "https://api.nasa.gov/planetary/apod?api_key=" + NASA_KEY;
  if (dateStr) {
    url = url + "&date=" + dateStr;
  }

  let res = await fetch(url);
  let data = await res.json();

  apodTitle.textContent = data.title;
  apodExp.textContent = data.explanation;
  apodDateDisplay.textContent = "Astronomy Picture of the Day - " + data.date;
  apodDateInfo.textContent = data.date;
  apodDateDetail.innerHTML = '<i class="far fa-calendar mr-2"></i>' + data.date;
  apodMediaType.textContent = data.media_type;

  if (data.media_type === "image") {
    apodImg.src = data.url;
    apodImg.alt = data.title;
  } else {
    apodImg.src = "./assets/images/placeholder.webp";
  }
  apodImg.classList.remove("hidden");
  apodLoading.classList.add("hidden");
}

function initApodControls() {
  let today = "2026-10-07";
  dateInput.max = today;
  dateInput.value = today;

  loadBtn.addEventListener("click", () => {
    fetchApod(dateInput.value);
  });

  todayBtn.addEventListener("click", () => {
    dateInput.value = today;
    fetchApod(today);
  });
}

async function fetchLaunches() {
  let res = await fetch(
    "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=10",
  );
  let data = await res.json();

  let results = data.results;
  launchesCount.textContent = results.length + " Launches";
  launchesCountMobile.textContent = results.length;

  launchesGrid.innerHTML = "";

  results.forEach((item) => {
    let name = item.name;
    let provider = item.launch_service_provider.name;
    let dateStr = item.net.slice(0, 10);
    let timeStr = item.net.slice(11, 16);
    let rocket = item.rocket.configuration.name;
    let location = item.pad.location.name;
    let status = item.status.abbrev;

    let card = document.createElement("div");
    card.className =
      "bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer";
    card.innerHTML = `
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        <i class="fas fa-rocket text-5xl text-slate-700"></i>
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
            ${status}
          </span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            ${name}
          </h4>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i class="fas fa-building text-xs"></i>
            ${provider}
          </p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-calendar text-slate-500 w-4"></i>
            <span class="text-slate-300">${dateStr}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-clock text-slate-500 w-4"></i>
            <span class="text-slate-300">${timeStr}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-rocket text-slate-500 w-4"></i>
            <span class="text-slate-300">${rocket}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
            <span class="text-slate-300 line-clamp-1">${location}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
          <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
            Details
          </button>
          <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;
    launchesGrid.appendChild(card);
  });
}

let planetDescriptions = {
  mercury:
    "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
  venus: "Venus is the second planet from the Sun and is a terrestrial planet.",
  earth:
    "Earth is the third planet from the Sun and the only object known to harbor life.",
  mars: "Mars is the fourth planet from the Sun and is known as the Red Planet.",
  jupiter:
    "Jupiter is the fifth planet from the Sun and the largest in the Solar System.",
  saturn:
    "Saturn is the sixth planet from the Sun, famous for its ring system.",
  uranus: "Uranus is the seventh planet from the Sun and is an ice giant.",
  neptune: "Neptune is the eighth and farthest planet from the Sun.",
};

async function fetchPlanets() {
  let res = await fetch(
    "https://api.le-systeme-solaire.net/rest/bodies/?filter[]=isPlanet,eq,true",
  );
  let data = await res.json();
  planetsCache = data.bodies;
}

function updatePlanetInfo(planetKey) {
  let match = planetsCache.find(
    (p) => p.englishName.toLowerCase() === planetKey.toLowerCase(),
  );

  planetImg.src = "./assets/images/" + planetKey.toLowerCase() + ".png";
  planetName.textContent =
    planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
  planetDesc.textContent = planetDescriptions[planetKey.toLowerCase()];

  planetDist.textContent = match.semimajorAxis + " km";
  planetRad.textContent = match.meanRadius + " km";
  planetMass.textContent = match.mass.massValue + " × 10²⁴ kg";
  planetDens.textContent = match.density + " g/cm³";
  planetOrb.textContent = match.sideralOrbit + " days";
  planetRot.textContent = match.sideralRotation + " hours";
  planetMoons.textContent = match.moons.length;
  planetGrav.textContent = match.gravity + " m/s²";
  planetDisc.textContent = match.discoveredBy;
  planetDiscDate.textContent = match.discoveryDate;
}

function initPlanetEvents() {
  planetCards.forEach((card) => {
    card.addEventListener("click", () => {
      let pid = card.getAttribute("data-planet-id");
      updatePlanetInfo(pid);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initApodControls();
  fetchApod();
  fetchLaunches();
  fetchPlanets();
  initPlanetEvents();
});
