import React, { useState } from "react";
import { Button, Toast, Card } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const SyncMetaobjectsPagesButton = () => {
  const [showToast, setShowToast] = useState(false);

  const { data, isLoading: isLoadingTrue } = useAppQuery({
    url: "/api/pages/create",
  });

  console.log(data?.msg);

  const handleToastDismiss = () => {
    setShowToast(false);
  };

  return (
    <Card>
      <span>TODO: Are pages synced?</span>
      {isLoadingTrue ? (
        <Button loading>Sync Metaobjects Pages</Button>
      ) : (
        <Button
          primary
          onClick={SyncMetaobjectsPagesButton}
          style={{ marginLeft: "100px" }}
        >
          Sync Metaobjects Pages
        </Button>
      )}
      {showToast && (
        <Toast
          content="Metaobjects Pages Synced!"
          onDismiss={handleToastDismiss}
        />
      )}
    </Card>
  );
};
