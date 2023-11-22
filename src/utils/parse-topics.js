require('dotenv').config({
  path: '.env.test',
});

let currentCursor = '';
let isEnd = false;

async function main() {
  let response = await fetch(`http://localhost:${process.env.PORT}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  let { access_token, refresh_token } = await response.json();

  while (isEnd !== true) {
    let query = `query getTopics {
      topics(first: 20, after: "${currentCursor}") {
        totalCount
        edges {
          cursor
          node {
            name
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }`;

    response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PRODUCTHUNT_TOKEN}`,
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    if (response.status === 429) {
      console.log(response.headers.get('X-Rate-Limit-Reset'));
      console.log(currentCursor);
      isEnd = true;
      break;
    } else if (response.status === 401) {
      console.log(`token ${process.env.PRODUCTHUNT_TOKEN} expired`);
      isEnd = true;
      break;
    }

    let result = await response.json();
    console.log(result.data.topics.totalCount);
    currentCursor = result.data.topics.pageInfo.endCursor;

    if (result.data.topics.pageInfo.hasNextPage === false) {
      console.log('done');
      isEnd = true;
    }

    for (let i = 0; i < result.data.topics.totalCount; i++) {
      let topic = result.data.topics.edges[i].node.name;

      response = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.YANDEX_TRANSLATE_TOKEN}`,
        },
        body: JSON.stringify({
          folderId: process.env.YANDEX_TRANSLATE_FOLDERID,
          texts: [topic],
          targetLanguageCode: 'ru',
        }),
      });
      let translate = await response.json();
      console.log(translate);

      let tag = {
        name: {
          en: topic,
          ru: translate.translations[0].text,
        },
      };

      response = await fetch(`http://localhost:${process.env.PORT}/api/v1/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(tag),
      });
      let createdTag = await response.json();
      console.log(createdTag);
    }

    console.log(response.headers.get('X-Rate-Limit-Remaining'));
  }
}

main();
