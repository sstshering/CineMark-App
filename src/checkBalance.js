// Import the initialized app from your configuration module
import app from "./config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Get a reference to the Firestore database
const db = getFirestore(app);

// Listen for the DOMContentLoaded event to ensure the HTML is fully parsed
document.addEventListener('DOMContentLoaded', () => {
  // Attach the event listener to the form
  const form = document.getElementById('balanceCheckForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
 
    const giftCardNumber = document.getElementById('giftCardNumber').value.trim();
    const giftCardPin = document.getElementById('giftCardPin').value.trim();
    const balanceMessage = document.getElementById('balanceMessage');

    console.log("Entered number: ", giftCardNumber);
    console.log("Entered PIN: ", giftCardPin);
    console.log("Entered PIN type: ", typeof giftCardPin); 
  


    // Reference the gift card document directly by its ID (which is the same as the gift card number)
    const giftCardDocRef = doc(db, "gift-cards", giftCardNumber);

    try {
      // Get the document snapshot
      const docSnapshot = await getDoc(giftCardDocRef);

      // Check if the document exists
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log("Document Data: ", data);
        if (data.pin === giftCardPin) {
          // Display the balance if the pin is correct
          console.log("Gift Card Balance: $", data.balance);
          balanceMessage.textContent = `Gift Card Balance: $${data.balance}`;
          balanceMessage.style.color = "#00FF00"; // Green color for success
        } else {
          // Inform the user if the pin is incorrect
          balanceMessage.textContent = "Incorrect PIN. Please try again.";
          balanceMessage.style.color = "#FF0000"; // Red color for error
        }
      } else {
        // Let the user know if the gift card number doesn't exist in the collection
        balanceMessage.textContent = "Gift card number not found. Please check and try again.";
        balanceMessage.style.color = "#FF0000"; // Red color for error
      }
    } catch (error) {
      // Handle any errors during the Firestore operation
      console.error("Error fetching document: ", error);
      balanceMessage.textContent = "An error occurred while checking the balance.";
      balanceMessage.style.color = "#FF0000"; // Red color for error
    }
  });
});


