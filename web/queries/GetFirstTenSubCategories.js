export const GetFirstTenSubCategories = `query {
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
