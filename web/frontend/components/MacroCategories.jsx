import React from "react";
import { Card, DataTable } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const MacroCategories = () => {
  const {
    data: { body: { data: { metaobjects: { edges } = {} } = {} } = {} } = {},
    isLoading: isLoadingTrue,
  } = useAppQuery({
    url: "/api/metaobjects/macrocategories",
    reactQueryOptions: {
      onSucess: () => {},
    },
  });

  const { data } = useAppQuery({
    url: "/api/pages/create",
    reactQueryOptions: {
      onSucess: () => {},
    },
  });

  console.log(data);

  const rows = edges
    ? edges.map((macroCategory) => {
        const collectionIds = macroCategory.node.fields[2].value
          .match(/gid:\/\/shopify\/Metaobject\/(\d+)/g)
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
    <>
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
    </>
  );
};
