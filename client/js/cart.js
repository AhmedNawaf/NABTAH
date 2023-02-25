class Cart {
  constructor() {
    this.server = 'http://localhost:4000';
    this.cart = document.getElementById('cart');
    this.cartItems = [];
    this.totalElement = document.getElementById('total');
    this.checkoutBtn = document.getElementById('checkout');
  }

  setCart(cartItems) {
    this.cartItems = cartItems;
  }

  async loadCart() {
    const response = await axios.get(this.server + '/api/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    this.setCart(response.data.cart.products);
    if (this.cartItems.length > 0) {
      this.totalElement.textContent = `Total: ${response.data.cart.total}$`;
      this.checkoutBtn.removeAttribute('disabled');
    }
    return response.data.cart.products;
  }

  async renderCart() {
    const cartItems = await this.loadCart();
    cartItems.forEach((item) => {
      this.cart.innerHTML += `
        <div class="col-md-7 text-start">
        <div class="card mb-3">
          <div class="row">
            <div class="col-md-4">
              <img
                src="${this.server + '/images/' + item.image}"
                class="img-fluid rounded-start w-100 h-100" 
                alt="..."
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h3 class="card-title">${item.name}</h3>
                <h5 class="card-text">
                  ${item.description}
                </h5>
                <p class="card-text mt-4 fs-2 fw-bold">
                €${item.price}
                </p>
                <div class="mb-3">
                <label class="form-label fw-bold">Quantity</label>
                  <input type="number" class="form-control w-25" value="${
                    item.quantity
                  }" min="0" max="10">
                </div>
                <button class="btn btn-primary">Update</button>
                <button class="btn btn-danger">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div> 
      `;
    });
  }
  handleClick(e) {
    const deleteBtn = e.target.closest('.btn-danger');
    const editBtn = e.target.closest('.btn-primary');
    if (deleteBtn) {
      const productName =
        deleteBtn.parentElement.querySelector('.card-title').innerText;
      const product = this.cartItems.find(
        (product) => product.name === productName
      );
      this.deleteCart(product._id);
    }

    if (editBtn) {
      const productName =
        editBtn.parentElement.querySelector('.card-title').innerText;
      const quantity = editBtn.parentElement.querySelector('input').value;
      const product = this.cartItems.find(
        (product) => product.name === productName
      );
      this.updateCart(product._id, quantity);
    }
  }
  async deleteCart(productId) {
    await axios.delete(this.server + `/api/cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    window.location.reload();
  }

  async updateCart(productId, quantity) {
    await axios.put(
      this.server + `/api/cart/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    window.location.reload();
  }

  async checkout() {
    try {
      await axios.post(
        this.server + '/api/cart/checkout',
        { cartProducts: this.cartItems },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      alert(error.response.data.message);
    }
  }
}
const userCart = new Cart();

window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'home.html';
    return;
  }
  userCart.renderCart();
});

userCart.cart.addEventListener('click', (e) => {
  userCart.handleClick(e);
});

userCart.checkoutBtn.addEventListener('click', () => {
  userCart.checkout();
});
