
import app from "./config"
import {getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import{getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

// gets the database from Firestore project
const db = getFirestore(app)
const storage = getStorage(app)

const promos = collection(db, "movie-promos")

// creates the promo entry in the firestore
function addPromo() {
    const createPromoForm = document.querySelector("#createPromo")
    if (createPromoForm != null)
      createPromoForm.addEventListener("submit", (event) => {
        event.preventDefault()
        
        const moviePromo = {
          offeredPromo: createPromoForm.offeredPromo.value,
          offerDescription: createPromoForm.offerDescription.value,
          offerDuration: createPromoForm.offerDuration.value
        }
        addDoc(promos, moviePromo)
        .then((doc) => {
          console.log("Promo added: " + doc.id)
        })
        .catch((e) => {
          console.log(e)
        })
      })
}   

addPromo()


//dropdown with movies
async function populatePromosDropdown() {
  const querySnapshot = await getDocs(promos);
  const promoDropdown = document.getElementById("promo");
  promoDropdown.innerHTML = ""; //clear prev options
  querySnapshot.forEach((doc) => {
      const promoData = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = promoData.offeredPromo;
      promoDropdown.appendChild(option);
  });
}
populatePromosDropdown()



