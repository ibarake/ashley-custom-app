import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import { GetFirstTenSubCategories } from "./queries/GetFirstTenSubCategories.js";

export default async function mataobjectsRetriever(session) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    await client.query({ data: GetFirstTenSubCategories });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
