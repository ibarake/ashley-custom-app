import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";

export default async function metaobjectsPageCreator(
  session,
  title,
  description,
  template,
  metafield
) {
  try {
    const page = new shopify.api.rest.Page({ session: session });
    page.title = title;
    page.body_html = description;
    page.template_suffix = template;
    page.metafields = [
      {
        key: "reference",
        value: metafield,
        type: "mixed_reference",
        namespace: "custom",
      },
    ];
    await page.save({
      update: true,
    });
    return page;
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
