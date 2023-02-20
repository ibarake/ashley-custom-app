import React, { useState, useEffect } from "react";
import { Card, DataTable, Button } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const MacroCategories = () => {
  const [isLoading, setIsLoading] = useState();

  const {
    data: { body: { data: { metaobjects: { edges } = {} } = {} } = {} } = {},
    isLoading: isLoadingTrue,
  } = useAppQuery({
    url: "/api/metaobjects",
    reactQueryOptions: {
      onSucess: () => {
        setData(edges);
        setIsLoading(true);
      },
    },
  });
  console.log(edges);

  const rows = edges
    ? edges.map((macroCategory) => {
        const collectionIds = macroCategory.node.fields[2].value
          .match(/gid:\/\/shopify\/Collection\/(\d+)/g)
          .map((id) => "[" + id.split("/")[4] + "]")
          .join(", ");
        return [
          macroCategory.node.id.split("/")[4],
          macroCategory.node.displayName,
          collectionIds,
          "TODO: pull product counts from each collection inside this metaobject",
          macroCategory.node.fields[3].value,
        ];
      })
    : [];

  const headings = [
    "ID",
    "Title",
    "Subcategories",
    "Total Products",
    "Description",
  ];

  return (
    <Card>
      {isLoading ? (
        <p>"Loading..."</p>
      ) : (
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={headings}
          rows={rows}
        />
      )}
    </Card>
  );
};
