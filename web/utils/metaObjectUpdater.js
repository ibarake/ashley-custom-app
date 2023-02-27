import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export const metaObjectUpdater = async (session, meta, response) => {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    const data = await client.query({
      data: {
        query: `mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
          metaobjectUpdate(id: $id, metaobject: $metaobject) {
            metaobject {
              handle
              season: field(key: "page") {
                value
              }
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
        variables: {
          id: meta.id,
          metaobject: {
            fields: [
              {
                key: "page",
                value: response.admin_graphql_api_id,
              },
            ],
          },
        },
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
};
