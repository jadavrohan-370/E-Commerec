import axios from "axios";

// Pointing to our local scalable backend
const API_BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for JWT cookies
});

export const fetchProducts = async ({ category, brand, minPrice, maxPrice, rating, page = 1 } = {}) => {
  const response = await API.get("/products", {
    params: { category, brand, minPrice, maxPrice, rating, page },
  });
  
  // Our backend already returns products in the correct format with INR prices
  return {
    products: response.data.products,
    totalProducts: response.data.totalProducts,
    page: response.data.page,
    limit: response.data.limit,
  };
};

export const fetchProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const fetchTopProducts = async (limit = 6) => {
  const response = await API.get("/products/trending", {
    params: { limit }
  });
  return response.data;
};

// Search using our high-performance Elasticsearch/MongoDB fallback endpoint
export const searchProducts = async (query, { category, brand } = {}) => {
  const response = await API.get("/search", {
    params: { q: query, category, brand },
  });
  return response.data.products;
};

export const fetchPopularProducts = async () => {
  const response = await API.get("/recommendations/popular");
  return response.data;
};

export const fetchRecommendedProducts = async (userId) => {
  const response = await API.get(`/recommendations/recommended/${userId}`);
  return response.data;
};

export default API;
