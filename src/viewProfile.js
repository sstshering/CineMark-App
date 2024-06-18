import app from "./config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, getDoc, doc, updateDoc} from "firebase/firestore"


const auth = getAuth(app)
const db = getFirestore(app)


// Append user info under 'Your Account'
function getUserInfo(email, membership, points) {
  const textNode = document.createTextNode(email);
  document.getElementById('accEmail').appendChild(textNode);

  const membershipNode = document.createTextNode(membership);
  document.getElementById('accMembership').appendChild(membershipNode);

  const pointsNode = document.createTextNode(points);
  document.getElementById('accPoints').appendChild(pointsNode);
}

async function retrieveUserMembershipInfo(uid){
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // TODO: Add default points when user account is created
    return [docSnap.data().membership, docSnap.data().points] //  TODO: Add field in user profile
  }
  else{
    console.log("No user found")
  }
}

async function renderCardsInfo(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const creditCards = docSnap.data().creditCards;
    const cardsContainer = document.getElementById("cardsContainer");

    // Clear the existing content inside the container
    cardsContainer.innerHTML = "";

    let currentRow;

    creditCards.forEach((creditCard, index) => {
      // Create card element
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('col-md-4');

      // Create card structure
      const cardBody = document.createElement('div');
      cardBody.classList.add('card', 'mb-3');

      const cardRow = document.createElement('div');
      cardRow.classList.add('row', 'no-gutters');

      const cardImgCol = document.createElement('div');
      cardImgCol.classList.add('col-md-3');

      const cardImg = document.createElement('img');
      cardImg.classList.add('card-img');
      cardImg.setAttribute('src', 'images/bank.jpg'); // Set the image source
      cardImg.setAttribute('alt', 'Card Image');

      cardImg.style.display = 'block'; // Ensure the image is a block element
      cardImg.style.margin = 'auto'; // Center horizontally
      cardImg.style.position = 'absolute'; // Position the image absolutely
      cardImg.style.top = '50%'; // Move the top of the image to the vertical center
      cardImg.style.left = '50%'; // Move the left of the image to the horizontal center
      cardImg.style.transform = 'translate(-50%, -50%)'; // Adjust position to 
      cardImg.style.width = '75px'; // Set the desired width
      cardImg.style.height = 'auto'; // Maintain aspect ratio

      const cardContentCol = document.createElement('div');
      cardContentCol.classList.add('col-md-8');

      const cardContent = document.createElement('div');
      cardContent.classList.add('card-body');

      const cardTitle = document.createElement('h5');
      //cardTitle.classList.add('card-title');
      cardTitle.style.color = 'black'
      cardTitle.textContent = creditCard.cc;

      const cardDate = document.createElement('p');
      //cardDate.classList.add('card-text');
      cardDate.style.color = 'black'
      cardDate.textContent = `Expiration Date: ${creditCard.exp}`;

      const cardName = document.createElement('p');
      //cardName.classList.add('card-text');
      cardName.style.color = 'black'
      cardName.textContent = `Name: ${creditCard.ccName}`;

      // Append elements to build card
      cardContent.appendChild(cardTitle);
      cardContent.appendChild(cardDate);
      cardContent.appendChild(cardName);

      cardContentCol.appendChild(cardContent);
      cardImgCol.appendChild(cardImg)

      cardRow.appendChild(cardImgCol);
      cardRow.appendChild(cardContentCol);

      cardBody.appendChild(cardRow);

      cardDiv.appendChild(cardBody);

      // Create a new row if index is multiple of 3
      if (index % 3 === 0) {
        currentRow = document.createElement('div');
        currentRow.classList.add('row');
        currentRow.classList.add('pl-4');
        cardsContainer.appendChild(currentRow);
      }

      // Append card element to the current row
      currentRow.appendChild(cardDiv);
    });
  } else {
    console.log("No user found");
  }
}

async function renderTicketsInfo(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const tickets = docSnap.data().tickets;

    // Clear the existing content inside the container
    ticketsContainer.innerHTML = "";

    let currentRow = 0

    tickets.forEach((ticket, index) => {
      if (index % 3 == 0) {
        currentRow = document.createElement("div")
        currentRow.className = 'row-container'
        currentRow.style.columnCount = '3'
        document.getElementById("ticketsContainer").appendChild(currentRow)
      }

      // Create card structure
      const cardBody = document.createElement('div');
      cardBody.className = 'invoiceCard'

      const cardImg = document.createElement('img');
      cardImg.style.float = 'left'
      cardImg.src = 'images/Logo.jpg'
      cardImg.alt = 'Card Image'
      cardImg.style.width = '50px'

      const cardInfo = document.createElement('div')
      cardInfo.className = 'invoiceCard-info'

      const cardNumber = document.createElement('i');
      cardNumber.textContent = ticket.orderNum
      cardNumber.style.fontSize = '30px'

      const cardTitle = document.createElement('h5');
      cardTitle.textContent = ticket.movie;

      const cardSeats = document.createElement('p');
      cardSeats.textContent = `Seats: ${ticket.seats}`;

      const cardTime = document.createElement('p');
      cardTime.textContent = `Time: ${ticket.time}`;

      const cardDate = document.createElement('p');
      cardDate.textContent = `Date: ${ticket.date}`;

      var line = document.createElement('hr')
      line.style = 'background-color: white; border-width: 3px; margin-top: 0px; margin-bottom: 5px;'

      // Append elements to build card
      cardInfo.appendChild(cardNumber);
      cardInfo.appendChild(line)
      cardInfo.appendChild(cardTitle);
      cardInfo.appendChild(cardSeats);
      cardInfo.appendChild(cardTime);
      cardInfo.appendChild(cardDate);

      cardBody.appendChild(cardImg);
      cardBody.appendChild(cardInfo);

      currentRow.appendChild(cardBody)
    });
    
  } else {
    console.log("No user found");
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


async function changeOnClick() {
  console.log("Button clicked!");
  const selectedMembership = document.querySelector('input[name="membershipType"]:checked').value;

  if (!currentUser) {
    console.error("User is not defined.");
    return;
  }

  if (selectedMembership === "Popcorn Pass") {
    // Display alert message if Popcorn Pass is selected
    alert("Your membership has been changed to Popcorn Pass.");
    // Update user's membership
    await updateUserMembership(currentUser.uid, selectedMembership);
  } else {
    // Get membership price for the selected membership type
    const membershipPrice = await getMembershipPrice(selectedMembership);
    if (membershipPrice !== null) {
      window.localStorage.setItem('membershipPrice', membershipPrice);
      const subtotal = membershipPrice;
      const tax= subtotal * 0.0625;
      const total = subtotal + tax;

      //format price toFixed(2)
      const finalTax = tax.toFixed(2)
      const finalTotal = total.toFixed(2)

      //store prices 
      window.localStorage.setItem('subtotal', subtotal)
      window.localStorage.setItem('tax', finalTax)
      window.localStorage.setItem('total', finalTotal)

      isMember()
      window.localStorage.setItem("selectedMembership", selectedMembership);
      // Redirect user to checkout page with membership type, price, and source as query parameters
      window.location.href = `checkout_vP.html?membership=${selectedMembership}&subtotal=${subtotal}&total=${total}&tax=${tax}`;
    } else {
      // Log an error if membership price is not found
      console.error(`Membership price for ${selectedMembership} not found.`);
    }
  }
}


//export it globally
window.changeOnClick = changeOnClick;


async function getMembershipPrice(membershipType) {
  try {
    // Map the input membershipType to the corresponding document ID in Firestore
    const membershipIdMap = {
      "Popcorn Pass": "Popcorn Pass",
      "Silver Screen": "Silver Screen",
      "Blockbuster VIP": "Blockbuster VIP"
    };

    // Get the Firestore document ID based on the membershipType
    const docId = membershipIdMap[membershipType];

    if (!docId) {
      console.error(`Invalid membership type: ${membershipType}`);
      return null;
    }

    const docRef = doc(db, "membershipPrice", docId);
    console.log("Membership type:", membershipType);
    console.log("Document ID:", docId);
    console.log("Document Reference:", docRef.path);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const price = docSnap.data().price;
      // Convert the price to a number if needed
      return parseFloat(price);
    } else {
      console.error(`Membership price document for ${membershipType} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving membership price:", error);
    return null;
  }
}


//redirecting to checkout.html from the membership change
function isMember() {
  console.log('Saving fromMember')
  window.localStorage.setItem('fromMovie','0')
  window.localStorage.setItem('fromMember','1')
  window.localStorage.setItem('fromGift','0')
}


// Define a global variable to hold the user object
let currentUser;

// Observer
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Signed IN onAuthState - View Profile")

    // Assign the user object to the global variable
    currentUser = user;

    // Retrieve user's membership info
    const membershipInfo = await retrieveUserMembershipInfo(user.uid);
    // Display user's information
    getUserInfo(user.email, membershipInfo[0], membershipInfo[1]);
    // Render user's tickets and credit cards
    await renderTicketsInfo(user.uid);
    await renderCardsInfo(user.uid);

    // Add event listener to the "Change Membership" button
    const changeMembershipButton = document.getElementById("confirmMembershipChange");
    changeMembershipButton.addEventListener("click", async () => {
      // Ensure that currentUser is defined before calling changeOnClick
      if (currentUser) {
        // Retrieve selected membership type from the modal
        const selectedMembership = document.querySelector('input[name="membershipType"]:checked').value;
        // Save selected membership type in local storage
        window.localStorage.setItem('selectedMembership', selectedMembership);
        // Update user's membership in the database
        await updateUserMembership(currentUser.uid, selectedMembership);
        // Update displayed membership type
        document.getElementById('accMembership').textContent = `Membership type: ${selectedMembership}`;
        // Hide the modal after updating membership
        $('#changeMembershipModal').modal('hide');

        isMember()

      } else {
        console.error("User is not defined.");
      }
    });
  } else {
    console.log("Signed OUT onAuthState - View Profile")
  }
})