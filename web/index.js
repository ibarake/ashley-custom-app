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
import getPages from "./getPages.js";
import { metaObjectUpdater } from "./metaObjectUpdater.js";

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

app.get("/api/pages/create", async (req, res) => {
  let status = 200;
  let error = null;

  try {
    const session = res.locals.shopify.session;
    const pages = await getPages(session);
    const macros = await metaobjectsRetriever(
      session,
      GetFirstTenMacroCategories
    );
    const subs = await metaobjectsRetriever(session, GetFirstTenSubCategories);

    const subsData = subs.body.data.metaobjects.edges.map((e) => e.node);
    const macroData = macros.body.data.metaobjects.edges.map((e) => e.node);

    const pagesData = pages.map((e) => e.title);

    // getting titles for all metapages
    const metaPages = pages
      .map((e) => {
        if (
          e.template_suffix === "macro-category" ||
          e.template_suffix === "sub-category"
        ) {
          return e.title;
        }
      })
      .filter((e) => e !== undefined);

    // joining macro titles with subs titles in 1 array
    const metaTitles = macroData
      .map((e) => e.displayName)
      .concat(subsData.map((e) => e.displayName));

    console.log(metaPages);
    console.log(metaTitles);

    // remaining page that needs to be deleted
    const remaining = metaPages.filter((value) => !metaTitles.includes(value));
    const pageToDeleteObj = pages.find((e) => e.title === remaining[0])?.id;

    console.log(remaining);
    console.log(pageToDeleteObj);

    if (pageToDeleteObj) {
      await shopify.api.rest.Page.delete({
        session: session,
        id: pageToDeleteObj,
      });
      console.log("page deleted to sync!");
    } else {
      console.log("no pages deleted to sync");
    }

    //looping thru the macro categories and extracting the data to create a page based on the data
    for (let i = 0; i < macroData.length; i++) {
      const macro = macroData[i];
      const title = macro.displayName;
      const template = "macro-category";

      if (pagesData.find((e) => e === title)) {
        console.log("Already created");
      } else {
        const response = await metaobjectsPageCreator(session, macro, template);
        console.log("page created");

        try {
          // linking the page created to the metaobject
          metaObjectUpdater(session, macro, response);
          console.log("meta objects page linked");
        } catch (error) {
          console.log(error);
        }
      }
    }
    //looping thru the sub categories and extracting the data to create a page based on the data
    for (let i = 0; i < subsData.length; i++) {
      const sub = subsData[i];
      const title = sub.displayName;
      const template = "sub-category";

      if (pagesData.find((e) => e === title)) {
        console.log("Already created");
      } else {
        const response = await metaobjectsPageCreator(session, sub, template);
        console.log("page created");
        try {
          // linking the page created to the metaobject
          metaObjectUpdater(session, sub, response);
          console.log("meta objects page linked");
        } catch (error) {
          console.log(error);
        }
      }
    }
    console.log("pages synced!");
    res.status(status).send({ msg: "pages synced!" });
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
