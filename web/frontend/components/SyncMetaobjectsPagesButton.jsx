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
      <div
        style={{
          padding: "10px 20px 10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isLoadingTrue || isRefetchingTrue ? (
          <>
            <span>
              Pages are <strong>syncing</strong> with all metaobjects
            </span>
            <Button loading>Sync Metaobjects Pages</Button>
          </>
        ) : (
          <>
            <span>
              All pages are <strong>synced</strong> with the metaobjects
            </span>
            <Button primary onClick={HandleSync}>
              Sync Metaobjects Pages
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
