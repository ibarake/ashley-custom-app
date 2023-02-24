import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import {
  MacroCategories,
  SubCategories,
  SyncMetaobjectsPagesButton,
} from "../components";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="Ashley App" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <SyncMetaobjectsPagesButton />
        </Layout.Section>
        <Layout.Section>
          <MacroCategories />
        </Layout.Section>
        <Layout.Section>
          <SubCategories />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
