function setActiveNav() {
  const path = (location.pathname || '').toLowerCase();
  const links = document.querySelectorAll('[data-nav]');
  links.forEach((a) => a.classList.remove('active'));

  let activeKey = 'home';
  if (path.endsWith('mybookings.html')) activeKey = 'mybookings';

  const active = document.querySelector(`[data-nav="${activeKey}"]`);
  if (active) active.classList.add('active');
}

const AUTH_KEYS = {
  users: 'hotel_users',
  session: 'hotel_session',
};

function getPageName() {
  const p = String(location.pathname || '').toLowerCase();
  return p.split('/').pop() || 'index.html';
}

function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(AUTH_KEYS.session, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEYS.session);
}

function getUsers() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.users);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
}

function isValidPassword(pw) {
  return String(pw || '').trim().length >= 4;
}

function requireAuth() {
  const page = getPageName();
  const session = getSession();
  const isAuthPage = page === 'login.html' || page === 'signup.html';

  if (isAuthPage) {
    if (session && session.email) window.location.href = 'index.html';
    return;
  }

  if (!session || !session.email) window.location.href = 'login.html';
}

const ROOM_INVENTORY = [
  // Single (10)
  { id: 'S-101', type: 'single', title: 'Single Room', about: 'Cozy room for solo travelers with a comfortable bed, work desk, and fast Wi‑Fi.', image: 'assets/single.jpg' },
  { id: 'S-102', type: 'single', title: 'Single Room', about: 'Quiet corner room with soft lighting, minibar, and complimentary water.', image: 'assets/single.jpg' },
  { id: 'S-103', type: 'single', title: 'Single Room', about: 'Comfortable single room with fresh linens and a compact work area.', image: 'assets/single.jpg' },
  { id: 'S-104', type: 'single', title: 'Single Room', about: 'Single room with great lighting and a relaxing seating corner.', image: 'assets/single.jpg' },
  { id: 'S-105', type: 'single', title: 'Single Room', about: 'Peaceful stay with quick access to amenities and Wi‑Fi.', image: 'assets/single.jpg' },
  { id: 'S-106', type: 'single', title: 'Single Room', about: 'Well‑planned space with smart storage and clean design.', image: 'assets/single.jpg' },
  { id: 'S-107', type: 'single', title: 'Single Room', about: 'Perfect for business trips: desk, charging points, and calm vibes.', image: 'assets/single.jpg' },
  { id: 'S-108', type: 'single', title: 'Single Room', about: 'Soft lighting, cozy bed, and quiet ambience for deep rest.', image: 'assets/single.jpg' },
  { id: 'S-109', type: 'single', title: 'Single Room', about: 'Comfort-first room with housekeeping-ready cleanliness.', image: 'assets/single.jpg' },
  { id: 'S-110', type: 'single', title: 'Single Room', about: 'A neat single room with simple premium touches.', image: 'assets/single.jpg' },

  // Double (10)
  { id: 'D-201', type: 'double', title: 'Double Room', about: 'Ideal for two guests with a spacious bed, seating area, and ensuite bathroom.', image: 'assets/double.jpg' },
  { id: 'D-202', type: 'double', title: 'Double Room', about: 'Bright room with city view, extra storage, and premium toiletries.', image: 'assets/double.jpg' },
  { id: 'D-203', type: 'double', title: 'Double Room', about: 'Comfortable double room with extra space and a cozy sitting area.', image: 'assets/double.jpg' },
  { id: 'D-204', type: 'double', title: 'Double Room', about: 'Great for couples with soft bedding and a calm ambience.', image: 'assets/double.jpg' },
  { id: 'D-205', type: 'double', title: 'Double Room', about: 'Double room with practical storage and bright interiors.', image: 'assets/double.jpg' },
  { id: 'D-206', type: 'double', title: 'Double Room', about: 'Modern room with upgraded lighting and premium feel.', image: 'assets/double.jpg' },
  { id: 'D-207', type: 'double', title: 'Double Room', about: 'Relaxing stay with seating corner and smooth room service access.', image: 'assets/double.jpg' },
  { id: 'D-208', type: 'double', title: 'Double Room', about: 'Spacious comfort for two with great ventilation and cleanliness.', image: 'assets/double.jpg' },
  { id: 'D-209', type: 'double', title: 'Double Room', about: 'A bright double room suitable for short or long stays.', image: 'assets/double.jpg' },
  { id: 'D-210', type: 'double', title: 'Double Room', about: 'Premium double room experience with extra comfort.', image: 'assets/double.jpg' },

  // Deluxe (10)
  { id: 'DX-301', type: 'deluxe', title: 'Deluxe Room', about: 'Elevated comfort with upgraded interiors, larger space, and plush bedding.', image: 'assets/delux.jpg' },
  { id: 'DX-302', type: 'deluxe', title: 'Deluxe Room', about: 'Perfect for a premium stay with lounge chair, premium linens, and scenic view.', image: 'assets/delux.jpg' },
  { id: 'DX-303', type: 'deluxe', title: 'Deluxe Room', about: 'Extra-wide workspace, espresso setup, and enhanced sound insulation.', image: 'assets/delux.jpg' },
  { id: 'DX-304', type: 'deluxe', title: 'Deluxe Room', about: 'Premium deluxe room with upgraded seating and a relaxing layout.', image: 'assets/delux.jpg' },
  { id: 'DX-305', type: 'deluxe', title: 'Deluxe Room', about: 'A refined stay with enhanced comfort and premium linens.', image: 'assets/delux.jpg' },
  { id: 'DX-306', type: 'deluxe', title: 'Deluxe Room', about: 'Deluxe space with modern interiors and calm lighting.', image: 'assets/delux.jpg' },
  { id: 'DX-307', type: 'deluxe', title: 'Deluxe Room', about: 'Premium room with extra space and a cozy ambience.', image: 'assets/delux.jpg' },
  { id: 'DX-308', type: 'deluxe', title: 'Deluxe Room', about: 'Comfort-forward deluxe room with premium feel throughout.', image: 'assets/delux.jpg' },
  { id: 'DX-309', type: 'deluxe', title: 'Deluxe Room', about: 'A spacious deluxe room designed for restful stays.', image: 'assets/delux.jpg' },
  { id: 'DX-310', type: 'deluxe', title: 'Deluxe Room', about: 'Top-tier comfort with thoughtful layout and premium touches.', image: 'assets/delux.jpg' },

  // Suite (10)
  { id: 'SU-401', type: 'suite', title: 'Suite', about: 'Separate living area, premium bath amenities, and a calm luxury ambience.', image: 'assets/suite.jpg' },
  { id: 'SU-402', type: 'suite', title: 'Suite', about: 'Spacious suite with extra seating, upgraded entertainment, and late checkout.', image: 'assets/suite.jpg' },
  { id: 'SU-403', type: 'suite', title: 'Suite', about: 'Our best suite experience with privacy, comfort, and premium service support.', image: 'assets/suite.jpg' },
  { id: 'SU-404', type: 'suite', title: 'Suite', about: 'Suite with a comfortable lounge area and premium service experience.', image: 'assets/suite.jpg' },
  { id: 'SU-405', type: 'suite', title: 'Suite', about: 'Luxury suite for longer stays with extra space and comfort.', image: 'assets/suite.jpg' },
  { id: 'SU-406', type: 'suite', title: 'Suite', about: 'Premium suite with calm interiors and comfortable seating.', image: 'assets/suite.jpg' },
  { id: 'SU-407', type: 'suite', title: 'Suite', about: 'Spacious suite with upgraded ambience and premium touches.', image: 'assets/suite.jpg' },
  { id: 'SU-408', type: 'suite', title: 'Suite', about: 'Suite featuring a living space and a comfortable premium bed.', image: 'assets/suite.jpg' },
  { id: 'SU-409', type: 'suite', title: 'Suite', about: 'Refined suite with privacy and a luxury ambience.', image: 'assets/suite.jpg' },
  { id: 'SU-410', type: 'suite', title: 'Suite', about: 'Best-in-class suite with premium layout and comfort.', image: 'assets/suite.jpg' },
];

// Prefer server-backed rooms (MongoDB) when available.
let roomsCache = null;

async function loadRoomsFromServer() {
  try {
    const resp = await apiJson('/api/rooms');
    const rooms = resp && Array.isArray(resp.rooms) ? resp.rooms : null;
    if (rooms && rooms.length) roomsCache = rooms;
  } catch {
    // ignore and keep client fallback
  }
}

function getRooms() {
  return roomsCache && roomsCache.length ? roomsCache : ROOM_INVENTORY;
}

const ROOM_PRICING_PER_NIGHT = {
  single: 2500,
  double: 3800,
  deluxe: 5200,
  suite: 8200,
};

function getRoomById(roomId) {
  const rooms = getRooms();
  return rooms.find((r) => (r.roomId || r.id) === roomId) || null;
}

function formatINR(amount) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${Math.round(Number(amount) || 0)}`;
  }
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

function updateGreeting() {
  const el = document.getElementById('userGreeting');
  if (!el) return;
  const session = getSession();
  const name = session && session.name ? String(session.name).trim() : '';
  const email = session && session.email ? String(session.email).trim() : '';
  const label = name || (email ? email.split('@')[0] : '');
  el.textContent = label ? `Hi, ${label}` : '';
}

async function apiJson(path, options) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers ? options.headers : {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data && data.error ? String(data.error) : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

function handleBookNow() {
  window.location.href = 'booknow.html';
}

function renderRoomsForType(roomType) {
  const mount = document.getElementById('roomsMount');
  if (!mount) return;

  const rooms = getRooms().filter((r) => r.type === roomType);
  const typeLabel = roomType.charAt(0).toUpperCase() + roomType.slice(1);

  if (rooms.length === 0) {
    mount.innerHTML = `
      <div class="notice">No rooms available for <b>${typeLabel}</b>.</div>
    `;
    return;
  }

  const cards = rooms
    .map(
      (room) => `
        <div class="room-card">
          <img class="room-image" src="${room.image}" alt="${room.title}" />
          <div class="room-title">${room.title}</div>
          <div class="room-meta">Room ID: <b>${room.id}</b></div>
          <p class="room-about">${room.about}</p>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" data-book-room="1" data-room-id="${room.id}" data-room-title="${room.title}">Book Now</button>
          </div>
        </div>
      `
    )
    .join('');

  mount.innerHTML = `
    <div class="rating-note" style="margin-bottom: 10px;">Showing <b>${rooms.length}</b> room(s) for <b>${typeLabel}</b></div>
    <div class="rooms-grid">${cards}</div>
  `;
}

function handleBookRoom(roomId, roomTitle) {
  openPaymentModal(roomId, roomTitle);
}

let paymentModalWired = false;
let pendingRoom = null;

function ensurePaymentModal() {
  const existing = document.getElementById('paymentModalBackdrop');
  if (existing) return existing;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'paymentModalBackdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `
    <div class="modal" role="document" aria-label="Payment form">
      <div class="modal-header">
        <div>
          <div class="modal-title">Payment</div>
          <div class="modal-subtitle" id="paymentRoomLabel"></div>
        </div>
        <button class="icon-btn" type="button" aria-label="Close" data-close-payment>✕</button>
      </div>

      <form class="modal-body" id="paymentForm">
        <div class="grid-2">
          <label class="field compact">
            <span class="field-label">Check-in</span>
            <input class="input" type="date" id="payCheckIn" required />
          </label>
          <label class="field compact">
            <span class="field-label">Check-out</span>
            <input class="input" type="date" id="payCheckOut" required />
          </label>
        </div>

        <div class="grid-2">
          <label class="field compact">
            <span class="field-label">Full name</span>
            <input class="input" id="custName" autocomplete="name" placeholder="Enter your name" required />
          </label>
          <label class="field compact">
            <span class="field-label">Phone number</span>
            <input class="input" id="custPhone" inputmode="tel" autocomplete="tel" placeholder="e.g. 9876543210" required />
          </label>
        </div>

        <div class="grid-2">
          <label class="field compact">
            <span class="field-label">Email</span>
            <input class="input" id="custEmail" type="email" autocomplete="email" placeholder="you@example.com" required />
          </label>
          <label class="field compact">
            <span class="field-label">Payment method</span>
            <select class="select" id="payMethod" required>
              <option value="creditcard" selected>Credit Card</option>
              <option value="debitcard">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
            </select>
          </label>
        </div>

        <div id="payMethodCard">
          <div class="grid-2">
            <label class="field compact">
              <span class="field-label">Name on card</span>
              <input class="input" id="payCardName" autocomplete="cc-name" placeholder="Name on card" />
            </label>
            <label class="field compact">
              <span class="field-label">Card number</span>
              <input class="input" id="payCard" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" />
            </label>
          </div>

          <div class="grid-2">
            <label class="field compact">
              <span class="field-label">Expiry (MM/YY)</span>
              <input class="input" id="payExp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" />
            </label>
            <label class="field compact">
              <span class="field-label">CVV</span>
              <input class="input" id="payCvv" inputmode="numeric" autocomplete="cc-csc" placeholder="123" />
            </label>
          </div>
        </div>

        <div id="payMethodUpi" class="hidden">
          <div class="grid-2">
            <label class="field compact">
              <span class="field-label">UPI ID</span>
              <input class="input" id="payUpiId" placeholder="name@bank" />
            </label>
            <div class="notice" style="margin-top: 22px;">You will receive a collect request (demo).</div>
          </div>
        </div>

        <div id="payMethodCash" class="hidden">
          <div class="notice" style="margin-top: 10px;">Cash payment will be collected at check-in (demo).</div>
        </div>

        <div class="notice" id="paymentTotalNotice" style="margin-top: 10px;"></div>
        <div class="notice notice-success" id="paymentSuccess" style="margin-top: 10px; display:none;"></div>
        <div class="error-text" id="paymentError" style="display:none;"></div>

        <div class="actions-row" style="margin-top: 12px; justify-content: flex-end;">
          <button class="btn btn-secondary" type="button" data-cancel-payment>Cancel</button>
          <button class="btn btn-primary" type="submit" id="paySubmitBtn">Pay</button>
        </div>

        <div class="rating-note" style="margin-top:10px;">Demo only — no real payment is processed.</div>
      </form>
    </div>
  `;

  document.body.appendChild(backdrop);
  return backdrop;
}

function setPaymentError(message) {
  const el = document.getElementById('paymentError');
  if (!el) return;
  if (!message) {
    el.style.display = 'none';
    el.textContent = '';
    return;
  }
  el.style.display = 'block';
  el.textContent = message;
}

function getDigits(value) {
  return String(value || '').replace(/\D+/g, '');
}

function parseExpiry(value) {
  const raw = String(value || '').trim();
  const m = raw.match(/^(\d{1,2})\s*\/\s*(\d{2,4})$/);
  if (!m) return null;
  const month = Number(m[1]);
  let year = Number(m[2]);
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  if (!Number.isFinite(year)) return null;
  if (String(m[2]).length === 2) year = 2000 + year;
  return { month, year };
}

function isValidEmail(email) {
  const v = String(email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function daysBetweenISO(checkInISO, checkOutISO) {
  const a = new Date(String(checkInISO || ''));
  const b = new Date(String(checkOutISO || ''));
  if (isNaN(a) || isNaN(b)) return NaN;
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

function computeRoomTotal(roomId, nights) {
  const room = getRoomById(roomId);
  const perNight = ROOM_PRICING_PER_NIGHT[room && room.type ? room.type : 'single'] || 4000;
  const safeNights = Math.max(1, Math.min(30, Number(nights) || 1));
  return { perNight, total: perNight * safeNights };
}

function updatePaymentTotals() {
  if (!pendingRoom) return;
  const checkInEl = document.getElementById('payCheckIn');
  const checkOutEl = document.getElementById('payCheckOut');
  const notice = document.getElementById('paymentTotalNotice');
  if (!checkInEl || !checkOutEl || !notice) return;

  const checkIn = checkInEl.value;
  const checkOut = checkOutEl.value;
  const nights = daysBetweenISO(checkIn, checkOut);
  if (!checkIn || !checkOut || !Number.isFinite(nights) || nights <= 0) {
    notice.innerHTML = 'Total: <b>—</b>';
    return;
  }

  const { perNight, total } = computeRoomTotal(pendingRoom.roomId, nights);
  notice.innerHTML = `Total: <b>${formatINR(total)}</b> <span style="color: rgba(255,255,255,.58);">(${formatINR(perNight)}/night • ${nights} night(s))</span>`;
}

function setPaymentSuccess(message) {
  const el = document.getElementById('paymentSuccess');
  if (!el) return;
  if (!message) {
    el.style.display = 'none';
    el.textContent = '';
    return;
  }
  el.style.display = 'block';
  el.textContent = message;
}

function updatePaymentMethodUI() {
  const methodEl = document.getElementById('payMethod');
  if (!methodEl) return;
  const method = String(methodEl.value || '').toLowerCase();

  const cardSection = document.getElementById('payMethodCard');
  const upiSection = document.getElementById('payMethodUpi');
  const cashSection = document.getElementById('payMethodCash');

  const showCard = method === 'creditcard' || method === 'debitcard';
  const showUpi = method === 'upi';
  const showCash = method === 'cash';

  if (cardSection) cardSection.classList.toggle('hidden', !showCard);
  if (upiSection) upiSection.classList.toggle('hidden', !showUpi);
  if (cashSection) cashSection.classList.toggle('hidden', !showCash);
}

function closePaymentModal() {
  const backdrop = document.getElementById('paymentModalBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  pendingRoom = null;
  setPaymentError('');
  setPaymentSuccess('');
}

function openPaymentModal(roomId, roomTitle) {
  const backdrop = ensurePaymentModal();

  pendingRoom = { roomId, roomTitle };
  const roomLabel = document.getElementById('paymentRoomLabel');
  if (roomLabel) roomLabel.textContent = `${roomTitle} (${roomId})`;

  const checkInEl = document.getElementById('payCheckIn');
  const checkOutEl = document.getElementById('payCheckOut');
  const custNameEl = document.getElementById('custName');
  const custEmailEl = document.getElementById('custEmail');
  const custPhoneEl = document.getElementById('custPhone');
  const methodEl = document.getElementById('payMethod');

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const plusTwo = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const defaultCheckIn = tomorrow.toISOString().slice(0, 10);
  const defaultCheckOut = plusTwo.toISOString().slice(0, 10);

  const todayISO = new Date().toISOString().slice(0, 10);
  if (checkInEl) checkInEl.setAttribute('min', todayISO);
  if (checkOutEl) checkOutEl.setAttribute('min', defaultCheckIn);

  if (checkInEl) checkInEl.value = defaultCheckIn;
  if (checkOutEl) checkOutEl.value = defaultCheckOut;
  if (custNameEl) custNameEl.value = '';
  if (custEmailEl) custEmailEl.value = '';
  if (custPhoneEl) custPhoneEl.value = '';
  if (methodEl) methodEl.value = 'creditcard';

  const payCardNameEl = document.getElementById('payCardName');
  const cardEl = document.getElementById('payCard');
  const expEl = document.getElementById('payExp');
  const cvvEl = document.getElementById('payCvv');
  const upiEl = document.getElementById('payUpiId');
  if (payCardNameEl) payCardNameEl.value = '';
  if (cardEl) cardEl.value = '';
  if (expEl) expEl.value = '';
  if (cvvEl) cvvEl.value = '';
  if (upiEl) upiEl.value = '';

  const submitBtn = document.getElementById('paySubmitBtn');
  if (submitBtn && 'disabled' in submitBtn) submitBtn.disabled = false;

  setPaymentError('');
  setPaymentSuccess('');
  updatePaymentMethodUI();
  updatePaymentTotals();

  if (!paymentModalWired) {
    paymentModalWired = true;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePaymentModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePaymentModal();
    });

    const closeBtn = backdrop.querySelector('[data-close-payment]');
    if (closeBtn) closeBtn.addEventListener('click', closePaymentModal);
    const cancelBtn = backdrop.querySelector('[data-cancel-payment]');
    if (cancelBtn) cancelBtn.addEventListener('click', closePaymentModal);

    const methodSel = document.getElementById('payMethod');
    if (methodSel) {
      methodSel.addEventListener('change', () => {
        updatePaymentMethodUI();
        setPaymentError('');
      });
    }

    const checkInInput = document.getElementById('payCheckIn');
    const checkOutInput = document.getElementById('payCheckOut');
    if (checkInInput) {
      // On supporting browsers (Chrome/Edge), this forces the calendar to open.
      checkInInput.addEventListener('click', () => {
        if (typeof checkInInput.showPicker === 'function') checkInInput.showPicker();
      });
      checkInInput.addEventListener('change', () => {
        const v = checkInInput.value;
        if (checkOutInput && v) {
          checkOutInput.setAttribute('min', v);
          // If checkout is before new checkin, clear it.
          if (checkOutInput.value && checkOutInput.value <= v) checkOutInput.value = '';
        }
        updatePaymentTotals();
      });
    }
    if (checkOutInput) {
      checkOutInput.addEventListener('click', () => {
        if (typeof checkOutInput.showPicker === 'function') checkOutInput.showPicker();
      });
      checkOutInput.addEventListener('change', updatePaymentTotals);
    }

    const form = document.getElementById('paymentForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!pendingRoom) return;

        setPaymentError('');
        setPaymentSuccess('');

        const checkIn = String((document.getElementById('payCheckIn') || {}).value || '');
        const checkOut = String((document.getElementById('payCheckOut') || {}).value || '');
        const nights = daysBetweenISO(checkIn, checkOut);
        const customerName = String((document.getElementById('custName') || {}).value || '').trim();
        const customerEmail = String((document.getElementById('custEmail') || {}).value || '').trim();
        const customerPhoneDigits = getDigits((document.getElementById('custPhone') || {}).value);
        const method = String((document.getElementById('payMethod') || {}).value || '').toLowerCase();

        if (!checkIn) return setPaymentError('Please select a check-in date.');
        if (!checkOut) return setPaymentError('Please select a check-out date.');
        if (!Number.isFinite(nights) || nights <= 0) return setPaymentError('Check-out must be after check-in.');
        if (nights > 30) return setPaymentError('Please select up to 30 nights.');
        if (!customerName) return setPaymentError('Please enter your name.');
        if (!isValidEmail(customerEmail)) return setPaymentError('Please enter a valid email address.');
        if (customerPhoneDigits.length < 10 || customerPhoneDigits.length > 15) return setPaymentError('Please enter a valid phone number.');
        if (!method) return setPaymentError('Please select a payment method.');

        let payment = { method, amount: 0, currency: 'INR', paidAt: new Date().toISOString() };

        if (method === 'creditcard' || method === 'debitcard') {
          const cardName = String((document.getElementById('payCardName') || {}).value || '').trim();
          const cardNumberDigits = getDigits((document.getElementById('payCard') || {}).value);
          const expiry = parseExpiry((document.getElementById('payExp') || {}).value);
          const cvvDigits = getDigits((document.getElementById('payCvv') || {}).value);

          if (!cardName) return setPaymentError('Please enter the name on card.');
          if (cardNumberDigits.length < 12 || cardNumberDigits.length > 19) return setPaymentError('Please enter a valid card number.');
          if (!expiry) return setPaymentError('Please enter a valid expiry in MM/YY.');
          if (cvvDigits.length < 3 || cvvDigits.length > 4) return setPaymentError('Please enter a valid CVV.');

          const now = new Date();
          const expDate = new Date(expiry.year, expiry.month, 0, 23, 59, 59);
          if (expDate < now) return setPaymentError('This card looks expired.');

          payment = {
            ...payment,
            method,
            last4: cardNumberDigits.slice(-4),
            cardName,
          };
        }

        if (method === 'upi') {
          const upiId = String((document.getElementById('payUpiId') || {}).value || '').trim();
          if (!upiId) return setPaymentError('Please enter your UPI ID.');
          if (!/^[\w.\-]{2,}@[\w]{2,}$/.test(upiId)) return setPaymentError('Please enter a valid UPI ID (e.g. name@bank).');
          payment = { ...payment, method, upiId };
        }

        if (method === 'cash') {
          payment = { ...payment, method, note: 'Cash on arrival' };
        }

        const { total } = computeRoomTotal(pendingRoom.roomId, nights);
        payment.amount = total;

        const submitBtn = document.getElementById('paySubmitBtn');
        if (submitBtn && 'disabled' in submitBtn) submitBtn.disabled = true;

        (async () => {
          try {
            const payload = {
              name: customerName,
              phone: customerPhoneDigits,
              email: customerEmail,
                roomId: pendingRoom.roomId,
                roomTitle: pendingRoom.roomTitle,
              checkIn,
              checkOut,
              paymentMethod: method,
              paymentDetails: {
                amount: payment.amount,
                currency: payment.currency,
              },
            };

            if (method === 'creditcard' || method === 'debitcard') {
              payload.paymentDetails.cardNumber = String((document.getElementById('payCard') || {}).value || '');
            }

            if (method === 'upi') {
              payload.paymentDetails.upiId = String((document.getElementById('payUpiId') || {}).value || '').trim();
            }

            const resp = await apiJson('/api/bookings', {
              method: 'POST',
              body: JSON.stringify(payload),
            });

            const bookingId = resp && resp.booking && resp.booking.bookingId ? resp.booking.bookingId : '';
            setPaymentSuccess(bookingId ? `Payment successful. Booking confirmed! ID: ${bookingId}` : 'Payment successful. Booking confirmed!');

            window.setTimeout(() => {
              closePaymentModal();
              window.location.href = 'mybookings.html';
            }, 900);
          } catch (err) {
            const msg = err && err.message ? err.message : 'Failed to create booking.';
            setPaymentError(msg);
            if (submitBtn && 'disabled' in submitBtn) submitBtn.disabled = false;
          }
        })();
      });
    }
  }

  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');

  const first = document.getElementById('payCheckIn');
  if (first && typeof first.focus === 'function') first.focus();
}

function renderBookings() {
  const mount = document.getElementById('bookingsMount');
  if (!mount) return;

  mount.innerHTML = '<div class="notice">Loading bookings…</div>';

  (async () => {
    try {
      const resp = await apiJson('/api/bookings');
      const bookings = resp && Array.isArray(resp.bookings) ? resp.bookings : [];

      if (bookings.length === 0) {
        mount.innerHTML = `
          <div class="notice">
            No bookings yet. Go to <a href="index.html" style="color: rgba(110,231,255,.92); text-decoration: underline;">Home</a> and click <b>Book Now</b>.
          </div>
        `;
        return;
      }

      const rows = bookings
        .map((b) => {
          const status = b.status || 'Success';
          const canCancel = String(status).toLowerCase() !== 'canceled';
          const bookingId = b.bookingId || b.id || '-';
          return `
            <tr>
              <td>${bookingId}</td>
              <td>${b.name || '-'}</td>
              <td>${b.phone || '-'}</td>
              <td>${b.email || '-'}</td>
              <td>${status}</td>
              <td>${canCancel ? `<button class="btn" type="button" data-cancel-booking="1" data-booking-id="${bookingId}">Cancel</button>` : `<span class="rating-note">—</span>`}</td>
            </tr>
          `;
        })
        .join('');

      mount.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } catch (err) {
      const msg = err && err.message ? err.message : 'Failed to load bookings.';
      mount.innerHTML = `<div class="notice">${msg}</div>`;
    }
  })();
}

function cancelBooking(bookingId) {
  (async () => {
    try {
      await apiJson(`/api/bookings/${encodeURIComponent(String(bookingId || ''))}/cancel`, {
        method: 'PATCH',
      });
      renderBookings();
    } catch (err) {
      const msg = err && err.message ? err.message : 'Failed to cancel booking.';
      // eslint-disable-next-line no-alert
      alert(msg);
    }
  })();
}

function wireEvents() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = String((document.getElementById('loginEmail') || {}).value || '').trim().toLowerCase();
      const password = String((document.getElementById('loginPassword') || {}).value || '');
      const msg = document.getElementById('authMsg');
      if (msg) msg.textContent = '';

      if (!email) {
        if (msg) msg.textContent = 'Please enter your email.';
        return;
      }
      if (!password) {
        if (msg) msg.textContent = 'Please enter your password.';
        return;
      }

      (async () => {
        try {
          const resp = await apiJson('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          const u = resp && resp.user ? resp.user : null;
          if (!u || !u.email) throw new Error('Login failed');
          setSession({ email: u.email, name: u.name || '' });
          window.location.href = 'index.html';
        } catch (err) {
          if (msg) msg.textContent = err && err.message ? err.message : 'Invalid email or password.';
        }
      })();
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = String((document.getElementById('signupName') || {}).value || '').trim();
      const email = String((document.getElementById('signupEmail') || {}).value || '').trim().toLowerCase();
      const password = String((document.getElementById('signupPassword') || {}).value || '');
      const confirmPw = String((document.getElementById('signupConfirm') || {}).value || '');
      const msg = document.getElementById('authMsg');
      if (msg) msg.textContent = '';

      if (!name) {
        if (msg) msg.textContent = 'Please enter your name.';
        return;
      }
      if (!isValidEmail(email)) {
        if (msg) msg.textContent = 'Please enter a valid email.';
        return;
      }
      if (!isValidPassword(password)) {
        if (msg) msg.textContent = 'Password must be at least 4 characters.';
        return;
      }
      if (password !== confirmPw) {
        if (msg) msg.textContent = 'Passwords do not match.';
        return;
      }

      (async () => {
        try {
          const resp = await apiJson('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
          });
          const u = resp && resp.user ? resp.user : null;
          if (!u || !u.email) throw new Error('Signup failed');
          setSession({ email: u.email, name: u.name || name });
          window.location.href = 'index.html';
        } catch (err) {
          if (msg) msg.textContent = err && err.message ? err.message : 'Failed to create account.';
        }
      })();
    });
  }

  const bookNowBtn = document.getElementById('bookNowBtn');
  if (bookNowBtn) bookNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleBookNow();
  });

  const totalRooms = document.getElementById('totalRooms');
  if (totalRooms) totalRooms.textContent = String(getRooms().length);

  const showRoomsBtn = document.getElementById('showRoomsBtn');
  if (showRoomsBtn) {
    showRoomsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const select = document.getElementById('roomTypeSelect');
      const roomType = select && 'value' in select ? select.value : '';

      if (!roomType) {
        const mount = document.getElementById('roomsMount');
        if (mount) mount.innerHTML = '<div class="notice">Please select a room type first.</div>';
        return;
      }

      renderRoomsForType(roomType);
    });
  }

  const roomsMount = document.getElementById('roomsMount');
  if (roomsMount) {
    roomsMount.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const btn = t.closest('[data-book-room="1"]');
      if (!(btn instanceof HTMLElement)) return;

      const roomId = btn.getAttribute('data-room-id') || '';
      const roomTitle = btn.getAttribute('data-room-title') || 'Room';
      if (!roomId) return;
      handleBookRoom(roomId, roomTitle);
    });
  }

  const bookingsMount = document.getElementById('bookingsMount');
  if (bookingsMount) {
    bookingsMount.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const btn = t.closest('[data-cancel-booking="1"]');
      if (!(btn instanceof HTMLElement)) return;
      const bookingId = btn.getAttribute('data-booking-id') || '';
      if (!bookingId) return;
      cancelBooking(bookingId);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  setActiveNav();
  updateGreeting();
  wireEvents();
  renderBookings();
  loadRoomsFromServer().then(() => {
    const totalRooms = document.getElementById('totalRooms');
    if (totalRooms) totalRooms.textContent = String(getRooms().length);
  });
});
