class Products {
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
        <img src="${this.server + product.image}" class="card-img-top" alt="${
        product.name
      }" />
        <div class="card-body">
          <h5 class="card-title heading text-black fs-2 fw-bold p-0">
            ${product.name}
          </h5>
          <p class="card-text fs-4 m-0">${product.description}</p>
          <p class="heading text-black fs-2 fw-bold p-0">€${product.price}</p>
          <button class="btn btn-primary trigger">
          Add to cart
          </button>
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
      button.parentElement.querySelector('.card-title').innerText;
    const product = this.products.find(
      (product) => product.name === productName
    );
    this.handleCart(product._id);
  }
  async handleCart(productId) {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/cart',
        { productId: productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response);
      alert('Product added to cart');
    } catch (error) {
      alert('Product already in cart');
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
