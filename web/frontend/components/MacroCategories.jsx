import React from "react";
import { Card, DataTable } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";
import { GraphqlQueryError } from "@shopify/shopify-api";

const products = [
  {
    id: 1,
    title: "Product 1",
    price: "$10.00",
    inventory: 5,
    tags: ["tag1", "tag2"],
  },
  {
    id: 2,
    title: "Product 2",
    price: "$20.00",
    inventory: 10,
    tags: ["tag3", "tag4"],
  },
  // Add more products here
];

export function MacroCategories() {
  const rows = products.map((product) => [
    product.id,
    product.title,
    product.price,
    product.inventory,
    product.tags.join(", "),
  ]);

  const headings = ["ID", "Title", "Price", "Inventory", "Tags"];

  const fetch = useAuthenticatedFetch();

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://issaworkshop.myshopify.com/admin/api/2023-01/graphql.json"
      );
      console.log(await response);
    } catch (error) {
      if (error instanceof GraphqlQueryError) {
        throw new Error(
          `${error.message}\n${JSON.stringify(error.response, null, 2)}`
        );
      } else {
        throw error;
      }
    }
  };

  fetchData();

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "numeric", "text"]}
        headings={headings}
        rows={rows}
      />
    </Card>
  );
}
