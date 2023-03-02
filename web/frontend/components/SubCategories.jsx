import React from "react";
import { Card, DataTable, List, Spinner } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const SubCategories = () => {
  const {
    data: {
      body: { data: { metaobjects: { edges: subcategories } = {} } = {} } = {},
    } = {},
    isLoading: isLoadingTrue,
  } = useAppQuery({
    url: "/api/metaobjects/subcategories",
  });

  const {
    data: {
      body: { data: { collections: { edges: collections } = {} } = {} } = {},
    } = {},
  } = useAppQuery({
    url: "/api/metaobjects/collections",
  });

  const rows = subcategories
    ? subcategories.map((subcategory) => {
        const colIds = subcategory.node.fields[2].value;
        const idArray = JSON.parse(colIds);

        const colTitles = collections
          ? collections
              .map((collection) =>
                idArray
                  ? idArray.includes(collection.node.id)
                    ? collection.node.title
                    : null
                  : null
              )
              .filter((value) => value !== null)
          : [];

        const productCount = collections
          .map((collection) =>
            idArray
              ? idArray.includes(collection.node.id)
                ? collection.node.productsCount
                : null
              : null
          )
          .filter((value) => value !== null)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return [
          <strong>{subcategory.node.id.split("/")[4]}</strong>,
          subcategory.node.displayName,
          <List>
            {colTitles.map((subcategory, index) => (
              <List.Item key={index}>{subcategory}</List.Item>
            ))}
          </List>,
          <div
            style={{
              width: "200px",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {productCount}
          </div>,
          <div
            style={{
              width: "500px",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {JSON.stringify(subcategory.node.fields[3].value).substring(0, 500)}
            {JSON.stringify(subcategory.node.fields[3].value).length > 500
              ? "..."
              : ""}
          </div>,
        ];
      })
    : [];

  const headings = [
    <strong>ID</strong>,
    <strong>Title</strong>,
    <strong>Collections</strong>,
    <strong>Total Products</strong>,
    <strong>Description</strong>,
  ];

  return (
    <Card>
      {isLoadingTrue ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
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
