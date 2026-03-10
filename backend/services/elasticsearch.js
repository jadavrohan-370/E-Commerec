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
    console.error(`Elasticsearch Connection Error: ${error.message}`);
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
    console.error("Elasticsearch Index Error:", error);
  }
};

export const searchProductsES = async (query) => {
  try {
    const { hits } = await client.search({
      index: "products",
      query: {
        multi_match: {
          query,
          fields: ["name^3", "brand^2", "category", "description"],
          fuzziness: "AUTO",
        },
      },
    });
    return hits.hits.map((hit) => hit._id);
  } catch (error) {
    console.error("Elasticsearch Search Error:", error);
    return [];
  }
};

export default client;
