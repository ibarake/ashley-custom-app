import React from "react";
import { Card, DataTable, List, Spinner } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export const MacroCategories = () => {
  const {
    data: {
      body: {
        data: { metaobjects: { edges: macrocategories } = {} } = {},
      } = {},
    } = {},
    isLoading: isLoadingMacro,
  } = useAppQuery({
    url: "/api/metaobjects/macrocategories",
  });

  const {
    data: {
      body: { data: { metaobjects: { edges: subcategories } = {} } = {} } = {},
    } = {},
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

  const rows = macrocategories
    ? macrocategories.map((macroCategory) => {
        const subIds = macroCategory.node.fields[2].value;
        const idArray = JSON.parse(subIds);

        const subTitles = subcategories
          ? subcategories
              .map((subcategory) =>
                idArray
                  ? idArray.includes(subcategory.node.id)
                    ? subcategory.node.displayName
                    : null
                  : null
              )
              .filter((value) => value !== null)
          : [];

        const subCollections = subcategories
          ? subcategories
              .map((subcategory) =>
                idArray
                  ? idArray.includes(subcategory.node.id)
                    ? JSON.parse(subcategory.node.fields[2].value)
                    : null
                  : null
              )
              .filter((value) => value !== null)
          : [];

        const productCount = collections
          ? collections
              .map((collection) =>
                subCollections[0]
                  ? subCollections[0].includes(collection.node.id)
                    ? collection.node.productsCount
                    : null
                  : null
              )
              .filter((value) => value !== null)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              )
          : 0;

        return [
          <strong>{macroCategory.node.id.split("/")[4]}</strong>,
          macroCategory.node.displayName,
          <List>
            {subTitles.map((subcategory, index) => (
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
            {JSON.stringify(macroCategory.node.fields[3].value).substring(
              0,
              500
            )}
            {JSON.stringify(macroCategory.node.fields[3].value).length > 500
              ? "..."
              : ""}
          </div>,
        ];
      })
    : [];

  const headings = [
    <strong>ID</strong>,
    <strong>Title</strong>,
    <strong>Subcategories</strong>,
    <strong>Total Products</strong>,
    <strong>Description</strong>,
  ];

  return (
    <>
      <Card>
        {isLoadingMacro ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
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
    </>
  );
};
