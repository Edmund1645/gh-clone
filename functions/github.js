const fetch = require('node-fetch');
const baseUrl = 'https://api.github.com/graphql';
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
exports.handler = function (event, context, callback) {
  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: `bearer ${process.env.GH_TOKEN}`,
    },
    body: JSON.stringify({
      query: `{ viewer {     login
          starredRepositories {
            totalCount
          }
          following {
            totalCount
          }
          followers {
            totalCount
          }
          repositories(last: 20) {
            nodes {
              name
              url
              description
              updatedAt
              isFork
              stargazerCount
              primaryLanguage {
                name
                color
              }
            }
          }
          avatarUrl
          bio
          email
          name
          location
          twitterUsername
          websiteUrl
          organizations {
            totalCount
          } }}`,
    }),
  })
    .then((response) => response.json())
    .then(({ data }) =>
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      })
    )
    .catch((err) => console.log(err));
};
