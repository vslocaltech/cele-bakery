const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const loginForm = document.querySelector('#login-form');
const loginScreen = document.querySelector('#admin-login');
const adminPanel = document.querySelector('#admin-panel');
const message = document.querySelector('.form-message');

function showAdmin() {
  loginScreen?.classList.add('hidden');
  adminPanel?.classList.remove('hidden');
  renderAdminProducts();
}

if (sessionStorage.getItem('cocosAdmin') === 'true') showAdmin();

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const key = document.querySelector('#admin-key').value;
  if (key === 'coco') {
    sessionStorage.setItem('cocosAdmin', 'true');
    showAdmin();
  } else {
    message.textContent = 'La clave no coincide. Probá de nuevo.';
  }
});

document.querySelector('#logout')?.addEventListener('click', () => {
  sessionStorage.removeItem('cocosAdmin');
  adminPanel?.classList.add('hidden');
  loginScreen?.classList.remove('hidden');
});

const productForm = document.querySelector('#product-form');
const productList = document.querySelector('#admin-product-list');

function getAdminProducts() {
  return JSON.parse(localStorage.getItem('cocosProducts') || '[]');
}

function renderAdminProducts() {
  if (!productList) return;
  const products = getAdminProducts();
  productList.innerHTML = products.length
    ? products.map((product, index) => `<article class="admin-product"><div><p>${product.category}</p><h3>${product.name}</h3><span>${product.description}</span></div><button type="button" data-delete="${index}" aria-label="Eliminar ${product.name}">×</button></article>`).join('')
    : '<p class="empty-state">Todavía no agregaste productos desde este panel.</p>';
  productList.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const products = getAdminProducts();
      products.splice(Number(button.dataset.delete), 1);
      localStorage.setItem('cocosProducts', JSON.stringify(products));
      renderAdminProducts();
    });
  });
}

productForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  const products = getAdminProducts();
  products.unshift(Object.fromEntries(data));
  localStorage.setItem('cocosProducts', JSON.stringify(products));
  productForm.reset();
  renderAdminProducts();
});
