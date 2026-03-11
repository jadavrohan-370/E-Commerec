import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
});

export const checkElasticsearchConnection = async () => {
  try {
    const health = await client.cluster.health();
    console.log(`Elasticsearch Connected: ${health.status}`);
  } catch (error) {
    console.warn(`Elasticsearch connection failed. Search will fallback to MongoDB.`);
  }
};

export const indexProduct = async (product) => {
  try {
    await client.index({
      index: "products",
      id: product._id.toString(),
      document: {
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        rating: product.rating,
      },
    });
  } catch (error) {
    console.error("ES Index Error:", error.message);
  }
};

export const deleteProductFromES = async (productId) => {
  try {
    await client.delete({
      index: "products",
      id: productId.toString(),
    });
  } catch (error) {
    console.error("ES Delete Error:", error.message);
  }
};

export const searchProductsES = async (queryText, filters = {}) => {
  try {
    const must = [
      {
        multi_match: {
          query: queryText,
          fields: ["name^3", "brand^2", "category", "description"],
          fuzziness: "AUTO",
        },
      },
    ];

    if (filters.category) {
      must.push({ term: { "category.keyword": filters.category } });
    }
    if (filters.brand) {
      must.push({ term: { "brand.keyword": filters.brand } });
    }

    const { hits } = await client.search({
      index: "products",
      query: {
        bool: {
          must,
        },
      },
    });
    return hits.hits.map((hit) => hit._id);
  } catch (error) {
    console.error("ES Search Error:", error.message);
    return [];
  }
};

export default client;
