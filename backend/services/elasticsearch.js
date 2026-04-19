import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY
  },
  serverMode: 'serverless',
});

export const checkElasticsearchConnection = async () => {
  try {
    const health = await client.cluster.health();
    console.log(`Elasticsearch Connected: ${health.status}`);
  } catch (error) {
    console.warn(
      `Elasticsearch connection failed. Search will fallback to MongoDB.`,
    );
  }
};

export const setupIndex = async () => {
  try {
    const exists = await client.indices.exists({ index: "products" });
    if (!exists) {
      await client.indices.create({
        index: "products",
        mappings: {
          properties: {
            text: { type: "semantic_text", copy_to: "all_text" },
            name: { type: "text" },
            description: { type: "text" },
            brand: { type: "keyword" },
            category: { type: "keyword" }
          }
        }
      });
      console.log("Elasticsearch 'products' index initialized.");
    }
  } catch (error) {
    console.warn("Index might already exist or ES is down:", error.message);
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
        price: product.price,
        rating: product.rating,
        // Combined text for semantic search
        text: `${product.name}. ${product.brand}. ${product.category}. ${product.description}`,
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
    // Using the Semantic Retriever as requested
    const body = {
      retriever: {
        standard: {
          query: {
            semantic: {
              field: "text",
              query: queryText
            }
          }
        }
      }
    };

    const result = await client.search({
      index: "products",
      body,
    });
    
    return result.hits.hits.map((hit) => hit._id);
  } catch (error) {
    console.error("ES Semantic Search Error (falling back to legacy):", error.message);
    // Fallback to basic search if semantic fails
    try {
      const { hits } = await client.search({
        index: "products",
        query: {
          multi_match: {
            query: queryText,
            fields: ["name^3", "brand^2", "category", "description"],
          }
        }
      });
      return hits.hits.map((hit) => hit._id);
    } catch (innerError) {
      console.warn("ES Legacy Search Error:", innerError.message);
      return [];
    }
  }
};

export default client;
