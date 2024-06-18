import app from "./config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, getDoc, doc } from "firebase/firestore"


const auth = getAuth(app)
const db = getFirestore(app)

// Fetch navigation bar from HTML to render in index.html
function fetchNavigationBar() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      // Insert the navbar content into the navbarContainer
      document.getElementById('navbarContainer').innerHTML = data;
    })
    .catch(error => {
      console.error('Error fetching navbar:', error);
    });
}

fetchNavigationBar()


async function displayManagerButton() {
  var button = document.createElement('button')
  button.type = 'button'

  var anchor = document.createElement("a")
  anchor.href = "mngr_index.html"
  anchor.textContent = "Manager"

  button.appendChild(anchor)

  if(document.getElementById('managerButton') != null){
    document.getElementById('managerButton').appendChild(button)
  }
}


displayManagerButton()

// Observer
onAuthStateChanged(auth, async (user) => {
  const viewProfileBtn = document.getElementById("viewProfileBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const signInBtn = document.getElementById("signInBtn");
  const managerButton = document.getElementById("managerButton"); // Assuming you have a manager button element
  const createAccountBtn = document.getElementById("createAccountBtn");

  //Checks to see if a user is authenticated (logged in) 
  if (user) {
    console.log("Signed IN onAuthState - HomePage")
    if (signInBtn != null) {
      signInBtn.style.display = "none"; // Hide "Sign In" button (User is already signed-in)
      createAccountBtn.style.display= "none"; // Hide "Create account" button
    }

    try {
      // Get the user's document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      // checks to see if the doc being referenced exists in firestore
      if (userDocSnap.exists()) {
        // User document exists, retrieve the role field
        const userRole = userDocSnap.data().role;
        // have to check for userRole by itself or users not logged in can see it on index.html
        if (userRole && userRole.includes("admin")) {
          // User has admin role, display manager button
          managerButton.style.display = "block";
          //signInBtn.style.display = "none"; // Hide "Sign In" button (User is already signed-in)
         // createAccountBtn.style.display= "none"; // Hide "Create account" button

        } else {
          // User does not have admin role, hide manager button
          managerButton.style.display = "none";
        }
      } else {
        console.log("User document does not exist in Firestore");
        // Handle the case where user document does not exist
      }
    } catch (error) {
      console.error("Error retrieving user document:", error);
      // An error occured during document retrieval
    }

  } else {
    console.log("Signed OUT onAuthState - HomePage");

    // Hide View Profile, Sign-Out, and Manager Button (User is not signed-in)
    viewProfileBtn.style.display = "none";
    signOutBtn.style.display = "none";
    managerButton.style.display = "none";
  }
});




