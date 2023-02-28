import React from "react";
import { Card, DataTable } from "@shopify/polaris";
import { useAppQuery } from "../hooks";
import { List } from "@shopify/polaris";

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

  console.log(macrocategories);
  console.log(subcategories);

  const rows = macrocategories
    ? macrocategories.map((macroCategory) => {
        const subIds = macroCategory.node.fields[2].value;
        console.log(subIds);
        const idArray = JSON.parse(subIds);
        console.log(idArray);

        const subTitles = subcategories
          ? subcategories
              .map((subcategory) =>
                idArray.includes(subcategory.node.id)
                  ? subcategory.node.displayName
                  : null
              )
              .filter((value) => value !== null)
          : [];

        console.log(subTitles);

        // const titles = idArray.forEach((element) => getMetaobject(element));
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
            "TODO: pull product counts from each collection inside this
            metaobject"
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
