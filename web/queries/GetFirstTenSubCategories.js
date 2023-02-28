export const GetFirstTenSubCategories = `query {
    metaobjects(type: "sub_categories", first: 100) {
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
