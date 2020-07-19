import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { db } from './firebase'
import Container from '@material-ui/core/Container';

function App() {

  const [people, updatePeople] = useState<any>();
  const [user, updateUser] = useState<any>();
  const [collection, updateCollection] = useState<any>();
  const [busy, updateBusy] = useState<any>();

  function onUpdate(busy: boolean, collection: string, user: string) {
    db.collection(collection).doc(user).update({
      busy: busy
    })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  useEffect(() => {

    let location: string[] = window.location.pathname.split("/");
    location.shift();
    let [collection, user] = [...location];
    updateUser(user);
    updateCollection(collection);

    let me = db.collection(collection).doc(user);

    // Make sure User exists
    me.get().then((docSnapshot) => {
      if (!docSnapshot.exists) {
        db.collection(collection).doc(user).set({
          name: user,
          busy: false
        })
          .then(function () {
            console.log("Document successfully written!");
            updateBusy(false);
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      } else {
        let it: boolean = docSnapshot?.data()?.busy;
        updateBusy(it);
      }
    })

    // Listen To Data
    db.collection(collection)
      .onSnapshot(function (querySnapshot) {
        let people: string[] = [];
        querySnapshot.forEach(function (doc: any) {
          people.push(doc.data());
        });
        console.log("Current people in collection: ", people);
        updatePeople(people);
      });

  }, []);

  return (
    <div className="App">
      {
        user &&
        <Container maxWidth="sm">
          
        </Container>
      }

    </div>
  );
}

export default App;
