import React from "react";
import { Card, DataTable, Button } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

const MacroCategoriesData = [
  {
    id: 1,
    title: "macro 1",
    total_subcategories: "9",
    total_products: 100,
    tags: ["tag1", "tag2"],
  },
  {
    id: 2,
    title: "macro 2",
    total_subcategories: "8",
    total_products: 100,
    tags: ["tag3", "tag4"],
  },
  // Add more products here
];

export function MacroCategories() {
  const rows = MacroCategoriesData.map((macroCategory) => [
    macroCategory.id,
    macroCategory.title,
    macroCategory.total_subcategories,
    macroCategory.total_products,
    macroCategory.tags.join(", "),
  ]);

  const headings = [
    "ID",
    "Title",
    "Total Subcategories",
    "Total Products",
    "Tags",
  ];

  const fetch = useAuthenticatedFetch();

  const fetchData = async () => {
    try {
      fetch("/api/metaobjects", {
        method: "POST",
      }).then((data) => console.log(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "numeric", "text"]}
        headings={headings}
        rows={rows}
      />
      <Button onClick={fetchData}>Fetch</Button>
    </Card>
  );
}
