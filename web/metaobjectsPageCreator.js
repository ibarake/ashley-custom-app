import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";

export default async function metaobjectsPageCreator(session) {
  try {
    const page = new shopify.api.rest.Page({ session: session });
    page.title = "Warranty information";
    page.body_html =
      "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    page.template_suffix = "macro-category";
    await page.save({
      update: true,
    });
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
