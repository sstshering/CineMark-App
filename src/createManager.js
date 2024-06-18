import app from './config'
import {getAuth, onAuthStateChanged, updateProfile} from 'firebase/auth'
import {doc, getFirestore, setDoc} from 'firebase/firestore'
import {browserSessionPersistence, createUserWithEmailAndPassword, setPersistence,} from "firebase/auth"



const auth = getAuth(app)
const db = getFirestore(app) 
const movieCol = collection(db, "users")

document.getElementById("addManagerButton").addEventListener("click", function(event) {
    event.preventDefault();
    // Perform actions for setting a movie
    console.log("Add manager button clicked");
    window.location.href = "createManager.html"

    // the form to create a manager 
    const createAccountForm = document.querySelector("#createManagerAccount");
    if (createAccountForm != null)
        createAccountForm.addEventListener("submit",(event)=>{
            event.preventDefault()
            // user info
            const name = createAccountForm.name.value
            const email = createAccountForm.email.value
            const pass = createAccountForm.password.value
            //console.log(name)

            // this will sign the created user in after creating the account
            createUserWithEmailAndPassword(auth, email, pass) 
            .then((userCredential)=>{
                // holds the credentials from auth
                const user = userCredential.user
                // can use the uid to verify user access
                const uid = user.uid;
                console.log(user)
                console.log(user.uid)
                
            })
            
            .catch((e)=>{
                //Error from persistence caught
                console.log(e)
            })
        })
    });

const setManagerForm = document.querySelector("#assignManager")
setManagerForm.addEventListener("submit", (event)=>{
    event.preventDefault()

    const newManager = {
        firstName: setManagerForm.firstName.value,
        lastName: setManagerForm.lastName.value,
        email: setManagerForm.email.value,
        role: setManagerForm.role.value,
        doh: setManagerForm.doh.value,
        uid:uid 
        //id: setManagerForm.id.value
    }
    // I don't know if we need this part here since they're making the profile
    /*
    updateProfile(auth.currentUser,{
        displayName: assignManagerForm.firstName.value
    })
    .then(()=>{
        //A promise is returned
        console.log("Updated profile")
    })
    .catch((e)=>{ 
        console.log(e)
    })
    console.log(auth.currentUser.displayName)
    console.log(newUser)
    */
    const userDocRef = doc(db, "users", uid)
    setDoc(userDocRef, newManager)
    .then(()=>{
        console.log("New Manager Added")
        
    })
    .catch((e)=>{
        console.log(e) 
    })
})

//Observer
onAuthStateChanged(auth, (user) => { 
    if (user) {
        //User is signed in, see docs for a list of available properties
        //https://firebase.google.com/docs/reference/js/firebase.User
        //...

        const uid = user.uid;
        console.log(uid) 
        // console.log("Signed IN onAuthState") 
        
       

    } else {
        console.log("Signed OUT onAuthState")
        // User is signed out
        //...
    }
}) 