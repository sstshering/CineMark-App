import app from "./config"
import {getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import{getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

// gets the database from Firestore project
const db = getFirestore(app)
const storage = getStorage(app)

function fetchBanner() {
    fetch('banner.html')
    .then(response => response.text())
    .then(data => {
        // Insert the banner content into the bannerContainer
        document.getElementById('bannerContainer').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching banner:', error);
    });
}
  
fetchBanner()


// Assuming you have a function to update the banner with promo data
async function updateBanner(promoData) {
  // Event listener for form submission
  const displayPromoForm = document.getElementById("displayPromos");
  displayPromoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Retrieve selected promo ID from dropdown
    const selectedPromoId = displayPromoForm.promo.value;
    console.log(displayPromoForm.promo.value)

    // Fetch promo document from Firestore
    const promoDocRef = doc(db, "movie-promos", selectedPromoId);
    const promoDocSnapshot = await getDoc(promoDocRef);

    if (promoDocSnapshot.exists()) {
      const promoData = promoDocSnapshot.data();

      // Update banner elements with promo data
      document.getElementById('bannerTitle').textContent = promoData.offeredPromo;
      document.getElementById('bannerContent').textContent = promoData.offerDescription;
      document.getElementById('bannerExpDate').textContent = `Offer ends: ${promoData.offerDuration}`;
      console.log("Promo selected: " + promoData.offeredPromo)
    } else {
      console.log("Promo not found!");
    }
  });
}

updateBanner()

