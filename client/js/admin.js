class Admin {
  constructor() {
    this.form = document.getElementById('admin-form');
    this.productName = document.getElementById('product-name');
    this.productPrice = document.getElementById('product-price');
    this.productDescription = document.getElementById('product-description');
    this.productCategory = document.getElementById('category-options');
    this.productQuantity = document.getElementById('product-quantity');
    this.productImage = document.getElementById('product-image');
    this.productsSection = document.getElementById('products');
    this.products = [];
  }
  async isAdmin() {
    try {
      const { data: userInfo } = await axios.get(
        'http://localhost:4000/api/auth/me',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!userInfo.isAdmin) {
        window.location.href = 'home.html';
      }
    } catch (e) {
      console.err(e);
    }
  }

  async handleProduct() {
    const files = this.productImage.files;
    const productData = new FormData();
    productData.append('name', this.productName.value);
    productData.append('price', this.productPrice.value);
    productData.append('description', this.productDescription.value);
    productData.append('category', this.productCategory.value);
    productData.append('quantity', this.productQuantity.value);
    productData.append('image', files[0]);
    try {
      const response = await axios.post(
        'http://localhost:4000/api/products',
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
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

  async renderProducts() {
    const products = await this.getProducts();
    products.forEach((product) => {
      this.productsSection.innerHTML += `
    <div class="col-md-3">
    <div class="card border-0 rounded-0 my-3 shadow-lg">
    <div class="text-center">
    <img src="${
      'http://localhost:4000/images/' + product.image
    }" class="card-img-top w-100" alt="${product.name}" />
    </div>  
      <div class="card-body">
      <form data-id="${product._id}">
        <div class="mb-3">
          <label for="name" class="form-label fw-bold">Name</label>
          <input type="text" class="form-control" id="name" name="name" value="${
            product.name
          }">
        </div>
        <div class="mb-3">
        <label class="form-label fw-bold">Category</label>
        <select class="form-select" name="category" value="${
          product.category
        }" required>
          <option value="Featured" ${
            product.category === 'Featured' ? 'Selected' : ' '
          }>Featured</option>
          <option value="Cacti" ${
            product.category === 'Cacti' ? 'Selected' : ' '
          }>Cacti</option>
          <option value="Flowers" ${
            product.category === 'Flowers' ? 'Selected' : ' '
          }>Flowers</option>
          <option value="Tools" ${
            product.category === 'Tools' ? 'Selected' : ' '
          }>Tools</option>
        </select>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label fw-bold">Description</label>
          <input type="text" class="form-control" id="description" name="description" value="${
            product.description
          }">
        </div>
        <div class="mb-3">
          <label for="price" class="form-label fw-bold">Price</label>
          <input type="number" class="form-control" id="price" name="price" step="0.01" value="${
            product.price
          }">
        </div>
        <div class="mb-3">
          <label for="quantity" class="form-label fw-bold">Quantity</label>
          <input type="number" class="form-control" id="quantity" name="quantity" value="${
            product.quantity
          }">
        </div>
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" class="btn btn-danger">Delete</button>
      </form>
    </div>
    </div>
  </div>
    `;
    });
  }

  async modifiyProduct(formElement) {
    const id = formElement.dataset.id;
    const formData = {};
    const formElements = formElement.querySelectorAll('input, select');
    formElements.forEach((element) => {
      formData[element.name] = Number(element.value) || element.value;
    });

    try {
      const response = await axios.put(
        `http://localhost:4000/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  }

  async deleteProduct(id) {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  }
}
const admin = new Admin();

window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = 'home.html';
  }

  admin.isAdmin();
  admin.renderProducts();
});

admin.form.addEventListener('submit', (e) => {
  e.preventDefault();
  admin.handleProduct();
});

admin.productsSection.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('btn-primary')) {
    admin.modifiyProduct(e.target.parentElement);
  } else if (e.target.classList.contains('btn-danger')) {
    admin.deleteProduct(e.target.parentElement.dataset.id);
  }
});
