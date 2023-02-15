class alert {
  constructor() {
    this.alertSetup = document.createElement('div');
    this.alertSetup.innerHTML = `
    <div class="alert" role="alert">
    </div>`;
    this.alert = this.alertSetup.firstElementChild;
  }
  show(message, type) {
    this.alert.classList.remove('alert-danger', 'alert-success');
    this.alert.classList.toggle(`alert-${type}`);
    this.alert.textContent = message;
    this.modal.prepend(this.alert);
  }
}

class Register extends alert {
  constructor() {
    super();
    this.modal = document.querySelector('#registerForm .modal-body');
    this.form = document.getElementById('register-form');
    this.email = document.getElementById('register-email');
    this.password = document.getElementById('register-password');
    this.confirmPassword = document.getElementById('register-confirm-password');
  }
  async register() {
    const formData = {
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
    };
    if (formData.password !== formData.confirmPassword) {
      this.show('Password does not match', 'danger');
      return;
    }
    try {
      const payload = await axios.post(
        'http://localhost:4000/api/auth/register',
        formData
      );
      this.show(payload.data.message, 'success');
      this.form.reset();
    } catch (error) {
      this.show(error.response.data.message, 'danger');
    }
  }
}

class Login extends alert {
  constructor() {
    super();
    this.modal = document.querySelector('#loginForm .modal-body');
    this.form = document.getElementById('login-form');
    this.email = document.getElementById('login-email');
    this.password = document.getElementById('login-password');
  }
  async login() {
    const formData = {
      email: this.email.value,
      password: this.password.value,
    };
    try {
      const payload = await axios.post(
        'http://localhost:4000/api/auth/login',
        formData
      );

      this.show(payload.data.message, 'success');
      localStorage.setItem('token', payload.data.data.accessToken);
      window.location.reload();
    } catch (error) {
      this.show(error.response.data.message, 'danger');
    }
  }
}

class UserInfo {
  constructor() {
    this.username = document.getElementById('user-name');
    this.email = document.getElementById('user-email');
    this.logout = document.getElementById('logout');
    this.modalLinker = document.getElementById('modalLinker');
  }

  changeModal() {
    if (!localStorage.getItem('token')) {
      this.modalLinker.setAttribute('data-bs-target', '#loginForm');
    } else {
      this.modalLinker.setAttribute('data-bs-target', '#userModal');
    }
  }

  async fetchUser() {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = await axios.get('http://localhost:4000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { email } = payload.data;
    const formattedEmail = email.split('@')[0];
    this.username.textContent = formattedEmail;
    this.email.textContent = email;
  }
  logoutUser() {
    localStorage.removeItem('token');
    window.location.reload();
  }
}

export { Login, Register, UserInfo };
