/* =====================================================
   ANGKringan POS — Local Storage App (v3 - Fixed)
   ===================================================== */

const LS = {
  menu:  'angkringan.menu.v1',
  trx:   'angkringan.trx.v1',
  exp:   'angkringan.exp.v1',
  range: 'angkringan.range.v1',
  period:'angkringan.period.v1'
};

const CATS = ['Makanan', 'Minuman', 'Rokok Bungkus', 'Rokok Ecer'];

const DEFAULT_MENU = [
  { id: 1,  name: 'Nasi Kucing',        cat: 'Makanan', price: 3000 },
  { id: 2,  name: 'Sate Usus',          cat: 'Makanan', price: 2000 },
  { id: 3,  name: 'Sate Telur Puyuh',   cat: 'Makanan', price: 2000 },
  { id: 4,  name: 'Tempe Bacem',        cat: 'Makanan', price: 1500 },
  { id: 5,  name: 'Tahu Bacem',         cat: 'Makanan', price: 1500 },
  { id: 6,  name: 'Ceker',              cat: 'Makanan', price: 2000 },
  { id: 7,  name: 'Bakwan',             cat: 'Makanan', price: 1000 },
  { id: 8,  name: 'Gorengan',           cat: 'Makanan', price: 1000 },
  { id: 9,  name: 'Sate Ayam',          cat: 'Makanan', price: 3000 },
  { id: 10, name: 'Indomie Goreng',     cat: 'Makanan', price: 5000 },
  { id: 11, name: 'Teh Panas',          cat: 'Minuman', price: 2000 },
  { id: 12, name: 'Es Teh',             cat: 'Minuman', price: 3000 },
  { id: 13, name: 'Kopi Hitam',         cat: 'Minuman', price: 3000 },
  { id: 14, name: 'Jeruk Panas',        cat: 'Minuman', price: 3000 },
  { id: 15, name: 'Es Jeruk',           cat: 'Minuman', price: 4000 },
  { id: 16, name: 'Air Mineral',        cat: 'Minuman', price: 3000 },
  { id: 17, name: 'Wedang Jahe',        cat: 'Minuman', price: 4000 },
  { id: 18, name: 'Susu Jahe',          cat: 'Minuman', price: 5000 },
  { id: 19, name: 'Gudang Garam Surya 12', cat: 'Rokok Bungkus', price: 28000 },
  { id: 20, name: 'Sampoerna Mild 16',     cat: 'Rokok Bungkus', price: 32000 },
  { id: 21, name: 'Djarum Super 12',       cat: 'Rokok Bungkus', price: 27000 },
  { id: 22, name: 'Marlboro Merah 20',     cat: 'Rokok Bungkus', price: 40000 },
  { id: 23, name: 'Surya 12 (ecer)',       cat: 'Rokok Ecer', price: 2000 },
  { id: 24, name: 'Sampoerna Mild (ecer)', cat: 'Rokok Ecer', price: 2500 },
  { id: 25, name: 'Djarum Super (ecer)',   cat: 'Rokok Ecer', price: 2000 },
  { id: 26, name: 'Marlboro (ecer)',       cat: 'Rokok Ecer', price: 2500 }
];

/* =============== STATE =============== */
let state = {
  menu: [],
  trx: [],
  exp: [],
  cart: [],
  activeCat: 'Makanan',
  period: 'today',
  payMethod: 'tunai',
  editingKasbonId: null,
  customStart: '',
  customEnd: ''
};

/* =============== UTILS =============== */
const fmt = n => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID');
const uid = () => Date.now() + Math.floor(Math.random() * 1000);
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
);

function isRokokCat(cat) {
  return cat === 'Rokok Bungkus' || cat === 'Rokok Ecer';
}

function getItemCat(item) {
  if (item.cat) return item.cat;
  const m = state.menu.find(x => x.id === item.id);
  return m ? m.cat : null;
}

function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + (type === 'info' ? '' : type);
  clearTimeout(el._t);
  el._t = setTimeout(() => el.className = 'toast', 2400);
}

function todayStr() {
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function formatDateTime(iso) {
  const d = new Date(iso);
  const z = n => String(n).padStart(2, '0');
  return `${z(d.getDate())}/${z(d.getMonth()+1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`;
}

function formatDateLong(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

/* =============== STORAGE =============== */
function loadAll() {
  try { state.menu = JSON.parse(localStorage.getItem(LS.menu)) || DEFAULT_MENU.slice(); }
  catch { state.menu = DEFAULT_MENU.slice(); }
  try { state.trx = JSON.parse(localStorage.getItem(LS.trx)) || []; }
  catch { state.trx = []; }
  try { state.exp = JSON.parse(localStorage.getItem(LS.exp)) || []; }
  catch { state.exp = []; }
}
const saveMenu = () => localStorage.setItem(LS.menu, JSON.stringify(state.menu));
const saveTrx  = () => localStorage.setItem(LS.trx,  JSON.stringify(state.trx));
const saveExp  = () => localStorage.setItem(LS.exp,  JSON.stringify(state.exp));

function saveRange() {
  localStorage.setItem(LS.range, JSON.stringify({
    start: state.customStart,
    end: state.customEnd
  }));
}
function loadRange() {
  try {
    const r = JSON.parse(localStorage.getItem(LS.range));
    if (r) {
      state.customStart = r.start || '';
      state.customEnd   = r.end   || '';
    }
  } catch {}
}
function savePeriod() {
  localStorage.setItem(LS.period, state.period);
}
function loadPeriod() {
  const p = localStorage.getItem(LS.period);
  if (p) state.period = p;
}

/* =====================================================
   NAVIGASI TAB
   ===================================================== */
document.getElementById('nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if (!btn) return;
  const tab = btn.dataset.tab;

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.tab-panel').forEach(p =>
    p.classList.toggle('active', p.id === 'tab-' + tab)
  );

  if (tab === 'kasir')        renderKasir();
  if (tab === 'kasbon')       renderKasbon();
  if (tab === 'rekap')        renderRekap();
  if (tab === 'pengeluaran')  renderPengeluaran();
  if (tab === 'menu')         renderMenuManage();
});

/* =====================================================
   KASIR
   ===================================================== */
function renderCatTabs() {
  const el = document.getElementById('catTabs');
  el.innerHTML = CATS.map(c =>
    `<button class="cat-tab ${c === state.activeCat ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join('');
}

function renderItemGrid() {
  const grid = document.getElementById('itemGrid');
  const items = state.menu.filter(m => m.cat === state.activeCat);
  if (!items.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1">Belum ada item di kategori ini</div>`;
    return;
  }
  grid.innerHTML = items.map(m => `
    <button class="item-card" data-id="${m.id}">
      <div class="item-name">${esc(m.name)}</div>
      <div class="item-price">${fmt(m.price)}</div>
    </button>
  `).join('');
}

function totalCart() {
  return state.cart.reduce((s, c) => s + c.price * c.qty, 0);
}

function renderCart() {
  const el = document.getElementById('cartItems');
  if (!state.cart.length) {
    el.innerHTML = `<div class="empty">Keranjang kosong</div>`;
  } else {
    el.innerHTML = state.cart.map((c, i) => `
      <div class="cart-item">
        <div class="cart-info">
          <div class="cart-name">${esc(c.name)}</div>
          <div class="cart-price">${fmt(c.price)} × ${c.qty}</div>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" data-act="dec" data-i="${i}">−</button>
          <span class="qty">${c.qty}</span>
          <button class="qty-btn" data-act="inc" data-i="${i}">+</button>
        </div>
        <div class="cart-sub">${fmt(c.price * c.qty)}</div>
        <button class="del-btn" data-act="del" data-i="${i}">✕</button>
      </div>
    `).join('');
  }
  document.getElementById('cartTotal').textContent = fmt(totalCart());
  updateChange();
}

function renderKasir() {
  renderCatTabs();
  renderItemGrid();
  renderCart();

  if (state.editingKasbonId) {
    const trx = state.trx.find(t => t.id === state.editingKasbonId);
    if (trx) {
      document.getElementById('kasbonEditBanner').style.display = 'flex';
      document.getElementById('kasbonEditText').textContent = `📝 Menambah item untuk kasbon: ${trx.customer}`;
      document.getElementById('btnKasbon').textContent = '💾 Simpan Perubahan';
    } else {
      cancelKasbonEdit();
    }
  } else {
    document.getElementById('kasbonEditBanner').style.display = 'none';
    document.getElementById('btnKasbon').textContent = '📝 Kasbon';
  }
}

/* --- Kategori --- */
document.getElementById('catTabs').addEventListener('click', e => {
  const btn = e.target.closest('.cat-tab');
  if (!btn) return;
  state.activeCat = btn.dataset.cat;
  renderCatTabs();
  renderItemGrid();
});

/* --- Tambah item ke cart --- */
document.getElementById('itemGrid').addEventListener('click', e => {
  const btn = e.target.closest('.item-card');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const item = state.menu.find(m => m.id === id);
  if (!item) return;

  const exist = state.cart.find(c => c.id === id);
  if (exist) exist.qty += 1;
  else state.cart.push({
    id: item.id, name: item.name, price: item.price, qty: 1, cat: item.cat
  });

  renderCart();
});

/* --- Kontrol cart --- */
document.getElementById('cartItems').addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const i = Number(btn.dataset.i);
  const act = btn.dataset.act;

  if (act === 'inc') state.cart[i].qty += 1;
  if (act === 'dec') {
    state.cart[i].qty -= 1;
    if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
  }
  if (act === 'del') state.cart.splice(i, 1);

  renderCart();
});

/* --- Metode pembayaran --- */
document.querySelectorAll('input[name="payMethod"]').forEach(r => {
  r.addEventListener('change', e => {
    state.payMethod = e.target.value;
    document.getElementById('cashBlock').style.display = state.payMethod === 'tunai' ? 'flex' : 'none';
    updateChange();
  });
});

/* --- Uang diterima & kembalian --- */
document.getElementById('cashInput').addEventListener('input', updateChange);

function updateChange() {
  const total = totalCart();
  const cash = Number(document.getElementById('cashInput').value) || 0;
  const change = cash - total;
  const el = document.getElementById('changeDisplay');
  const row = document.getElementById('changeRow');

  if (cash === 0 || total === 0) {
    el.textContent = fmt(0);
    row.classList.remove('negative');
    return;
  }

  if (change < 0) {
    el.textContent = '-' + fmt(Math.abs(change));
    row.classList.add('negative');
  } else {
    el.textContent = fmt(change);
    row.classList.remove('negative');
  }
}

/* --- Bayar Lunas --- */
document.getElementById('btnBayar').addEventListener('click', () => {
  if (!state.cart.length) return toast('Keranjang masih kosong', 'error');

  const total = totalCart();
  const cust = document.getElementById('customerName').value.trim();
  const method = state.payMethod;

  let cash = total, change = 0;
  if (method === 'tunai') {
    cash = Number(document.getElementById('cashInput').value) || 0;
    if (cash < total) return toast('Uang tidak cukup!', 'error');
    change = cash - total;
  }

  if (state.editingKasbonId) {
    const trx = state.trx.find(t => t.id === state.editingKasbonId);
    if (trx) {
      trx.items = state.cart.map(c => ({ ...c }));
      trx.total = total;
      trx.status = 'paid';
      trx.paidAt = new Date().toISOString();
      trx.method = method;
      trx.cash = cash;
      trx.change = change;
    }
    state.editingKasbonId = null;
    document.getElementById('kasbonEditBanner').style.display = 'none';
    document.getElementById('btnKasbon').textContent = '📝 Kasbon';
    toast(`Kasbon lunas! Kembalian ${fmt(change)}`, 'success');
  } else {
    state.trx.unshift({
      id: uid(),
      date: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      status: 'paid',
      customer: cust || 'Pelanggan',
      items: state.cart.map(c => ({ ...c })),
      total,
      method,
      cash,
      change
    });
    toast(`Lunas! Kembalian ${fmt(change)}`, 'success');
  }

  saveTrx();
  state.cart = [];
  document.getElementById('customerName').value = '';
  document.getElementById('cashInput').value = '';
  renderCart();
  updateBadge();
});

/* --- Kasbon --- */
document.getElementById('btnKasbon').addEventListener('click', () => {
  if (!state.cart.length) return toast('Keranjang masih kosong', 'error');

  if (state.editingKasbonId) {
    const trx = state.trx.find(t => t.id === state.editingKasbonId);
    if (trx) {
      trx.items = state.cart.map(c => ({ ...c }));
      trx.total = totalCart();
      const newName = document.getElementById('customerName').value.trim();
      if (newName) trx.customer = newName;
    }
    saveTrx();
    state.editingKasbonId = null;
    document.getElementById('kasbonEditBanner').style.display = 'none';
    document.getElementById('btnKasbon').textContent = '📝 Kasbon';
    state.cart = [];
    document.getElementById('customerName').value = '';
    renderCart();
    updateBadge();
    toast('Kasbon berhasil diperbarui', 'success');
    return;
  }

  const cust = document.getElementById('customerName').value.trim();
  if (!cust) return toast('Isi nama pelanggan untuk kasbon', 'error');

  state.trx.unshift({
    id: uid(),
    date: new Date().toISOString(),
    paidAt: null,
    status: 'unpaid',
    customer: cust,
    items: state.cart.map(c => ({ ...c })),
    total: totalCart(),
    method: null,
    cash: 0,
    change: 0
  });
  saveTrx();

  state.cart = [];
  document.getElementById('customerName').value = '';
  renderCart();
  updateBadge();
  toast(`Kasbon ${cust}: ${fmt(state.trx[0].total)}`, 'success');
});

/* --- Kosongkan cart --- */
document.getElementById('btnClearCart').addEventListener('click', () => {
  if (!state.cart.length) return;
  if (!confirm('Kosongkan keranjang?')) return;
  state.cart = [];
  if (state.editingKasbonId) cancelKasbonEdit();
  else renderCart();
});

/* --- Batal edit kasbon --- */
document.getElementById('btnCancelKasbonEdit').addEventListener('click', cancelKasbonEdit);

function cancelKasbonEdit() {
  state.editingKasbonId = null;
  state.cart = [];
  document.getElementById('customerName').value = '';
  document.getElementById('kasbonEditBanner').style.display = 'none';
  document.getElementById('btnKasbon').textContent = '📝 Kasbon';
  renderCart();
}

/* =====================================================
   KASBON
   ===================================================== */
function renderKasbon() {
  const el = document.getElementById('kasbonList');
  const unpaid = state.trx.filter(t => t.status === 'unpaid');

  if (!unpaid.length) {
    el.innerHTML = `<div class="empty">Tidak ada kasbon. Semua lunas 👍</div>`;
    return;
  }

  el.innerHTML = unpaid.map(t => {
    const itemLines = t.items.map(it => `
      <div class="kasbon-item-line">
        <span class="name">${esc(it.name)}</span>
        <span class="qty">×${it.qty}</span>
        <span class="price">${fmt(it.price * it.qty)}</span>
      </div>
    `).join('');

    return `
      <div class="kasbon-card">
        <div class="kasbon-head">
          <div>
            <div class="list-title">${esc(t.customer)} <span class="tag unpaid">KASBON</span></div>
            <div class="list-sub">${formatDateTime(t.date)}</div>
          </div>
          <div class="kasbon-total">${fmt(t.total)}</div>
        </div>
        <div class="kasbon-items">${itemLines}</div>
        <div class="kasbon-actions">
          <button class="btn btn-sm btn-primary" data-add="${t.id}">➕ Tambah Item</button>
          <button class="btn btn-sm btn-success" data-pay="${t.id}">✔ Bayar Lunas</button>
          <button class="btn btn-sm btn-danger" data-del="${t.id}">🗑 Hapus</button>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('kasbonList').addEventListener('click', e => {
  const addBtn = e.target.closest('[data-add]');
  const payBtn = e.target.closest('[data-pay]');
  const delBtn = e.target.closest('[data-del]');

  if (addBtn) editKasbon(Number(addBtn.dataset.add));

  if (payBtn) {
    const t = state.trx.find(x => x.id === Number(payBtn.dataset.pay));
    if (!t) return;
    if (!confirm(`Tandai lunas: ${t.customer} — ${fmt(t.total)}?`)) return;
    t.status = 'paid';
    t.paidAt = new Date().toISOString();
    t.method = t.method || 'tunai';
    t.cash = t.total;
    t.change = 0;
    saveTrx();
    renderKasbon();
    updateBadge();
    toast('Kasbon ditandai lunas', 'success');
  }

  if (delBtn) {
    if (!confirm('Hapus catatan kasbon ini?')) return;
    state.trx = state.trx.filter(x => x.id !== Number(delBtn.dataset.del));
    saveTrx();
    renderKasbon();
    updateBadge();
    toast('Kasbon dihapus', 'success');
  }
});

function editKasbon(id) {
  const trx = state.trx.find(t => t.id === id);
  if (!trx) return;
  if (state.cart.length && !confirm('Keranjang saat ini akan digantikan. Lanjutkan?')) return;

  state.editingKasbonId = id;
  state.cart = trx.items.map(i => ({ ...i }));
  document.getElementById('customerName').value = trx.customer;
  document.getElementById('cashInput').value = '';
  document.getElementById('kasbonEditBanner').style.display = 'flex';
  document.getElementById('kasbonEditText').textContent = `📝 Menambah item untuk kasbon: ${trx.customer}`;
  document.getElementById('btnKasbon').textContent = '💾 Simpan Perubahan';

  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === 'kasir')
  );
  document.querySelectorAll('.tab-panel').forEach(p =>
    p.classList.toggle('active', p.id === 'tab-kasir')
  );
  renderKasir();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBadge() {
  const n = state.trx.filter(t => t.status === 'unpaid').length;
  const badge = document.getElementById('badgeKasbon');
  badge.textContent = n;
  badge.style.display = n ? 'inline-block' : 'none';
}

/* =====================================================
   REKAP
   ===================================================== */
function getRange(period) {
  const now = new Date();
  let start = new Date(0);
  let end = now;

  if (period === 'today') {
    start = new Date(); start.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    start = new Date(); start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);
  } else if (period === 'month') {
    start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (period === 'custom') {
    if (state.customStart) start = new Date(state.customStart + 'T00:00:00');
    if (state.customEnd)   end   = new Date(state.customEnd   + 'T23:59:59.999');
  }
  return { start, end };
}

function inRange(dateIso, start, end) {
  const d = new Date(dateIso);
  return d >= start && d <= end;
}

document.getElementById('periodTabs').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  state.period = btn.dataset.period;
  savePeriod();

  document.querySelectorAll('#periodTabs button').forEach(b =>
    b.classList.toggle('active', b === btn)
  );

  const dateRange = document.getElementById('dateRange');
  if (state.period === 'custom') {
    dateRange.style.display = 'flex';
    const startInput = document.getElementById('rekapStart');
    const endInput   = document.getElementById('rekapEnd');
    if (!startInput.value) startInput.value = state.customStart || todayStr();
    if (!endInput.value)   endInput.value   = state.customEnd   || todayStr();
    if (!state.customStart || !state.customEnd) {
      state.customStart = startInput.value;
      state.customEnd   = endInput.value;
      saveRange();
    }
  } else {
    dateRange.style.display = 'none';
  }

  renderRekap();
});

/* Tombol Terapkan */
document.getElementById('btnApplyRange').addEventListener('click', () => {
  const start = document.getElementById('rekapStart').value;
  const end   = document.getElementById('rekapEnd').value;

  if (!start || !end) return toast('Isi kedua tanggal terlebih dahulu', 'error');
  if (start > end)    return toast('Tanggal awal harus sebelum tanggal akhir', 'error');

  state.customStart = start;
  state.customEnd   = end;
  saveRange();
  renderRekap();
  toast('Rentang tanggal diterapkan', 'success');
});

/* Tombol Reset */
document.getElementById('btnResetRange').addEventListener('click', () => {
  state.customStart = todayStr();
  state.customEnd   = todayStr();
  document.getElementById('rekapStart').value = state.customStart;
  document.getElementById('rekapEnd').value   = state.customEnd;
  saveRange();
  renderRekap();
  toast('Tanggal direset ke hari ini', 'success');
});

/* ============ RENDER REKAP (LENGKAP) ============ */
function renderRekap() {
  const { start, end } = getRange(state.period);

  /* ===== Info rentang tanggal ===== */
  const rangeInfo = document.getElementById('rangeInfo');
  if (state.period === 'custom' && state.customStart && state.customEnd) {
    const startStr = formatDateLong(state.customStart);
    const endStr   = formatDateLong(state.customEnd);
    rangeInfo.style.display = 'block';
    rangeInfo.textContent = `📅 Menampilkan data dari ${startStr} sampai ${endStr}`;
  } else {
    rangeInfo.style.display = 'none';
  }

  /* ===== Filter data ===== */
  const trxPaid = state.trx.filter(t =>
    t.status === 'paid' && t.paidAt && inRange(t.paidAt, start, end)
  );
  const trxAll = state.trx.filter(t => inRange(t.date, start, end));
  const expIn = state.exp.filter(e =>
    inRange(e.date + 'T00:00:00', start, end)
  );

  /* ===== Hitung pemasukan terpisah: Warung vs Rokok, Tunai vs Dana ===== */
  let incomeWarungTunai = 0, incomeWarungDana = 0;
  let incomeRokokTunai  = 0, incomeRokokDana  = 0;

  trxPaid.forEach(t => {
    const method = t.method || 'tunai';
    t.items.forEach(it => {
      const cat = getItemCat(it);
      const subtotal = it.price * it.qty;
      if (isRokokCat(cat)) {
        if (method === 'dana') incomeRokokDana += subtotal;
        else                   incomeRokokTunai += subtotal;
      } else {
        if (method === 'dana') incomeWarungDana += subtotal;
        else                   incomeWarungTunai += subtotal;
      }
    });
  });

  const incomeWarung = incomeWarungTunai + incomeWarungDana;
  const incomeRokok  = incomeRokokTunai  + incomeRokokDana;
  const incomeTotal  = incomeWarung + incomeRokok;

  /* ===== Hitung pengeluaran terpisah ===== */
  let expWarung = 0, expRokok = 0;
  expIn.forEach(e => {
    const c = e.category || 'warung';
    if (c === 'rokok') expRokok  += Number(e.amount);
    else               expWarung += Number(e.amount);
  });

  const netWarung = incomeWarung - expWarung;
  const netRokok  = incomeRokok  - expRokok;
  const netTotal  = netWarung + netRokok;

  /* ===== Render stat pemasukan ===== */
  document.getElementById('statGrid').innerHTML = `
    <div class="stat-card green">
      <div class="label">Pemasukan Warung</div>
      <div class="value">${fmt(incomeWarung)}</div>
      <div class="sub">💵 ${fmt(incomeWarungTunai)} · 📱 ${fmt(incomeWarungDana)}</div>
    </div>
    <div class="stat-card purple">
      <div class="label">Pemasukan Rokok</div>
      <div class="value">${fmt(incomeRokok)}</div>
      <div class="sub">💵 ${fmt(incomeRokokTunai)} · 📱 ${fmt(incomeRokokDana)}</div>
    </div>
    <div class="stat-card blue">
      <div class="label">Total Pemasukan</div>
      <div class="value">${fmt(incomeTotal)}</div>
      <div class="sub">${trxPaid.length} transaksi lunas</div>
    </div>
  `;

  /* ===== Render stat pengeluaran & laba ===== */
  document.getElementById('statGrid2').innerHTML = `
    <div class="stat-card red">
      <div class="label">Pengeluaran Warung</div>
      <div class="value">${fmt(expWarung)}</div>
    </div>
    <div class="stat-card red">
      <div class="label">Pengeluaran Rokok</div>
      <div class="value">${fmt(expRokok)}</div>
    </div>
    <div class="stat-card ${netWarung >= 0 ? 'green' : 'red'}">
      <div class="label">Laba Warung</div>
      <div class="value">${fmt(netWarung)}</div>
    </div>
    <div class="stat-card ${netRokok >= 0 ? 'purple' : 'red'}">
      <div class="label">Laba Rokok</div>
      <div class="value">${fmt(netRokok)}</div>
    </div>
    <div class="stat-card ${netTotal >= 0 ? 'blue' : 'red'}">
      <div class="label">Laba Bersih Total</div>
      <div class="value">${fmt(netTotal)}</div>
    </div>
  `;

  /* ===== Render transaksi (vertical card) ===== */
  const trxEl = document.getElementById('rekapTrx');
  if (!trxAll.length) {
    trxEl.innerHTML = `<div class="empty">Belum ada transaksi di periode ini</div>`;
  } else {
    trxEl.innerHTML = trxAll.map(t => {
      const isPaid = t.status === 'paid';
      const method = t.method || 'tunai';
      const methodBadge = isPaid
        ? `<span class="pay-badge ${method}">${method === 'dana' ? '📱 Dana' : '💵 Tunai'}</span>`
        : '';
      const statusTag = isPaid
        ? `<span class="tag paid">LUNAS</span>`
        : `<span class="tag unpaid">KASBON</span>`;
      const tanggal = isPaid && t.paidAt ? formatDateTime(t.paidAt) : formatDateTime(t.date);

      const itemLines = t.items.map(it => `
        <div class="trx-item-line">
          <span>${esc(it.name)}</span>
          <span class="qty">×${it.qty}</span>
          <span class="price">${fmt(it.price * it.qty)}</span>
        </div>
      `).join('');

      let extra = '';
      if (isPaid && method === 'tunai' && t.cash) {
        extra = `<div class="trx-meta">Bayar: <strong>${fmt(t.cash)}</strong> · Kembalian: <strong>${fmt(t.change || 0)}</strong></div>`;
      }

      return `
        <div class="trx-card ${isPaid ? 'paid' : 'unpaid'}">
          <div class="trx-head">
            <div>
              <div class="list-title">${esc(t.customer || 'Pelanggan')} ${statusTag}${methodBadge}</div>
              <div class="list-sub">${tanggal}</div>
            </div>
            <div class="trx-total">${fmt(t.total)}</div>
          </div>
          <div class="trx-items">${itemLines}</div>
          ${extra}
        </div>
      `;
    }).join('');
  }

  /* ===== Render pengeluaran ===== */
  const expEl = document.getElementById('rekapExp');
  if (!expIn.length) {
    expEl.innerHTML = `<div class="empty">Belum ada pengeluaran di periode ini</div>`;
  } else {
    expEl.innerHTML = expIn.map(e => {
      const cat = e.category || 'warung';
      const catLabel = cat === 'rokok' ? '🚬 Rokok' : '🍢 Warung';
      return `
        <div class="list-row">
          <div class="list-main">
            <div class="list-title">${esc(e.desc)} <span class="exp-cat-tag ${cat}">${catLabel}</span></div>
            <div class="list-sub">${formatDateLong(e.date)}</div>
          </div>
          <div style="font-weight:800;color:var(--danger)">− ${fmt(e.amount)}</div>
        </div>
      `;
    }).join('');
  }
}

/* =====================================================
   PENGELUARAN
   ===================================================== */
function renderPengeluaran() {
  document.getElementById('expDate').value = todayStr();

  const el = document.getElementById('expList');
  if (!state.exp.length) {
    el.innerHTML = `<div class="empty">Belum ada pengeluaran tercatat</div>`;
    return;
  }

  const sorted = [...state.exp].sort((a, b) => b.date.localeCompare(a.date));
  el.innerHTML = sorted.map(e => {
    const cat = e.category || 'warung';
    const catLabel = cat === 'rokok' ? '🚬 Rokok' : '🍢 Warung';
    return `
      <div class="list-row">
        <div class="list-main">
          <div class="list-title">${esc(e.desc)} <span class="exp-cat-tag ${cat}">${catLabel}</span></div>
          <div class="list-sub">${formatDateLong(e.date)}</div>
        </div>
        <div style="display:flex;gap:12px;align-items:center">
          <strong style="color:var(--danger);font-size:1.05rem">${fmt(e.amount)}</strong>
          <button class="btn btn-sm btn-danger" data-del-exp="${e.id}">Hapus</button>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('formExp').addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('expDate').value;
  const category = document.getElementById('expCat').value;
  const desc = document.getElementById('expDesc').value.trim();
  const amount = Number(document.getElementById('expAmount').value);

  if (!date || !desc || amount <= 0) return toast('Lengkapi data dengan benar', 'error');

  state.exp.push({ id: uid(), date, category, desc, amount });
  saveExp();
  document.getElementById('expDesc').value = '';
  document.getElementById('expAmount').value = '';
  renderPengeluaran();
  toast('Pengeluaran ditambahkan', 'success');
});

document.getElementById('expList').addEventListener('click', e => {
  const btn = e.target.closest('[data-del-exp]');
  if (!btn) return;
  if (!confirm('Hapus pengeluaran ini?')) return;
  state.exp = state.exp.filter(x => x.id !== Number(btn.dataset.delExp));
  saveExp();
  renderPengeluaran();
  toast('Pengeluaran dihapus', 'success');
});

/* =====================================================
   KELOLA MENU
   ===================================================== */
function renderMenuManage() {
  const sel = document.getElementById('menuCat');
  sel.innerHTML = CATS.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');

  const el = document.getElementById('menuList');
  if (!state.menu.length) {
    el.innerHTML = `<div class="empty">Belum ada menu</div>`;
    return;
  }

  let html = '';
  CATS.forEach(cat => {
    const items = state.menu.filter(m => m.cat === cat);
    if (!items.length) return;
    html += `<div class="menu-group"><h4>${esc(cat)} (${items.length})</h4>`;
    items.forEach(m => {
      html += `
        <div class="list-row" style="margin-bottom:6px">
          <div class="list-main">
            <div class="list-title">${esc(m.name)}</div>
            <div class="list-sub">${fmt(m.price)}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm btn-primary" data-edit="${m.id}">Edit</button>
            <button class="btn btn-sm btn-danger" data-del-menu="${m.id}">Hapus</button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  });
  el.innerHTML = html;
}

document.getElementById('formMenu').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('menuId').value;
  const name = document.getElementById('menuName').value.trim();
  const cat = document.getElementById('menuCat').value;
  const price = Number(document.getElementById('menuPrice').value);

  if (!name || !cat || price < 0) return toast('Lengkapi data menu', 'error');

  if (id) {
    const item = state.menu.find(m => m.id === Number(id));
    if (item) { item.name = name; item.cat = cat; item.price = price; }
    toast('Menu diperbarui', 'success');
  } else {
    const newId = state.menu.length ? Math.max(...state.menu.map(m => m.id)) + 1 : 1;
    state.menu.push({ id: newId, name, cat, price });
    toast('Menu ditambahkan', 'success');
  }

  saveMenu();
  resetFormMenu();
  renderMenuManage();
  renderItemGrid();
});

function resetFormMenu() {
  document.getElementById('menuId').value = '';
  document.getElementById('menuName').value = '';
  document.getElementById('menuPrice').value = '';
  document.getElementById('menuSubmitBtn').textContent = 'Tambah';
  document.getElementById('menuCancelBtn').style.display = 'none';
}

document.getElementById('menuCancelBtn').addEventListener('click', resetFormMenu);

document.getElementById('menuList').addEventListener('click', e => {
  const editBtn = e.target.closest('[data-edit]');
  const delBtn = e.target.closest('[data-del-menu]');

  if (editBtn) {
    const id = Number(editBtn.dataset.edit);
    const item = state.menu.find(m => m.id === id);
    if (!item) return;
    document.getElementById('menuId').value = item.id;
    document.getElementById('menuName').value = item.name;
    document.getElementById('menuCat').value = item.cat;
    document.getElementById('menuPrice').value = item.price;
    document.getElementById('menuSubmitBtn').textContent = 'Simpan Perubahan';
    document.getElementById('menuCancelBtn').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (delBtn) {
    if (!confirm('Hapus item ini dari menu?')) return;
    state.menu = state.menu.filter(m => m.id !== Number(delBtn.dataset.delMenu));
    saveMenu();
    renderMenuManage();
    renderItemGrid();
    toast('Item dihapus', 'success');
  }
});

/* =====================================================
   INIT
   ===================================================== */
(function init() {
  loadAll();
  loadRange();
  loadPeriod();
  updateBadge();
  renderKasir();
  renderPengeluaran();

  // Aktifkan tombol period yang tersimpan & tampilkan panel tanggal jika perlu
  document.querySelectorAll('#periodTabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.period === state.period);
  });

  if (state.period === 'custom') {
    document.getElementById('dateRange').style.display = 'flex';
    document.getElementById('rekapStart').value = state.customStart || todayStr();
    document.getElementById('rekapEnd').value   = state.customEnd   || todayStr();
    if (!state.customStart) state.customStart = todayStr();
    if (!state.customEnd)   state.customEnd   = todayStr();
  }
})();

/* =====================================================
   PWA — Service Worker & Install Prompt
   ===================================================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('SW terdaftar:', reg.scope);

        // Cek update
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner();
            }
          });
        });
      })
      .catch(err => console.warn('SW gagal:', err));
  });

  // Reload saat SW baru aktif
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

/* ===== Banner update ===== */
function showUpdateBanner() {
  const b = document.getElementById('updateBanner');
  if (!b) return;
  b.hidden = false;
}
document.getElementById('btnReload')?.addEventListener('click', () => {
  navigator.serviceWorker.getRegistration().then(reg => {
    reg?.waiting?.postMessage('SKIP_WAITING');
  });
});
document.getElementById('btnDismissUpdate')?.addEventListener('click', () => {
  document.getElementById('updateBanner').hidden = true;
});

/* ===== Install prompt (Android/Chrome) ===== */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btnInstall');
  if (btn) btn.hidden = false;
});

document.getElementById('btnInstall')?.addEventListener('click', async () => {
  const btn = document.getElementById('btnInstall');
  if (!deferredPrompt) {
    alert('Untuk memasang:\n\n• Android Chrome: menu ⋮ → "Install app" / "Tambahkan ke layar utama"\n• iPhone Safari: tombol Share → "Tambahkan ke Layar Utama"');
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('Install:', outcome);
  deferredPrompt = null;
  if (btn) btn.hidden = true;
});

window.addEventListener('appinstalled', () => {
  console.log('App terpasang');
  const btn = document.getElementById('btnInstall');
  if (btn) btn.hidden = true;
});

/* ===== Indikator offline ===== */
function updateNetPill() {
  const pill = document.getElementById('netPill');
  if (!pill) return;
  pill.hidden = navigator.onLine;
}
window.addEventListener('online', updateNetPill);
window.addEventListener('offline', updateNetPill);
updateNetPill();