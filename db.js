let db
let dbReq = indexedDB.open('mydatabase', 1)

dbReq.onupgradeneeded = function(event) {
  db = event.target.result
  let notes = db.createObjectStore('notes', {autoIncrement: true})
}

dbReq.onsuccess = function(event) {
  db = event.target.result
  getAndDisplayNotes(db)
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

  tx.oncomplete = function() {getAndDisplayNotes(db)}
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode)
  }
}

function addManyNotes(db, messages) {
  let tx = db.transaction(['notes'], 'readwrite')
  let store = tx.objectStore('notes')

  for (let i = 0; i < messages.length; i++)
    store.add({
      text: messages[i],
      timestamp: Date.now()
    })
  
  tx.oncomplete = function() {console.log('transaction complete')}
}

function submitNote() {
  let message = document.getElementById('newmessage')
  addStickyNote(db, message.value)
  message.value = ''
}

function getAndDisplayNotes(db) {
  let tx = db.transaction(['notes'], 'readonly')
  let store = tx.objectStore('notes')

  let req = store.openCursor()
  let allNotes = []

  req.onsuccess = function(event) {
    let cursor = event.target.result

    if (cursor != null) {
      allNotes.push(cursor.value)
      cursor.continue()
    } else getAndDisplayNotes(allNotes)
  }

  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode)
  }
}

function displayNotes(notes) {
  let listHTML = 'ul'

  for(let i = 0; i < notes.length; i++) {
    let note = notes[i]
    listHTML += '<li>' + note.text + ' ' + new Date(note.timestamp).toString() + '</li>'
  }

  document.getElementById('notes').innerHTML = listHTML
}
