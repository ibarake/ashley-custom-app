export const GetFirstTwoMacroCategories = `query {
    metaobjects(type: "macro_categories", first: 2) {
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
