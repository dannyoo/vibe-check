import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { db } from './firebase';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import Typography from '@material-ui/core/Typography';

// const useStyles = makeStyles({
//   media: {
//     height: 140,
//   }
// });

function App() {
  // const classes = useStyles();
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
    <div className="App" style={{ paddingTop: 5 }}>
      {
        people &&
        <Container maxWidth="sm">
          <GridList cellHeight={500} cols={2}>
            {people.map((person: any) => (
              <GridListTile key={Math.random()} cols={1}>
                <Card>
                  <CardActionArea>
                    <CardMedia component="img" src="https://source.unsplash.com/330x200/?dog,cat" height="100" title={person.name} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {person.name}
                      </Typography>
                      {person.busy ? <LockIcon /> : <LockOpenIcon />}
                      <Typography variant="body2" color="textSecondary" component="p">
                        {person.busy ? "Busy" : "Available"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </GridListTile>
            ))}
          </GridList>
        </Container>
      }
    </div>
  );
}

export default App;
