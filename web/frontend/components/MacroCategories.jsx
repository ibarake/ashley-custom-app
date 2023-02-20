import React, { useState } from "react";
import { Card, DataTable, Button } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const MacroCategories = () => {
  const [isLoading, setIsLoading] = useState();

  const headings = [
    "ID",
    "Title",
    "Total Subcategories",
    "Total Products",
    "Description",
  ];

  const {
    data: {
      body: {
        data: {
          metaobjects: { edges },
        },
      },
    },
    isLoading: isLoadingTrue,
  } = useAppQuery({
    url: "/api/metaobjects",
    reactQueryOptions: {
      onSucess: () => {
        setIsLoading(true);
      },
    },
  });
  console.log(edges);
  const rows = edges.map((macroCategory) => [
    macroCategory.node.id.split("/")[4],
    macroCategory.node.displayName,
    macroCategory.node.fields[2].value.split(",").length,
    "TODO: pull product counts from each collection inside this metaobject",
    macroCategory.node.fields[3].value,
  ]);

  return (
    <Card>
      {isLoadingTrue ? (
        <p>"Loading..."</p>
      ) : (
        <DataTable
          columnContentTypes={["text", "text", "text", "numeric", "text"]}
          headings={headings}
          rows={rows}
        />
      )}
      <Button>Fetch</Button>
    </Card>
  );
};
