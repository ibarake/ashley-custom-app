import React from "react";
import { Button, Card } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const SyncMetaobjectsPagesButton = () => {
  const {
    data,
    isLoading: isLoadingTrue,
    refetch,
    isRefetching: isRefetchingTrue,
  } = useAppQuery({
    url: "/api/pages/create",
  });

  console.log(data);

  const HandleSync = () => {
    refetch();
  };

  return (
    <Card>
      {isLoadingTrue || isRefetchingTrue ? (
        <div
          style={{
            padding: "10px 20px 10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Pages are <strong>syncing</strong> with all metaobjects
          </span>
          <Button loading>Sync Metaobjects Pages</Button>
        </div>
      ) : (
        <div
          style={{
            padding: "10px 20px 10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            All pages with the metaobjects <strong>synced</strong>
          </span>
          <Button primary onClick={HandleSync}>
            Sync Metaobjects Pages
          </Button>
        </div>
      )}
    </Card>
  );
};
