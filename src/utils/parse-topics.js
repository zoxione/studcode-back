require('dotenv').config();

let currentCursor = '';
let isEnd = false;

async function main() {
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

    let response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PRODUCTHUNT_TOKEN}`,
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    console.log(response);

    if (response.status === 429) {
      console.log(response.headers.get('X-Rate-Limit-Reset'));
      console.log(currentCursor);
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

      let tag = {
        name: {
          en: topic,
          ru: '',
        },
      };

      response = await fetch('http://localhost:3000/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag),
      });

      await response.json();
    }

    console.log(response.headers.get('X-Rate-Limit-Remaining'));
  }
}

main();
