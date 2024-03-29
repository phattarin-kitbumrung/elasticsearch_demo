import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'
const client = new Client({ node: 'http://localhost:9200' })

async function run () {
  // Let's start by indexing some data
  const doc1: RequestParams.Index = {
    index: 'game-of-thrones',
    body: {
      character: 'Ned Stark',
      quote: 'Winter is coming.'
    }
  }
  await client.index(doc1)

  const doc2: RequestParams.Index = {
    index: 'game-of-thrones',
    body: {
      character: 'Daenerys Targaryen',
      quote: 'I am the blood of the dragon.'
    }
  }
  await client.index(doc2)

  const doc3: RequestParams.Index = {
    index: 'game-of-thrones',
    refresh: true,
    body: {
      character: 'Tyrion Lannister',
      quote: 'A mind needs books like a sword needs a whetstone.'
    }
  }
  await client.index(doc3)

  // Let's search!
  const params: RequestParams.Search = {
    index: 'game-of-thrones',
    body: {
      query: {
        match: {
          quote: 'winter'
        }
      }
    }
  }
  client
    .search(params)
    .then((result: ApiResponse) => {
      console.log(result.body.hits.hits)
    })
    .catch((err: Error) => {
      console.log(err)
    })
}

run()