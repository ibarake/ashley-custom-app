export const GetFirstTenMacroCategories = `query {
    metaobjects(type: "macro_categories", first: 10) {
      edges {
        node {
          id
          handle
          displayName
          fields{
            key
            value
          }
        }
      }
    }
  }`;
