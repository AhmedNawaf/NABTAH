export default class Products {
  constructor() {
    this.server = 'http://localhost:4000';
    this.products = [];
    this.productsSection = document.getElementById('products-section');
  }
  async getProducts() {
    try {
      const result = await axios.get('http://localhost:4000/api/products');
      this.setProducts(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
  setProducts(products) {
    this.products = products;
  }
  async makeChanges() {
    const products = await this.getProducts();
    products.forEach((product) => {
      const category = document.getElementById(product.category);
      category.innerHTML += `
      <div class="col-md-3 ">
      <div class="card border-0 rounded-0 my-3">
        <img src="${
          this.server + '/images/' + product.image
        }" class="card-img-top" alt="${product.name}" />
        <div class="card-body">
          <h5 class="card-title heading text-black fs-2 fw-bold p-0">
            ${product.name}
          </h5>
          <p class="card-text fs-4 m-0">${product.description}</p>
          <p class="heading text-black fs-2 fw-bold p-0">€${product.price}</p>
          <div class="mb-3">
          <label for="quantity" class="form-label fw-bold">Quantity</label>
            <input type="number" class="form-control" value="1" min="0" max="10">
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-primary trigger">
            Add to cart
            </button>
            <h5 class="align-self-center m-0">
            ${product.quantity > 0 ? 'In stock' : 'Out of stock'}
            </h5>
          </div>

        </div>
      </div>
    </div>
      `;
    });
  }
  handleClick(e) {
    const button = e.target.closest('.trigger');
    if (!button) return;
    const productName =
      button.parentElement.parentElement.querySelector('.card-title').innerText;
    const quantity =
      button.parentElement.parentElement.querySelector('input').value;
    const product = this.products.find(
      (product) => product.name === productName
    );
    this.handleCart(product, quantity);
  }
  async handleCart(product, quantity) {
    const sentData = {
      ...product,
      quantity: Number(quantity),
    };
    try {
      const response = await axios.post(
        'http://localhost:4000/api/cart',
        sentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Product added to cart');
    } catch (error) {
      alert("The quantity you've entered is not available");
    }
  }
}

const products = new Products();

window.addEventListener('DOMContentLoaded', () => {
  products.makeChanges();
});

products.productsSection.addEventListener('click', (e) => {
  if (!localStorage.getItem('token')) return;
  products.handleClick(e);
});
