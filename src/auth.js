import app from "./config";
import { browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(app)
const db = getFirestore(app)

const createAccountForm = document.getElementById("createAccount")

if (createAccountForm != null) {
  createAccountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputName = createAccountForm.name.value;
    const inputEmail = createAccountForm.email.value;
    const inputPass = createAccountForm.password.value;
    const inputDob = createAccountForm.dob.value;
    const inputMembership = createAccountForm.membership.value;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        //Promise returned by setPersistence
        createUserWithEmailAndPassword(auth, inputEmail, inputPass)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user.uid);

            const newUser = {
              name: inputName,
              dob: inputDob,
              membership: inputMembership,
              points: 0,
            };

            const userDocRef = doc(db, "users", user.uid);

            setDoc(userDocRef, newUser)
              .then(() => {
                console.log("New User Added to DB");
                // Check if the selected membership is "Popcorn Pass"
                if (inputMembership === "Popcorn Pass") {
                  // Display a message indicating successful account creation
                  alert("Account successfully created!");
                  window.location.href="index.html";
                } 
              })
              .catch((e) => {
                console.log("Error when adding new user to DB: " + e);
              });
          })
          .catch((error) => {
            console.error("Error creating user: ", error);
          });
      })
      .catch((e) => {
        //Error from persistence caught
        console.log(e);
      });
  });
}


const signInForm = document.getElementById("signIn")

if (signInForm != null)
    // listens for the submit to fire event
    signInForm.addEventListener("submit", (event)=>{
        event.preventDefault()
        // sets persistence to the authenticated user 
        setPersistence(auth, browserSessionPersistence)
        .then(()=>{
            // email and pass are tied to auth
            const email = signInForm.email.value 
            const pass = signInForm.password.value

            console.log(email)
            console.log(pass)
            // uses the email and password to authenticate a user
            signInWithEmailAndPassword(auth,email,pass)
            .then((user)=>{
                console.log("Signed In With Created user")
                console.log(auth)
                window.location.href = "index.html"
            }).catch((e)=>{
                console.log(e)
            }) 
        })
        .catch((e)=>{
            console.log("Persistence error 2")
        })

    })

async function signOutonClick() {
  const signOutButton = document.getElementById("signOutBtn");

  if (signOutButton) {
    signOutButton.addEventListener("click", (event) => {
      console.log("Signed out button clicked")
      event.preventDefault();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          console.log("Signed Out");
          window.location.href = "index.html";
        })
        .catch((error) => {
          // An error happened.
          console.error("Error when signing out: ", error);
        });
    });
  }
}

//export it globally
window.signOutonClick = signOutonClick;


// Observer for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    //User is signed in, see docs for a list of available properties
    //https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(uid)
    console.log("Signed IN onAuthState")
    // User is signed in
    signOutonClick(); // Attach event listener when user is signed in

  } else {
    console.log("Signed OUT onAuthState")
    // User is signed out
  }
})

signOutonClick();


