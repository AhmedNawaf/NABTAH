import { Login, Register, UserInfo } from './auth.js';

class HomePage {
  constructor() {
    this.date = new Date().getFullYear();
    this.yearComponent = document.getElementById('year');
    this.navbar = document.querySelector('.navbar-nav');
  }

  initCart() {
    const cartNav = document.createElement('li');
    cartNav.classList.add('nav-item');
    cartNav.innerHTML = `
    <a class="nav-link" href="/cart.html">
      <img width="35" class="text-white" src="../assets/cart-icon.png" alt="cart-logo" />
    </a>
    `;
    this.navbar.append(cartNav);
  }

  loadCart() {
    if (!localStorage.getItem('token')) return;
    this.initCart();
  }

  loadLatestDate() {
    this.yearComponent.textContent = this.date;
  }
}

const homeComponent = new HomePage();
const loginComponent = new Login();
const registerComponent = new Register();
const UserInfoComponent = new UserInfo();

window.addEventListener('DOMContentLoaded', () => {
  homeComponent.loadLatestDate();
  homeComponent.loadCart();
  UserInfoComponent.changeModal();
  UserInfoComponent.fetchUser();
});

registerComponent.form.addEventListener('submit', (e) => {
  e.preventDefault();
  registerComponent.register();
});

loginComponent.form.addEventListener('submit', (e) => {
  e.preventDefault();
  loginComponent.login();
});

UserInfoComponent.logout.addEventListener('click', (e) => {
  UserInfoComponent.logoutUser();
});
