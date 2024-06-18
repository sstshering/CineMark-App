import app from './config'
import { getAuth, indexedDBLocalPersistence, onAuthStateChanged } from 'firebase/auth'
import { doc, getFirestore, getDoc, arrayUnion, updateDoc, collection, getDocs } from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app)

// Validate entered date
async function checkDate() {
  // Add event listener to the form submission
  // TODO: Refactor this so that the user doesn't have to click on submit to check the date
  // First validate the date, if all fields are good, update the receipt with membership discount
  // OR check how can you add this logic to the HTML side only
  document.getElementById("checkout").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the value entered in the expiration date field
    var expirationDate = document.getElementById("ccExpiration").value;

    // Parse expiration date
    var inputMonth = parseInt(expirationDate.substring(0, 2));
    var inputYear = parseInt(expirationDate.substring(3, 5));

    // Get current date
    var currentDate = new Date();
    var currentYear = Number(currentDate.getFullYear() % 100); // Keep only last 2 digits
    var currentMonth = Number(currentDate.getMonth() + 1); // Month is 0-based, so add 1

    if (inputYear >= currentYear && inputMonth >= currentMonth) {
      console.log("Valid expiration date")
      // Expiration date is valid
      document.getElementById("ccExpiration").classList.remove("is-invalid");
      document.getElementById("ccExpiration").classList.add("is-valid");

      // Get the information from the movie selected
      const movieId = window.localStorage.getItem('movieSelected')
      const movieName = window.localStorage.getItem('movieName')
      const movieTime = window.localStorage.getItem('timeSelected')
      const movieDate = window.localStorage.getItem('dateSelected')
      const movieTickets = JSON.parse(window.localStorage.getItem('selectedSeats'))
      const orderNum = window.localStorage.getItem('ordernum')

      // Update seat availability based on purchase of tickets
      await updateAvailableSeats(movieId, movieTime, movieDate, movieTickets)

      // Check if user is signed in
      const user = auth.currentUser;

      if (user) {
        console.log("User is signed in.");

        // Save tickets info in user's profile
        await saveTicketInfo(user.uid, movieName, movieTime, movieDate, movieTickets, orderNum)

        // User is signed in, save card info
        // TODO: Add option for user to choose whether or not they want the card to be saved on their profile
        await saveNewCardInfo(user.uid, document.getElementById("ccName").value, document.getElementById("ccNumber").value, document.getElementById("ccExpiration").value);

        let updatedPoints = 0
        const membershipInfo = await retrieveUserMembershipInfo(user.uid)

        // TODO: Add math here to reflect new total in the page
        if (document.getElementById('rewardsCheck') != null && document.getElementById('rewardsCheck').checked) {
          await updateReceipt()
          updatedPoints -= 55
        }
        else {
          console.log("user wants to save the points - no discount")
        }

        let newPoints = getUserPoints(membershipInfo[0], parseInt(window.localStorage.getItem('subtotal'), 10))
        updatedPoints += newPoints + membershipInfo[1]

        await updateUserPoints(user.uid, updatedPoints)

      } else {
        console.log("User is not signed in. Cannot save ticket/card info.");
      }

      window.location.href = 'index.html';
    } else {
      // Expiration date is invalid
      console.log("Invalid expiration date")
      document.getElementById("ccExpiration").classList.remove("is-valid");
      document.getElementById("ccExpiration").classList.add("is-invalid");

    }
  });
}

checkDate()

// Update subtotal, tax and total displayed in receipt when points are redeemed
async function updateReceipt() {
  const discountDiv = document.createElement('div')
  discountDiv.style.paddingTop = '40px';

  const discount = document.createElement('p')
  discount.innerHTML = '20% discount received'
  discount.style.color = '#BA0001'
  discount.style.fontWeight = 'bold';

  discountDiv.appendChild(discount)
  document.getElementById('receipt').appendChild(discountDiv)

  let subtotal = parseInt(window.localStorage.getItem('subtotal'), 10);
  subtotal -= (0.2 * subtotal)

  console.log(subtotal)

  var tax = subtotal * 0.0625
  var total = subtotal + tax

  var formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(subtotal);

  document.getElementById('subtotalprice').textContent = formattedPrice;
  var formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(tax);

  document.getElementById('taxprice').textContent = formattedPrice;
  var formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(total);

  document.getElementById('totalprice').textContent = formattedPrice;
  var formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(subtotal);
}

// Obtain the user profile for the given user ID
async function saveTicketInfo(uid, movieName, movieTime, movieDate, movieTickets, movieOrderNum) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const ticketMap = { movie: movieName, time: movieTime, date: movieDate, seats: movieTickets, orderNum: movieOrderNum }

    // Update the list in Firestore
    updateDoc(docRef, {
      tickets: arrayUnion(ticketMap)
    })
      .then(() => {
        console.log('New ticket added to the DB successfully.');
      })
      .catch((error) => {
        console.error('Error adding new ticket to the DB: ', error);
      });

  } else {
    console.log("No user found")
  }
}

// Save credit card in user profile
async function saveNewCardInfo(uid, name, number, expirationDate) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const ccMap = { ccName: name, cc: number, exp: expirationDate }

    // Update the credit cards in Firestore
    updateDoc(docRef, {
      creditCards: arrayUnion(ccMap)
    })
      .then(() => {
        console.log('Added card to user profile in DB successfully.');
      })
      .catch((error) => {
        console.error('Error adding card to user profile in DB: ', error);
      });

  } else {
    // docSnap.data() will be undefined in this case
    console.log("No user found")
  }
}

// Retrieves blank receipt from local storage first, then chooses the corresponing menu we returned from
// i.e. if that item in local storage is a '1' or '0'
async function displayReceipt() {
  console.log('displaying receipt checkout.js')
  var receipt = window.localStorage.getItem('receipt')
  document.getElementById('receipt').innerHTML = receipt
  document.getElementById('receipt').className = 'receiptStatic'
  console.log('Blank Receipt obtained: ', document.getElementById('receipt'))

  console.log(window.localStorage.getItem('fromMovie'))
  console.log(window.localStorage.getItem('fromMember'))

  // Set the corresponding value from the menu you are accessing checkout from in local storage
  if(window.localStorage.getItem('fromMovie') == '1') {
    console.log(1)
    console.log('Displaying movie info')
    displayMovieReceipt()
    //displayMembershipReceipt(selectedMembership)
    //displayGiftCardReceipt()

  } else if(window.localStorage.getItem('fromMember') == '1') {
    console.log(2)
    console.log('Displaying membership info')
    const selectedMembership = window.localStorage.getItem('selectedMembership')
    console.log(selectedMembership)
   //displayMembershipReceipt(selectedMembership)
    //displayMovieReceipt()
    displayGiftCardReceipt()

  } else if(window.localStorage.getItem('fromGift') == '1') {
    console.log(3)
   // displayGiftCardReceipt()
   // displayMembershipReceipt(selectedMembership)
    displayMovieReceipt()
  }
  //displayMovieReceipt()
  displayPrices()
}


// APPEND to invoiceContainerInfo to display underneath the logo and orderNum
// APPEND to receipt to display below the items title

// ---- COMING FROM SEATSELECTION ----
function displayMovieReceipt() {
  //var receiptMovieInfo = document.createElement('div')
  //receiptMovieInfo.innerHTML = window.localStorage.getItem('receiptMovie')
  //var receiptSeatsInfo = document.createElement('div')
  //receiptSeatsInfo.innerHTML = window.localStorage.getItem('receiptSeats')
  var receiptConcessionInfo = document.createElement('div')
  receiptConcessionInfo.innerHTML = window.localStorage.getItem('receiptConcessions')

  //document.getElementById('invoiceContainerInfo').appendChild(receiptMovieInfo)
  //document.getElementById('receipt').appendChild(receiptSeatsInfo)
  document.getElementById('receipt').appendChild(receiptConcessionInfo)
}

// ---- COMING FROM MEMBERSHIP ----
// Function to display membership information on the receipt
function displayMembershipReceipt(selectedMembership) {
  var membershipPrice = window.localStorage.getItem('membershipPrice');

  var membershipSection = document.createElement('div');
  membershipSection.innerHTML = `Membership Type`;
  membershipSection.style.fontSize = "14px";
  membershipSection.style.fontWeight = "bold";
  membershipSection.style.fontStyle = "italic";

  var membershipType= document.createElement('div');
  membershipType.innerHTML = `${selectedMembership}`;
  membershipType.style.float = "left"; // Align to the left
  membershipType.style.fontWeight = "bold";
  membershipType.style.fontSize = "13px";

  var priceInfo = document.createElement('div');
  priceInfo.innerHTML = `$${membershipPrice}`;
  priceInfo.style.float = "right"; // Align to the right
  priceInfo.style.fontSize = "13px";

  // Append the membership section to the receipt
  document.getElementById('receipt').appendChild(membershipSection);
  document.getElementById('receipt').appendChild(membershipType);
  document.getElementById('receipt').appendChild(priceInfo);
}


// ---- COMING FROM GIFTCARD ----
function displayGiftCardReceipt() {
  console.log('Displaying GiftCard Info')
}

// To use display prices make sure to:
// SAVE your 'subtotal', 'tax', and 'total to local storage BEFORE redirecting to checkout.html'
function displayPrices() {
  var subtotal = window.localStorage.getItem('subtotal')

  var formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(subtotal);


  var tax = subtotal * .0625
  var formattedTax = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(tax);


  
  var total = window.localStorage.getItem('total')

  var formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(total);

  document.getElementById('subtotalprice').innerHTML = formattedSubtotal
  document.getElementById('taxprice').innerHTML = formattedTax
  document.getElementById('totalprice').innerHTML = formattedTotal
}

async function updateAvailableSeats(movieId, movieTime, movieDate, movieTickets) {
  // Needs the ID of the movie
  const showtimeCollection = collection(db, "movies/" + movieId + "/showtimes")

  // Reference to the specific document with movieDate within the collection
  const docRef = doc(showtimeCollection, movieDate);

  // Retrieve the document data
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Assuming data is a Map object
    const data = docSnap.data();
    const time = window.localStorage.getItem('timeSelected')
    const seats = data['times'][time];
    console.log(seats)

    movieTickets.forEach((ticket) => {
      // Convert character back to row number
      var rowNum = ticket[0].charCodeAt(0) - 65;
      var seat = Number(ticket.substring(1)) // Grab seat number

      console.log("row num = " + rowNum + "seat num " + seat)

      // Strings are immutable so we have to split the string into a list, then join it
      let rowString = seats[rowNum]
      let lst = rowString.split('')
      lst[seat] = '1'
      rowString = lst.join('')

      seats[rowNum] = rowString

    })

    // Update the seat availability in Firestore
    console.log(docRef)
    updateDoc(docRef, {
      [`times.${time}`]: seats
    })
      .then(() => {
        console.log('Updated seat availability to the DB successfully.');
      })
      .catch((error) => {
        console.error('Error updating seat availability to the DB: ', error);
      });

  } else {
    console.log('No such document!');
  }
}

async function redeemRewards(uid) {
  const membershipInfo = await retrieveUserMembershipInfo(uid)

  // If they have more than 55 pts they can reedeem them to get 20% off the purchase
  if (membershipInfo.length === 2 && membershipInfo[1] >= 55) {
    await renderRewardsSection(membershipInfo[1])
  }
}

// Render rewards section if non-guest user AND has points to redeem only
async function renderRewardsSection(availablePoints) {
  const rewardsSection = document.createElement('div');
  rewardsSection.innerHTML = `
        <h4 id="rewards" class="mb-3">Redeem Points</h4>` + `<p>Available Points: ` + availablePoints + `</p>` +
    `<p>Available Points after reedeming: ` + (availablePoints - 55) + `</p>` +
    `<div class="form-check form-switch">
            <input id="rewardsCheck" class="form-check-input" type="checkbox" role="switch">
            <label class="form-check-label" for="rewardsCheck">Use available points</label>
        </div>`
    + `<hr class="mb-4">`;

  // Append the section to the parent element
  const parentElement = document.getElementById('rewardsDiv');
  parentElement.appendChild(rewardsSection);
}

// Retrieves user membership type and points
async function retrieveUserMembershipInfo(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return [docSnap.data().membership, docSnap.data().points]
  }
  else {
    console.log("No user found")
  }
}

// Get new number of points for each membership type based on subtotal
function getUserPoints(membership, subtotal) {
  let points = 0
  const membershipLowerCase = membership.toLowerCase() // Avoid case-sensitive comparisons

  // 1 dollar = 1 point
  if (membershipLowerCase === 'popcorn pass') {
    points = Math.floor(subtotal);
  }
  // 1 dollar = 2 points
  else if (membershipLowerCase === 'silver screen') {
    points = Math.floor(subtotal) * 2;
  }
  // 1 dollar = 3.5 points
  else if (membershipLowerCase === 'blockbuster vip') {
    points = Math.floor(subtotal) * 3.5;
  }

  return points;
}

// Updates user points after they were redeemed
async function updateUserPoints(uid, newPoints) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    updateDoc(docRef, {
      points: newPoints
    })
      .then(() => {
        console.log('Updated points in DB successfully.');
      })
      .catch((error) => {
        console.error('Error updating points to DB: ', error);
      });
  }
  else {
    console.log("No user found")
  }
}

// Show/Hide payment requirements based on option selected
function togglePaymentMethod() {
  var paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;

  if (paymentMethod === "credit" || paymentMethod === "debit") {
    var showSavedCards = document.getElementById("saved-cards")
    showSavedCards.style.display = "none"

    var showCardFieldsToFillOut = document.getElementById("unregistered-card")
    showCardFieldsToFillOut.style.display = "";

    var showCvcDateFieldsToFillOut = document.getElementById("registered-card")
    showCvcDateFieldsToFillOut.style.display = "";
  }
  else {
    var showSavedCards = document.getElementById("saved-cards")
    showSavedCards.style.display = "block"

    var showCardFieldsToFillOut = document.getElementById("unregistered-card")
    showCardFieldsToFillOut.style.display = "none";

    var showCvcDateFieldsToFillOut = document.getElementById("registered-card")
    showCvcDateFieldsToFillOut.style.display = "";

    var inputFields = showCardFieldsToFillOut.querySelectorAll("input"); // Grab required input fields (ccNumber, ccName)

    // Loop through each input element and remove the required / not needed anymore fields
    inputFields.forEach(function (input) {
      input.removeAttribute("required");
    });
  }
}

// Add listener in case radio button for payment method is changed
document.addEventListener("DOMContentLoaded", function () {
  var radioButtons = document.querySelectorAll('input[name="paymentMethod"]');
  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", togglePaymentMethod);
  });
});

// Retrieve saved cards in user's profile
async function retrieveCards(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const creditCards = docSnap.data().creditCards
    const dropdown = document.getElementById("saved");

    creditCards.forEach((creditCard) => {
      const option = document.createElement("option");
      option.text = creditCard.cc;
      dropdown.appendChild(option);
    });
  }
  else {
    console.log('unexistent user')
  }
}


//Allow user to upgrade to different membership
async function updateUserMembership(uid, newMembership) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        membership: newMembership
      });
      console.log("Membership updated successfully.");
      return true;
    } else {
      console.error("User not found.");
      return false;
    }
  } catch (error) {
    console.error("Error updating membership:", error);
    return false;
  }
}


onAuthStateChanged(auth, async (user) => {
  if (user) {
    var showSavedCards = document.getElementById("saved-card-radio")
    showSavedCards.style.display = ""

    await redeemRewards(user.uid);
    await retrieveCards(user.uid);

    const submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", async () => {
      // Retrieve the selected membership type
      const selectedMembership = window.localStorage.getItem('selectedMembership');

      // Update user's membership in the database
      await updateUserMembership(user.uid, selectedMembership); 

      // Redirect the user to the index.html page after membership is updated
      window.location.href = 'index.html';
    });    
    
  } else {
    console.log("Signed OUT onAuthState - checkout")
  }
});


displayReceipt()