const firebase = require("firebase");

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);
const db = firebase.firestore();

async function execute() {
  const userData = {
    name: "name" + (new Date()).getTime(),
  };
  const userRef = await db.collection("users").add(userData);

  const postData = {
    name: "post" + (new Date()).getTime(),
    user: userRef
  };
  const postRef = await db.collection("posts").add(postData);

  const querySnapshot = await db.collection("posts").get();
  const posts = [];
  querySnapshot.forEach(doc => {
    posts.push(doc.data());
  });

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const userQuerySnapshot = await post.user.get();
    post.userData = userQuerySnapshot.data();
  }

  return posts;
}

execute().then(posts => {
  console.log(posts);
  process.exit(0);
});

