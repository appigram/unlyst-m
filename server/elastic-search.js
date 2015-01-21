var Firebase = require('firebase');
var ElasticClient = require('elasticsearchclient')

// initialize our ElasticSearch API
var client = new ElasticClient({ host: 'https://app.bonsai.io/heroku/resources/ginkgo-5710626', port: 443 });

// listen for changes to Firebase data
var fb = new Firebase('fiery-heat-1976.firebaseio.com/unlyst-test');
fb.on('child_added',   createOrUpdateIndex);
fb.on('child_changed', createOrUpdateIndex);
fb.on('child_removed', removeIndex);

function createOrUpdateIndex(snap) {
  console.log('creating index');
  client.index(this.index, this.type, snap.val(), snap.key())
  .on('data', function(data) { console.log('indexed ', snap.key()); })
  .on('error', function(err) { console.log('error: ', err);});
}

function removeIndex(snap) {
  client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
    if( error ) console.error('failed to delete', snap.key(), error);
    else console.log('deleted', snap.key());
  });
}
