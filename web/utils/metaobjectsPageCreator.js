import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export default async function metaobjectsPageCreator(session, meta, template) {
  try {
    const page = new shopify.api.rest.Page({ session: session });
    page.title = meta.displayName;
    page.body_html = meta.fields[3].value;
    page.template_suffix = template;
    page.metafields = [
      {
        key: "reference",
        value: meta.id,
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
