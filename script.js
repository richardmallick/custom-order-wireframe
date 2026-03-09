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
    
    // Show/hide OEM selector
    const oemSelector = document.getElementById('oemSelector');
    if (tab.dataset.form === 'oem') {
      oemSelector.style.display = 'block';
    } else {
      oemSelector.style.display = 'none';
      document.getElementById('oemWholesaler').value = '';
    }
    updatePrice();
  });
});

// OEM Wholesaler Change
document.getElementById('oemWholesaler').addEventListener('change', updatePrice);

// ===== CUSTOMER LOOKUP =====
const mockCustomers = {
  'kcd@example.com': { name: 'KCD Purchasing', email: 'kcd@example.com', group: 'OEM Partner', discount: 30, terms: 'net30', addr: '123 KCD Blvd' },
  'uscd@example.com': { name: 'USCD Orders', email: 'uscd@example.com', group: 'OEM Partner', discount: 30, terms: 'net30', addr: '456 USCD Way' },
  'wholesale@example.com': { name: 'Jane Builder', email: 'wholesale@example.com', group: 'Wholesale 20', discount: 20, terms: 'net15', addr: '789 Builder Ln' }
};

let currentCustomerGroup = null;
let currentCustomerDiscount = 0;

function lookupCustomer() {
  const search = document.getElementById('customerSearch').value.toLowerCase();
  const customer = mockCustomers[search];
  
  const detailsPanel = document.getElementById('customerDetailsPanel');
  
  if (customer) {
    document.getElementById('custNameDisplay').textContent = customer.name;
    document.getElementById('custEmailDisplay').textContent = customer.email;
    document.getElementById('custGroupDisplay').textContent = customer.group;
    
    const termsMap = { 'due_receipt': 'Due on Receipt', 'net15': 'Net 15 Approved', 'net30': 'Net 30 Approved' };
    document.getElementById('custTermsDisplay').textContent = termsMap[customer.terms];
    
    // Auto-fill form fields
    document.getElementById('custName').value = customer.name;
    document.getElementById('custEmail').value = customer.email;
    document.getElementById('custAddress').value = customer.addr;
    document.getElementById('paymentTerms').value = customer.terms;
    
    currentCustomerGroup = customer.group;
    currentCustomerDiscount = customer.discount;
    
    detailsPanel.style.display = 'block';
    updatePrice();
  } else {
    alert('Customer not found. Try: kcd@example.com or wholesale@example.com');
  }
}

function clearCustomer() {
  document.getElementById('customerSearch').value = '';
  document.getElementById('customerDetailsPanel').style.display = 'none';
  document.getElementById('custName').value = '';
  document.getElementById('custEmail').value = '';
  document.getElementById('custAddress').value = '';
  document.getElementById('paymentTerms').value = 'due_receipt';
  
  currentCustomerGroup = null;
  currentCustomerDiscount = 0;
  updatePrice();
}

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
    discountPercent = Math.max(discountPercent, 10);
  }
  
  // Apply Group Discount if available
  if (currentCustomerDiscount > 0) {
    discountPercent = Math.max(discountPercent, currentCustomerDiscount);
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
    
    let discountLabel = currentCustomerGroup ? `🏷️ ${currentCustomerGroup} Discount` : '🏷️ Discount';
    document.getElementById('discountSection').innerHTML = `
      <div class="price-line discount-line">
        <span>${discountLabel}</span>
        <span id="discountAmount" class="discount-value">-$${discountAmt.toLocaleString()} (${discountPercent}%)</span>
      </div>
      <div class="price-divider"></div>
    `;
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
  let itemsHtml = priceLines
    .replace(/price-line/g, 'inv-line')
    .replace(/price-val/g, '');
    
  // Add discount line to invoice if applicable
  const discountSection = document.getElementById('discountSection');
  if (discountSection.style.display !== 'none') {
    const discountLine = discountSection.querySelector('.discount-line').innerHTML;
    itemsHtml += `<div class="inv-line discount-line" style="margin-top: 8px;">${discountLine}</div>`;
  }
  
  document.getElementById('invoiceItems').innerHTML = itemsHtml;

  const total = document.getElementById('totalPrice').textContent;
  const terms = document.getElementById('paymentTerms');
  const termsText = terms.options[terms.selectedIndex].text;
  
  document.getElementById('invoiceTotal').innerHTML =
    `<span>Total</span><span>${total}</span>`;
    
  // Add terms below total
  const invoiceBody = document.querySelector('.invoice-body');
  
  const customerName = document.getElementById('custName').value || 'John Smith';
  const email = document.getElementById('custEmail').value || '';
  
  invoiceBody.innerHTML = `
    <p><strong>Customer:</strong> ${customerName}</p>
    ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
    <p><strong>Date:</strong> Feb 25, 2026</p>
    <p><strong>Terms:</strong> ${termsText}</p>
    <div class="invoice-items" id="invoiceItems">${itemsHtml}</div>
    <div class="invoice-total" id="invoiceTotal"><span>Total</span><span>${total}</span></div>
  `;

  preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
