/*
 * LASHNI catalogue behaviour.
 * products.js must load before this file: it defines the global `products` array.
 * All links, messages, images and badges are derived from that single source.
 */

var NEW_ARRIVAL_DAYS = 5;
var productByCode = {};

/* Build a fast code lookup and validate each permanent timestamp. */
function registerProducts() {
  productByCode = {};
  products.forEach(function (product, index) {
    if (productByCode[product.code]) { throw new Error('Duplicate product code: ' + product.code); }
    if (!product.addedAt || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(product.addedAt) || Number.isNaN(Date.parse(product.addedAt))) {
      throw new Error('Invalid addedAt timestamp for ' + product.code);
    }
    product._order = index;
    productByCode[product.code] = product;
  });
}

/* Newest timestamp first; later catalogue entries win exact timestamp ties. */
function sortedProducts() {
  return products.slice().sort(function (a, b) {
    var byDate = Date.parse(b.addedAt) - Date.parse(a.addedAt);
    return byDate || b._order - a._order;
  });
}

function isRecentlyAdded(product) {
  var days = Math.floor((Date.now() - Date.parse(product.addedAt)) / 86400000);
  return days >= 0 && days <= NEW_ARRIVAL_DAYS;
}

/* Keep the hero image, link and caption in sync with the newest catalogue item. */
function updateHero() {
  var newest = sortedProducts()[0];
  if (!newest) { return; }

  var hero = document.getElementById('heroImage');
  if (hero) {
    hero.src = newest.image;
    hero.alt = newest.alt;
    if (newest.width && newest.height) {
      hero.width = newest.width;
      hero.height = newest.height;
    }
  }

  var link = document.getElementById('heroLink');
  if (link) {
    link.href = newest.post;
    link.setAttribute('aria-label', 'View ' + newest.name + ' on Instagram, code ' + newest.code);
  }

  var caption = document.getElementById('heroCaption');
  if (caption) { caption.textContent = newest.name; }
}

var dmLink = 'https://ig.me/m/lashni_ethnicwear';
var igSvg = '<svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

/* Render one card; below-fold images are lazy and keep their intrinsic size. */
function cardHtml(product) {
  var code = product.code;
  var dimensions = product.width && product.height
    ? ' width="' + product.width + '" height="' + product.height + '"'
    : '';

  return '<article class="card" data-code="' + code + '" data-availability="' + product.availability + '" role="link" tabindex="0">' +
    '<img src="' + product.image + '" alt="' + product.alt + '"' + dimensions + ' loading="lazy" decoding="async">' +
    '<div class="card-body">' +
    (isRecentlyAdded(product) ? '<span class="new-badge" aria-label="Newly added">NEW ARRIVAL</span>' : '') +
    '<span class="status" data-badge></span><span class="code">Code: ' + code + '</span>' +
    '<h3>' + product.name + '</h3><div class="price">' + product.price + '</div><div class="sub">' + product.sub + '</div>' +
    '<div class="card-actions">' +
    '<a class="pill secondary ig-icon" data-view href="' + product.post + '" target="_blank" rel="noopener" aria-label="View Instagram post for ' + product.name + ', code ' + code + '">' + igSvg + 'View Instagram Post</a>' +
    '<button type="button" class="pill" data-enquire aria-label="Enquire about ' + product.name + ', code ' + code + '">Enquire Now</button>' +
    '<div class="card-tools">' +
    '<button type="button" data-copy aria-label="Copy product code ' + code + '">Copy Product Code</button>' +
    '<button type="button" data-share aria-label="Share ' + product.name + ' details, code ' + code + '">Share Product</button>' +
    '</div><p class="trust">Availability confirmed before payment.</p></div></div></article>';
}

function renderCatalogue() {
  registerProducts();
  updateHero();
  document.getElementById('productGrid').innerHTML = sortedProducts().map(cardHtml).join('');
  applyProductLinks();
  syncAvailability();
}

/* Wire generated cards. Assigning onclick keeps one handler after a re-render. */
function applyProductLinks() {
  document.querySelectorAll('.card[data-code]').forEach(function (card) {
    var code = card.getAttribute('data-code');
    var product = productByCode[code];
    if (!product) { return; }

    var openPost = function () { window.open(product.post, '_blank', 'noopener'); };
    card.onclick = openPost;
    card.onkeydown = function (event) {
      if (event.target === this && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openPost();
      }
    };
    card.setAttribute('aria-label', 'Open ' + product.name + ' Instagram post, code ' + code);

    var img = card.querySelector('img');
    if (img && product.image) {
      img.src = product.image;
      if (product.width && product.height) {
        img.width = product.width;
        img.height = product.height;
      }
    }

    var view = card.querySelector('[data-view]');
    if (view) {
      view.href = product.post;
      view.setAttribute('aria-label', 'View Instagram post for ' + product.name + ', code ' + code);
      view.onclick = function (event) { event.stopPropagation(); };
    }

    var enquire = card.querySelector('[data-enquire]');
    if (enquire) {
      enquire.onclick = function (event) { enquireNow(event, code); };
    }

    var copy = card.querySelector('[data-copy]');
    if (copy) {
      copy.setAttribute('aria-label', 'Copy product code ' + code);
      copy.onclick = function (event) { copyCode(event, code); };
    }

    var share = card.querySelector('[data-share]');
    if (share) {
      share.setAttribute('aria-label', 'Share ' + product.name + ' details, code ' + code);
      share.onclick = function (event) { shareProduct(event, code); };
    }
  });
}

function enquiryText(code) {
  var product = productByCode[code];
  return product.message + '\nInstagram post: ' + product.post;
}

var copyModal = document.getElementById('copyModal');
var lastFocused = null;

/* Clipboard fallback for browsers that block the async Clipboard API. */
function fallbackCopy(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  var ok = false;
  try {
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    ok = document.execCommand('copy');
  } catch (e) { ok = false; }
  document.body.removeChild(textarea);
  return ok;
}

function copyMessage(text) {
  return new Promise(function (resolve) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(text).then(function () { resolve(true); }, function () { resolve(fallbackCopy(text)); });
      } catch (e) { resolve(fallbackCopy(text)); }
    } else {
      resolve(fallbackCopy(text));
    }
  });
}

function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message || 'Product details copied. Paste in Instagram DM ✨';
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
}

function openCopyModal(text) {
  lastFocused = document.activeElement;
  document.getElementById('copyModalText').value = text;
  copyModal.hidden = false;
  var field = document.getElementById('copyModalText');
  field.focus();
  field.select();
}

function closeCopyModal() {
  copyModal.hidden = true;
  if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
}

function copyModalText() {
  var field = document.getElementById('copyModalText');
  copyMessage(field.value).then(function (ok) {
    if (ok) { closeCopyModal(); showToast('Copied. Paste in Instagram DM ✨'); }
    else { field.focus(); field.select(); }
  });
}

/* Open the real DM URL after copying. Never create an about:blank tab.
 * The 'noopener' window feature makes window.open return null, so detach the
 * opener manually and use the return value to detect a blocked pop-up. */
function openDmTab(text) {
  var tab = null;
  try { tab = window.open(dmLink, '_blank'); } catch (e) { tab = null; }
  if (tab && !tab.closed) {
    try { tab.opener = null; } catch (e) {}
  } else {
    // Pop-up blocked: offer a real anchor the visitor can activate themselves.
    openCopyModal(text || '');
    document.getElementById('copyModalOpenDm').focus();
  }
}

function enquireNow(event, code) {
  event.preventDefault();
  event.stopPropagation();
  var button = event.currentTarget;
  if (button.disabled || button.dataset.pending === 'true') { return; }
  var text = enquiryText(code);
  button.dataset.pending = 'true';
  copyMessage(text).then(function (ok) {
    button.dataset.pending = 'false';
    if (ok) {
      showToast('Product details copied. Paste in Instagram DM ✨');
      openDmTab(text);
    } else {
      openCopyModal(text);
    }
  });
}

function copyCode(event, code) {
  event.preventDefault();
  event.stopPropagation();
  copyMessage(code).then(function (ok) {
    if (ok) { showToast('Product code copied.'); }
    else { openCopyModal(code); }
  });
}

function shareProduct(event, code) {
  event.preventDefault();
  event.stopPropagation();
  var product = productByCode[code];
  var text = product.name + ' - Code ' + code + '\n' + product.post;
  if (navigator.share) {
    navigator.share({ title: 'LASHNI | ' + product.name, text: text, url: product.post }).catch(function () {});
  } else {
    copyMessage(text).then(function (ok) {
      if (ok) { showToast('Product details copied. Share them manually.'); }
      else { openCopyModal(text); }
    });
  }
}

/* Badges and the enquiry button always reflect the product's availability data. */
function syncAvailability() {
  document.querySelectorAll('.card[data-code]').forEach(function (card) {
    var code = card.getAttribute('data-code');
    var status = card.getAttribute('data-availability');
    var badge = card.querySelector('[data-badge]');
    var enquire = card.querySelector('[data-enquire]');
    var variant = 'status';
    if (status === 'Available') { variant += ' status--available'; }
    else if (status === 'Limited Stock') { variant += ' status--limited'; }
    else if (status === 'Sold Out') { variant += ' status--sold'; }
    badge.className = variant;
    badge.textContent = status;
    if (status === 'Sold Out') {
      enquire.disabled = true;
      enquire.textContent = 'Currently Sold Out';
      enquire.setAttribute('aria-label', code + ' is currently sold out');
    } else {
      enquire.disabled = false;
      enquire.textContent = 'Enquire Now';
      enquire.setAttribute('aria-label', 'Enquire about ' + productByCode[code].name + ', code ' + code);
    }
  });
}

/* Static modal controls live in index.html; generated card controls are wired above. */
function initModalEvents() {
  document.getElementById('copyModalCopy').onclick = copyModalText;
  // A real link works even when a scripted pop-up would be blocked.
  document.getElementById('copyModalOpenDm').addEventListener('click', closeCopyModal);
  copyModal.addEventListener('click', function (event) { if (event.target === copyModal) { closeCopyModal(); } });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !copyModal.hidden) { closeCopyModal(); } });
}

/* The mobile menu expands inside the sticky nav so it never covers the page. */
function setMobileMenu(open) {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) { return; }
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}

function initMobileMenu() {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) { return; }

  toggle.onclick = function () { setMobileMenu(menu.hidden); };
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMobileMenu(false); });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !menu.hidden) { setMobileMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (event) {
    if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) { setMobileMenu(false); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) { setMobileMenu(false); } });
}

function init() {
  renderCatalogue();
  initModalEvents();
  initMobileMenu();
}

/* Scripts use defer in index.html, so the DOM is ready when this runs. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
