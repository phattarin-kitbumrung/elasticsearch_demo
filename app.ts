import express from 'express'
import elasticsearch from 'elasticsearch'

const app = express()
const port = 3000
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
})

async function createIndex() {
  client.indices.create({
    index: 'person'
  }, function (err, res) {
    if (err) {
      console.log("Failed to create!", err)
    }
    else {
      console.log("Successful create:", res)
    }
  })
}
async function addDataToIndex() {
  client.index({
    index: 'person',
    id: '1',
    type: 'female',
    body: {
      "name": "Minizy",
      "surname": "Mint"
    }
  }, function (err, res) {
    if (err) {
      console.log("Failed to insert!", err)
    }
    else {
      console.log("Successful insert:", res)
    }
  })
}
async function bulkCommand() {
  client.bulk(
   {
     body: [
      { "index" : { "_index" : "test", "_id" : "1" } },
      { "field1" : "value1" },
      { "delete" : { "_index" : "test", "_id" : "2" } },
      { "create" : { "_index" : "test", "_id" : "3" } },
      { "field1" : "value3" },
      { "update" : {"_id" : "1", "_index" : "test"} },
      { "doc" : {"field2" : "value2"} }
    ]
  })
  console.log('Bulk running:')
}
async function searchData() {
  client.search({
    index: 'person',
    type: 'female',
    body: {
      query: {
        match: { "name": "Minizy" }
      },
    }
  }, function (err, res) {
    if (err) {
      console.log("search error: ", err)
    }
    else {
      console.log("--- Response ---");
      console.log(res)
      console.log("--- Hits ---");
      res.hits.hits.forEach(function (hit) {
        console.log(hit);
      })
    }
  })
}
async function deleteData() {
  client.delete({
    index: 'person',
    id: '1',
    type: 'female'
  }, function (err, res) {
    if (err) {
      console.log("Failed to delete!", err)
    }
    else {
      console.log("Successful delete:", res)
    }
  })
}
async function closeConnection() {
  client.close()
}

createIndex()
addDataToIndex()
bulkCommand()
searchData()
deleteData()
closeConnection()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})