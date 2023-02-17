export const GetFirstTwoMacroCategories = `{
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

export const GetFirstTenSubCategories = `{
    metaobjects(type: "sub_categories", first: 10) {
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
