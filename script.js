// ===== VIEW SWITCHING =====
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.view).classList.add('active');
  });
});

// ===== MODALS =====
function showModal(id) {
  document.getElementById(id).classList.add('show');
}
function hideModal(id) {
  document.getElementById(id).classList.remove('show');
}

// ===== BACKEND: Sidebar form selection =====
document.querySelectorAll('.form-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.form-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// ===== BACKEND: Category tab switching =====
document.querySelectorAll('.cat-tab:not(.add-tab)').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== FRONTEND: Form tab switching =====
document.querySelectorAll('.form-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== FRONTEND: Product tab switching =====
document.querySelectorAll('.prod-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.prod-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== PRICE CALCULATION =====
function updatePrice() {
  const lines = [];
  let subtotal = 0;
  let discountPercent = 0;

  // Hood Style
  const style = document.getElementById('hoodStyle');
  if (style.value) {
    const opt = style.options[style.selectedIndex];
    const price = parseInt(opt.dataset.price);
    lines.push({ label: 'Hood Style: ' + opt.text.split('—')[0].trim(), price });
    subtotal += price;
  }

  // Hood Size
  const size = document.getElementById('hoodSize');
  if (size.value) {
    const opt = size.options[size.selectedIndex];
    const price = parseInt(opt.dataset.price);
    if (price > 0) {
      lines.push({ label: 'Size Upgrade: ' + opt.text.split('(')[0].trim(), price });
      subtotal += price;
    }
  }

  // Hood Color
  const color = document.getElementById('hoodColor');
  if (color.value) {
    const opt = color.options[color.selectedIndex];
    const price = parseInt(opt.dataset.price);
    if (price > 0) {
      lines.push({ label: 'Color: ' + opt.text.split('(')[0].trim(), price });
      subtotal += price;
    }
  }

  // Conditional: Engraving (show when Island is selected)
  const engField = document.getElementById('engravingField');
  const engInput = document.getElementById('engravingInput');
  if (style.value === 'island') {
    engField.style.opacity = '1';
    engInput.disabled = false;
  } else {
    engField.style.opacity = '0.4';
    engInput.disabled = true;
  }

  // Conditional: Duct Cover (show when Wall Mount is selected)
  const ductField = document.getElementById('ductCoverField');
  if (style.value === 'wall') {
    ductField.style.display = 'flex';
  } else {
    ductField.style.display = 'none';
    document.getElementById('ductCover').checked = false;
  }

  // Duct Cover price
  if (document.getElementById('ductCover').checked) {
    lines.push({ label: 'Duct Cover', price: 200 });
    subtotal += 200;
  }

  // Ventilation Type
  const vent = document.getElementById('ventType');
  if (vent.value) {
    const opt = vent.options[vent.selectedIndex];
    const price = parseInt(opt.dataset.price);
    if (price > 0) {
      lines.push({ label: 'Ventilation: ' + opt.text.split('(')[0].trim(), price });
      subtotal += price;
    }
  }

  // CFM
  const cfm = document.getElementById('cfmPower');
  if (cfm.value) {
    const opt = cfm.options[cfm.selectedIndex];
    const price = parseInt(opt.dataset.price);
    if (price > 0) {
      lines.push({ label: 'CFM Upgrade: ' + opt.text.split('(')[0].trim(), price });
      subtotal += price;
    }
  }

  // Conditional discount: Island + Custom Color = 10% off
  if (style.value === 'island' && color.value === 'custom') {
    discountPercent = 10;
  }

  // Render price lines
  const container = document.getElementById('priceLines');
  if (lines.length === 0) {
    container.innerHTML = '<div class="price-line placeholder-line"><span>Select options to see pricing</span></div>';
  } else {
    container.innerHTML = lines.map(l =>
      `<div class="price-line"><span>${l.label}</span><span class="price-val">$${l.price.toLocaleString()}</span></div>`
    ).join('');
  }

  // Discount
  const discountSection = document.getElementById('discountSection');
  let discountAmt = 0;
  if (discountPercent > 0 && subtotal > 0) {
    discountAmt = Math.round(subtotal * discountPercent / 100);
    discountSection.style.display = 'block';
    document.getElementById('discountAmount').textContent = `-$${discountAmt.toLocaleString()} (${discountPercent}%)`;
  } else {
    discountSection.style.display = 'none';
  }

  // Total
  const total = subtotal - discountAmt;
  document.getElementById('totalPrice').textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

// ===== INVOICE =====
function generateInvoice() {
  const preview = document.getElementById('invoicePreview');
  preview.style.display = 'block';

  const priceLines = document.getElementById('priceLines').innerHTML;
  document.getElementById('invoiceItems').innerHTML = priceLines
    .replace(/price-line/g, 'inv-line')
    .replace(/price-val/g, '');

  const total = document.getElementById('totalPrice').textContent;
  document.getElementById('invoiceTotal').innerHTML =
    `<span>Total</span><span>${total}</span>`;

  preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
