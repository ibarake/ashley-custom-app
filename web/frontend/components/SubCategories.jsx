import React from "react";
import { Card, DataTable } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const SubCategories = () => {
  const {
    data: { body: { data: { metaobjects: { edges } = {} } = {} } = {} } = {},
    isLoading: isLoadingTrue,
  } = useAppQuery({
    url: "/api/metaobjects/subcategories",
    reactQueryOptions: {
      onSucess: () => {},
    },
  });

  const rows = edges
    ? edges.map((subcategory) => {
        const collectionIds = subcategory.node.fields[2].value
          .match(/gid:\/\/shopify\/Collection\/(\d+)/g)
          .map((id) => "[" + id.split("/")[4] + "]")
          .join(", ");
        return [
          subcategory.node.id.split("/")[4],
          subcategory.node.displayName,
          collectionIds,
          "TODO: pull product counts from each collection inside this metaobject",
          subcategory.node.fields[3].value,
        ];
      })
    : [];

  const headings = [
    "ID",
    "Title",
    "Collections",
    "Total Products",
    "Description",
  ];

  return (
    <Card>
      {isLoadingTrue ? (
        <p>Loading...</p>
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
