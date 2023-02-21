// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";

import metaobjectsRetriever from "./metaobjectsRetriever.js";
import metaobjectsPageCreator from "./metaobjectsPageCreator.js";
import { GetFirstTenSubCategories } from "./queries/GetFirstTenSubCategories.js";
import { GetFirstTenMacroCategories } from "./queries/GetFirstTenMacroCategories.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

//GETTING METAOBJECTS DATA

app.get("/api/metaobjects/subcategories", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const session = res.locals.shopify.session;
    const response = await metaobjectsRetriever(
      session,
      GetFirstTenSubCategories
    );
    res.status(status).send(response);
  } catch (e) {
    console.log(`Failed to process: ${e.message}`);
    status = 500;
    error = e.message;

    res.status(status).send(error);
  }
});

app.get("/api/metaobjects/macrocategories", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const session = res.locals.shopify.session;
    const response = await metaobjectsRetriever(
      session,
      GetFirstTenMacroCategories
    );
    res.status(status).send(response);
  } catch (e) {
    console.log(`Failed to process: ${e.message}`);
    status = 500;
    error = e.message;

    res.status(status).send(error);
  }
});

app.get("/api/pages/create", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    const response = await metaobjectsPageCreator(res.locals.shopify.session);
    res.status(status).send(response);
  } catch (e) {
    console.log(`Failed to process: ${e.message}`);
    status = 500;
    error = e.message;
    res.status(status).send(error);
  }
});

app.use(express.json());

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
