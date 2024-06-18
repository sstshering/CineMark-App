import app from './config'
import {getAuth, onAuthStateChanged, updateProfile} from 'firebase/auth'
import {doc, getFirestore, setDoc} from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app)  

//Observer
onAuthStateChanged(auth, (user) => { 
    if (user) {
        //User is signed in, see docs for a list of available properties
        //https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        // console.log(uid) 
        // console.log("Signed IN onAuthState") 
        //...
        const uid = user.uid
        console.log(uid)
        const initialProfileForm = document.querySelector("#initialUser")
        if (initialProfileForm != null)
            initialProfileForm.addEventListener("submit", (event)=>{
                event.preventDefault()
            

        const newUser = {
            firstName: initialProfileForm.firstName.value,
            lastName: initialProfileForm.lastName.value,
            dob: initialProfileForm.dob.value,
            uid: uid,
            purchasedMovies: new Map([])
        }
        updateProfile(auth.currentUser,{
            displayName: initialProfileForm.firstName.value
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

            const userDocRef = doc(db, "users", uid)
            setDoc(userDocRef, newUser)
            .then(()=>{
                console.log("New User Added")
            })
            .catch((e)=>{
                console.log(e) 
            })
        })


    } else {
        console.log("Signed OUT onAuthState")
        // User is signed out
        //...
    }
}) 
