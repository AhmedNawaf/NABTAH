class Cart {
  constructor() {
    this.server = 'http://localhost:4000';
    this.cart = document.getElementById('cart');
    this.cartItems = [];
    this.totalElement = document.getElementById('total');
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
    }
    return response.data.cart.products;
  }

  async renderCart() {
    const cartItems = await this.loadCart();
    cartItems.forEach(({ productId: item }) => {
      this.cart.innerHTML += `
        <div class="col-md-9">
        <div class="card mb-3">
          <div class="row">
            <div class="col-md-4">
              <img
                src="${this.server + item.image}"
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
    const button = e.target.closest('.btn-danger');
    if (!button) return;
    const productName =
      button.parentElement.querySelector('.card-title').innerText;
    const obj = this.cartItems.find(
      ({ productId: product }) => product.name === productName
    );
    const { productId: product } = obj;
    console.log(product);
    this.deleteCart(product._id);
  }
  async deleteCart(productId) {
    await axios.delete(this.server + `/api/cart/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    window.location.reload();
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
