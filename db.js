let db
let dbReq = indexedDB.open('mydatabase', 1)

dbReq.onupgradeneeded = function(event) {
  db = event.target.result
  let notes = db.createObjectStore('notes', {autoIncrement: true})
}

dbReq.onsuccess = function(event) {
  db = event.target.result
}

dbReq.onerror = function(event) {
  db = event.target.result
}

dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode)
}

function addStickyNote(db, message){
  let tx = db.transaction(['notes'], 'readwrite')
  let store = tx.objectStore('notes')
  let note = {
    text: message,
    timestamp: Date.now()
  }
  store.add(note)

  tx.oncomplete = function() {console.log('stored note!')}
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode)
  }
}

function submitNote() {
  let message = document.getElementById('newmessage')
  addStickyNote(db, message.value)
  message.value = ''
}
