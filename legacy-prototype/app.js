const state = {
  selectedClaimId: "T-1042",
  selectedSlot: null,
  activeRole: "owner",
  statusFilter: "all",
  units: [
    { unit: "C103", buyer: "Lise Frankum", invited: true, connected: true },
    { unit: "A204", buyer: "Amir Halvorsen", invited: true, connected: false },
    { unit: "B011", buyer: "Nora Vik", invited: false, connected: false },
  ],
  vendors: [
    { name: "Bare Rør AS", trade: "Rørlegger", open: 2, rating: 4.8 },
    { name: "Plank & Sønn AS", trade: "Tømrer", open: 5, rating: 4.4 },
    { name: "Betong AS", trade: "Flis og mur", open: 10, rating: 4.1 },
    { name: "Elektrofix AS", trade: "Elektriker", open: 1, rating: 4.7 },
  ],
  claims: [
    {
      id: "T-1042",
      title: "Sprukket veggflis på bad",
      unit: "C103",
      buyer: "Lise Frankum",
      room: "Bad",
      status: "new",
      severity: 4,
      vendor: null,
      due: "14 dager igjen",
      description: "Flere av flisene er sprukket på badet. Beboer har markert området på bildet.",
      image: "assets/cracked-tile.png",
      created: "i dag",
      timeline: [
        { title: "Reklamasjon mottatt", at: "09:18" },
        { title: "Bilde og beskrivelse lagret", at: "09:19" },
      ],
      messages: [
        { from: "Lise", text: "Hei, flisene på badet ser ut til å være sprukket.", mine: false },
        { from: "Tveller", text: "Saken er sendt til utbygger for vurdering.", mine: true },
      ],
      slots: [],
      confirmedByResident: false,
      confirmedByVendor: false,
    },
    {
      id: "T-1037",
      title: "Manglende fuge ved servant",
      unit: "A204",
      buyer: "Amir Halvorsen",
      room: "Bad",
      status: "assigned",
      severity: 2,
      vendor: "Bare Rør AS",
      due: "41 dager igjen",
      description: "Fuge rundt servant er ikke komplett. Trenger enkel ettergang.",
      image: "assets/cracked-tile.png",
      created: "i går",
      timeline: [
        { title: "Reklamasjon mottatt", at: "i går" },
        { title: "Tildelt Bare Rør AS", at: "i går" },
      ],
      messages: [
        { from: "Amir", text: "Kan dere se på fugen ved servant?", mine: false },
        { from: "Utbygger", text: "Bare Rør AS er koblet på saken.", mine: true },
      ],
      slots: [],
      confirmedByResident: false,
      confirmedByVendor: false,
    },
    {
      id: "T-1019",
      title: "Dør subber mot terskel",
      unit: "B011",
      buyer: "Nora Vik",
      room: "Entré",
      status: "scheduled",
      severity: 3,
      vendor: "Plank & Sønn AS",
      due: "63 dager igjen",
      description: "Dørbladet subber mot terskel og må justeres.",
      image: "assets/cracked-tile.png",
      created: "mandag",
      timeline: [
        { title: "Reklamasjon mottatt", at: "mandag" },
        { title: "Tildelt Plank & Sønn AS", at: "tirsdag" },
        { title: "Tidspunkt valgt", at: "10.12 · 12:00" },
      ],
      messages: [
        { from: "Nora", text: "12:00 passer fint.", mine: false },
        { from: "Plank & Sønn", text: "Vi kommer 10. desember.", mine: true },
      ],
      slots: ["10.12 · 10:00", "10.12 · 12:00", "10.12 · 14:00"],
      confirmedByResident: true,
      confirmedByVendor: false,
    },
  ],
};

const statusLabels = {
  new: "Ny",
  assigned: "Tildelt",
  scheduled: "Planlagt",
  closed: "Lukket",
};

const statusClass = {
  new: "danger",
  assigned: "warn",
  scheduled: "",
  closed: "good",
};

const slots = ["06.12 · 10:00", "06.12 · 12:00", "06.12 · 14:00"];

function claimById(id) {
  return state.claims.find((claim) => claim.id === id) || state.claims[0];
}

function render() {
  renderMetrics();
  renderClaims();
  renderDetail();
  renderVendors();
  renderUnits();
  renderChat();
  renderSlots();
  syncNavigation();
}

function renderMetrics() {
  const open = state.claims.filter((claim) => claim.status !== "closed").length;
  const closed = state.claims.filter((claim) => claim.status === "closed").length;
  document.querySelector("#metric-units").textContent = state.units.length + 179;
  document.querySelector("#metric-open").textContent = open;
  document.querySelector("#metric-closed").textContent = closed;
}

function renderClaims() {
  const list = document.querySelector("#claim-list");
  const claims = state.statusFilter === "all"
    ? state.claims
    : state.claims.filter((claim) => claim.status === state.statusFilter);

  if (!claims.length) {
    list.innerHTML = '<div class="empty-state">Ingen saker i dette filteret.</div>';
    return;
  }

  list.innerHTML = claims.map((claim) => `
    <button class="claim-item ${claim.id === state.selectedClaimId ? "active" : ""}" type="button" data-select-claim="${claim.id}">
      <span class="claim-meta">
        <span>${claim.id} · ${claim.unit}</span>
        <span class="status-pill ${statusClass[claim.status]}">${statusLabels[claim.status]}</span>
      </span>
      <strong>${claim.title}</strong>
      <span class="claim-meta">
        <span>${claim.buyer}</span>
        <span>${claim.due}</span>
      </span>
    </button>
  `).join("");
}

function renderDetail() {
  const detail = document.querySelector("#claim-detail");
  const claim = claimById(state.selectedClaimId);
  if (!claim) {
    detail.innerHTML = '<div class="empty-state">Velg en sak.</div>';
    return;
  }

  const vendorOptions = state.vendors.map((vendor) => `
    <option ${claim.vendor === vendor.name ? "selected" : ""}>${vendor.name}</option>
  `).join("");

  detail.innerHTML = `
    <div class="detail-grid">
      <div class="defect-photo">
        <img src="${claim.image}" alt="${claim.title}" />
      </div>
      <div class="detail-copy">
        <span class="status-pill ${statusClass[claim.status]}">${statusLabels[claim.status]}</span>
        <h4>${claim.title}</h4>
        <p>${claim.description}</p>
        <div class="field-stack">
          <label>
            Underleverandør
            <select data-assign-vendor>
              <option value="">Velg leverandør</option>
              ${vendorOptions}
            </select>
          </label>
          <button class="primary-action full" type="button" data-forward-claim>Send forespørsel</button>
          <button class="ghost-action full" type="button" data-close-claim>Lukk sak</button>
        </div>
      </div>
    </div>
    <div class="timeline">
      ${claim.timeline.map((item) => `
        <div class="timeline-row">
          <strong>${item.title}</strong>
          <span>${item.at}</span>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelector("#active-case-pill").textContent = `${claim.id} · ${claim.unit}`;
}

function renderVendors() {
  document.querySelector("#vendor-list").innerHTML = state.vendors.map((vendor) => `
    <div class="vendor-row">
      <div>
        <strong>${vendor.name}</strong>
        <span>${vendor.trade} · ${vendor.open} åpne saker</span>
      </div>
      <span class="status-pill good">${vendor.rating.toFixed(1)}</span>
    </div>
  `).join("");
}

function renderUnits() {
  document.querySelector("#unit-list").innerHTML = state.units.map((unit) => `
    <div class="unit-row">
      <div>
        <strong>${unit.unit} · ${unit.buyer}</strong>
        <span>${unit.connected ? "Kjøper er koblet" : unit.invited ? "SMS sendt" : "Ikke invitert"}</span>
      </div>
      <span class="status-pill ${unit.connected ? "good" : "warn"}">${unit.connected ? "Aktiv" : "Inviter"}</span>
    </div>
  `).join("");
}

function renderChat() {
  const claim = claimById(state.selectedClaimId);
  const messages = document.querySelector("#messages");
  messages.innerHTML = claim.messages.map((message) => `
    <div class="message ${message.mine ? "me" : ""}">
      <small>${message.from}</small>
      ${message.text}
    </div>
  `).join("");
  messages.scrollTop = messages.scrollHeight;
}

function renderSlots() {
  const claim = claimById(state.selectedClaimId);
  const visibleSlots = claim.slots.length ? claim.slots : slots;
  document.querySelector("#slot-grid").innerHTML = visibleSlots.map((slot) => `
    <button class="slot ${state.selectedSlot === slot ? "active" : ""}" type="button" data-slot="${slot}">
      ${slot}
    </button>
  `).join("");
}

function syncNavigation() {
  const activeHash = window.location.hash || "#dashboard";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === activeHash);
  });
}

function addTimeline(claim, title) {
  claim.timeline.push({ title, at: "nå" });
}

document.addEventListener("click", (event) => {
  const claimButton = event.target.closest("[data-select-claim]");
  if (claimButton) {
    state.selectedClaimId = claimButton.dataset.selectClaim;
    state.selectedSlot = null;
    render();
    return;
  }

  const roleButton = event.target.closest("[data-role]");
  if (roleButton) {
    state.activeRole = roleButton.dataset.role;
    document.querySelectorAll("[data-role]").forEach((button) => button.classList.toggle("active", button === roleButton));
    document.querySelector(`#${state.activeRole === "owner" ? "claims" : state.activeRole === "resident" ? "resident" : "calendar"}`).scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (event.target.closest("[data-open-new-claim]")) {
    document.querySelector("#resident").scrollIntoView({ behavior: "smooth" });
    document.querySelector("[name='description']").focus();
    return;
  }

  if (event.target.closest("[data-forward-claim]")) {
    const claim = claimById(state.selectedClaimId);
    const select = document.querySelector("[data-assign-vendor]");
    const vendor = select.value || "Betong AS";
    claim.vendor = vendor;
    claim.status = "assigned";
    addTimeline(claim, `Tildelt ${vendor}`);
    claim.messages.push({ from: "Utbygger", text: `${vendor} er koblet på saken og kommer med tidspunkt.`, mine: true });
    render();
    return;
  }

  if (event.target.closest("[data-close-claim]")) {
    const claim = claimById(state.selectedClaimId);
    claim.status = "closed";
    claim.confirmedByResident = true;
    claim.confirmedByVendor = true;
    addTimeline(claim, "Sak lukket og kvittering lagret");
    render();
    return;
  }

  const slotButton = event.target.closest("[data-slot]");
  if (slotButton) {
    state.selectedSlot = slotButton.dataset.slot;
    const claim = claimById(state.selectedClaimId);
    claim.status = "scheduled";
    if (!claim.slots.includes(state.selectedSlot)) {
      claim.slots = slots;
    }
    addTimeline(claim, `Tidspunkt valgt: ${state.selectedSlot}`);
    claim.messages.push({ from: claim.buyer.split(" ")[0], text: `${state.selectedSlot} passer fint.`, mine: false });
    render();
    return;
  }
});

document.querySelector("#status-filter").addEventListener("change", (event) => {
  state.statusFilter = event.target.value;
  renderClaims();
});

document.querySelector("#claim-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const unitValue = form.get("unit").toString();
  const [unit, buyer] = unitValue.split(" · ");
  const claim = {
    id: `T-${1043 + state.claims.length}`,
    title: `${form.get("room")} · ny reklamasjon`,
    unit,
    buyer,
    room: form.get("room").toString(),
    status: "new",
    severity: Number(form.get("severity")),
    vendor: null,
    due: "90 dager igjen",
    description: form.get("description").toString(),
    image: "assets/cracked-tile.png",
    created: "nå",
    timeline: [
      { title: "Reklamasjon mottatt", at: "nå" },
      { title: "SMS/push sendt til utbygger", at: "nå" },
    ],
    messages: [
      { from: buyer.split(" ")[0], text: form.get("description").toString(), mine: false },
      { from: "Tveller", text: "Saken er logget med bilde, enhet og reklamasjonsfrist.", mine: true },
    ],
    slots: [],
    confirmedByResident: false,
    confirmedByVendor: false,
  };
  state.claims.unshift(claim);
  state.selectedClaimId = claim.id;
  document.querySelector("#claims").scrollIntoView({ behavior: "smooth" });
  render();
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const text = form.get("message").toString().trim();
  if (!text) return;
  claimById(state.selectedClaimId).messages.push({ from: "Utbygger", text, mine: true });
  event.currentTarget.reset();
  renderChat();
});

document.querySelector("#send-slots").addEventListener("click", () => {
  const claim = claimById(state.selectedClaimId);
  claim.slots = slots;
  claim.status = "scheduled";
  addTimeline(claim, "Underleverandør sendte tre tidspunkt");
  claim.messages.push({ from: claim.vendor || "Underleverandør", text: "Vi kan komme 06.12 kl. 10:00, 12:00 eller 14:00.", mine: true });
  render();
});

document.querySelector("#confirm-fix").addEventListener("click", () => {
  const claim = claimById(state.selectedClaimId);
  claim.confirmedByVendor = true;
  claim.confirmedByResident = true;
  claim.status = "closed";
  addTimeline(claim, "Utbedring bekreftet av beboer og leverandør");
  claim.messages.push({ from: "Tveller", text: "Kvittering er lagret i dokumentloggen.", mine: true });
  render();
});

document.querySelector("#seed-critical").addEventListener("click", () => {
  const claim = {
    id: `T-${1100 + state.claims.length}`,
    title: "Vannlekkasje under kjøkkenbenk",
    unit: "A204",
    buyer: "Amir Halvorsen",
    room: "Kjøkken",
    status: "new",
    severity: 5,
    vendor: null,
    due: "må håndteres i dag",
    description: "Beboer melder vann under kjøkkenbenk. Saken bør rutes direkte til rørlegger.",
    image: "assets/cracked-tile.png",
    created: "nå",
    timeline: [
      { title: "Hastesak mottatt", at: "nå" },
      { title: "Push-varsel sendt", at: "nå" },
    ],
    messages: [
      { from: "Amir", text: "Det ligger vann under kjøkkenbenken.", mine: false },
    ],
    slots: [],
    confirmedByResident: false,
    confirmedByVendor: false,
  };
  state.claims.unshift(claim);
  state.selectedClaimId = claim.id;
  render();
});

document.querySelector("#add-unit").addEventListener("click", () => {
  const number = String(state.units.length + 104).padStart(3, "0");
  state.units.push({ unit: `D${number}`, buyer: "Ny kjøper", invited: true, connected: false });
  renderUnits();
  renderMetrics();
});

window.addEventListener("hashchange", syncNavigation);
render();
