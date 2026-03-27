import { readDb, writeDb } from "../config/jsonDb.js";

class ProductQuery {
  constructor(products) {
    this.products = products || [];
    // Ensure we are working with a copy
    this.productsArray = [...this.products];
  }

  limit(num) {
    if (typeof num === 'number' && !isNaN(num)) {
        this.productsArray = this.productsArray.slice(0, num);
    }
    return this;
  }

  skip(num) {
    if (typeof num === 'number' && !isNaN(num)) {
        this.productsArray = this.productsArray.slice(num);
    }
    return this;
  }

  sort(options) {
    if (!options) return this;
    const key = Object.keys(options)[0];
    const order = options[key];
    this.productsArray.sort((a, b) => {
      const valA = a[key] ?? 0;
      const valB = b[key] ?? 0;
      if (order === -1 || order === 'desc') {
        return valA < valB ? 1 : -1;
      }
      return valA > valB ? 1 : -1;
    });
    return this;
  }

  async exec() {
    return this.productsArray;
  }

  // Promise compliance
  then(onSuccess, onError) {
    return Promise.resolve(this.productsArray).then(onSuccess, onError);
  }
}

const Product = {
  find: (query = {}) => {
    let products = readDb().products || [];
    if (Object.keys(query).length > 0) {
      products = products.filter(product => {
        return Object.entries(query).every(([key, value]) => {
          if (value === undefined) return true;
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (value.$gte !== undefined && product[key] < value.$gte) return false;
            if (value.$lte !== undefined && product[key] > value.$lte) return false;
            if (value.$ne !== undefined && product[key] === value.$ne) return false;
            if (value.$in !== undefined && Array.isArray(value.$in) && !value.$in.includes(product[key])) return false;
            if (value.$or !== undefined && Array.isArray(value.$or)) {
                return value.$or.some(q => {
                    return Object.entries(q).every(([k, v]) => product[k] === v);
                });
            }
            return true;
          }
          if (value instanceof RegExp) return value.test(product[key]);
          return product[key] === value;
        });
      });
    }
    return new ProductQuery(products);
  },

  findById: async (id) => {
    const products = readDb().products || [];
    return products.find(product => product._id === id) || null;
  },

  findOne: async (query) => {
    const queryResult = Product.find(query);
    const products = await queryResult;
    return products[0] || null;
  },

  findByIdAndUpdate: (id, update) => {
      const db = readDb();
      const index = db.products.findIndex(p => p._id === id);
      if (index !== -1) {
          if (update.$inc) {
              for (let key in update.$inc) {
                  db.products[index][key] = (db.products[index][key] || 0) + update.$inc[key];
              }
          }
          writeDb(db);
          return { exec: async () => db.products[index] };
      }
      return { exec: async () => null };
  },

  create: async (productData) => {
    const db = readDb();
    const newProduct = {
      ...productData,
      _id: `prod${Date.now()}`.padStart(24, '0'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!db.products) db.products = [];
    db.products.push(newProduct);
    writeDb(db);
    return {
        ...newProduct,
        save: async function() { return this; }
    };
  },

  deleteMany: async () => {
    const db = readDb();
    db.products = [];
    writeDb(db);
    return { acknowledged: true, deletedCount: 0 };
  },

  insertMany: async (products) => {
    const db = readDb();
    if (!db.products) db.products = [];
    const newProducts = products.map((p, index) => ({
      ...p,
      _id: `prod${Date.now() + index}`.padStart(24, '0'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    db.products.push(...newProducts);
    writeDb(db);
    return newProducts;
  },

  deleteOne: async (query) => {
      const db = readDb();
      const index = db.products.findIndex(prod => {
          return Object.entries(query).every(([key, value]) => prod[key] === value);
      });
      if (index !== -1) {
          db.products.splice(index, 1);
          writeDb(db);
          return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
  },

  countDocuments: async (query = {}) => {
    const products = await Product.find(query);
    return products.length;
  }
};

export default Product;
