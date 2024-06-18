import app from "./config"

import { collection, getFirestore, getDocs, doc } from "firebase/firestore";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const movieHash = {};
const showtimeHash = {};

// Access the movies database and retrieve every movie
// and also append to hashmap using key: 'name'
async function retrieveMovies() {
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));

    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      movieHash[doc.id] = doc.data()
    });

  } catch (error) {
    console.error("Error retrieving movies: ", error);
  }
}

// Retrieve the status of the seats for a specific movie
// E.g available, occupied
async function retrieveSeats() {
  var movieSelected = window.localStorage.getItem('movieSelected');
  var date = window.localStorage.getItem('dateSelected');
  var time = window.localStorage.getItem('timeSelected');
  var seats = []

  try {
    // Given the data of the selected movie we access the appropriate showtimes
    const showtimeSnapshot = await getDocs(collection(db, "movies/" + movieSelected + "/showtimes"))

    showtimeSnapshot.forEach((doc) => {
      showtimeHash[doc.id] = doc.data()["times"]
    });
    console.log(showtimeHash)
    
    // Accesses the seats using the date and time, and accessing the seats array in the hash for that time
    seats = showtimeHash[date][time]

    console.log("MovieName: " + movieSelected + " Date: " + date + " Time: " + time + " Seats: " + seats)
    return seats

  } catch (error) {
    console.error("Error retrieving seats: ", error)
  }
}

// Display the receipt to an id 'receipt' in the html
async function displayMovieReceipt() {
  try {
    console.log('displaying receipt')
    var receipt = window.localStorage.getItem('receipt')
    document.getElementById('receipt').innerHTML = receipt
    document.getElementById('receipt').className = 'receipt'
    console.log(document.getElementById('receipt'))

    var invoiceContainerMovie = document.createElement('div')
    invoiceContainerMovie.id = 'invoiceContainerMovie'
    
    var movieName = document.createElement('div')
    movieName.className = 'inline noBot itemLabel'
    var nameArr = window.localStorage.getItem('movieSelected').split('_')

    var name = ''
    nameArr.forEach((word) => {
      name += word + ' '
    })

    movieName.textContent = name

    var movieShowtime = document.createElement('div')
    movieShowtime.className = 'noBot item'
    movieShowtime.textContent = window.localStorage.getItem('timeSelected')

    var line = document.createElement('hr')
    line.style = 'border-width: 2px; margin-top: 0px; margin-bottom: 2px;'

    // ---- SYNTHESIZE MOVIE INFO ----
    invoiceContainerMovie.appendChild(movieName)
    invoiceContainerMovie.appendChild(movieShowtime)
    invoiceContainerMovie.appendChild(line)
    document.getElementById('invoiceContainerInfo').appendChild(invoiceContainerMovie)

    // ---- SEATS INFORMATION ----
    var invoiceContainerSeats = document.createElement('div')
    invoiceContainerSeats.id = 'invoiceContainerSeats'
    invoiceContainerSeats.className = 'invoice-container'
    invoiceContainerSeats.style = 'display: flexbox; margin-left: 0%;'

    var seatsTitle = document.createElement('h3')
    seatsTitle.className = 'inline noBot itemLabel'
    seatsTitle.textContent = 'Seats'

    var invoiceContainerSeatAndPrice = document.createElement('div')
    invoiceContainerSeatAndPrice.className = 'invoice-container'

    var seats = document.createElement('h3')
    seats.id = 'seats'
    seats.className = 'noBot noTop item'

    var seatPrice = document.createElement('h3')
    seatPrice.id = 'seatPrice'
    seatPrice.className = 'noBot noTop price'

    // ---- SYNTHESIZE SEATS INFO ----
    invoiceContainerSeatAndPrice.appendChild(seats)
    invoiceContainerSeatAndPrice.appendChild(seatPrice)
    seatsTitle.appendChild(invoiceContainerSeatAndPrice)
    invoiceContainerSeats.appendChild(seatsTitle)

    document.getElementById('receipt').appendChild(invoiceContainerSeats)

    // ---- CONCESSIONS INFORMATION ----
    var invoiceContainerConessions = document.createElement('div')
    invoiceContainerConessions.id = 'invoiceContainerConcessions'
    invoiceContainerConessions.className = 'invoice-container'
    invoiceContainerConessions.style = 'display: flexbox; margin-left: 0%'

    var concessions = document.createElement('h3')
    concessions.id = 'concessions'
    concessions.className = 'noBot itemLabel'
    concessions.textContent = 'Concessions'

    var concessionPrice = document.createElement('h3')
    concessionPrice.id = 'concessionPrice'
    concessionPrice.className = 'noBot noTop price'

    // ---- SYNTHESIZE CONCESSIONS INFO ----
    invoiceContainerConessions.appendChild(concessions)
    invoiceContainerConessions.appendChild(concessionPrice)

    document.getElementById('receipt').appendChild(invoiceContainerConessions)

    // ---- CHECKOUT BUTTON ----
    var checkout = document.createElement('a')
    checkout.href = 'checkout.html'
    checkout.id = 'checkoutButton'
    var checkoutbutton = document.createElement('button')
    checkoutbutton.style = 'position: absolute; bottom: 2%; right: 50%;'
    checkoutbutton.textContent = 'Checkout'

    checkoutbutton.addEventListener('click', function() {
      console.log('Sending receipt data to local storage')
      window.localStorage.setItem('ordernum', document.getElementById('ordernum').textContent)
      window.localStorage.setItem('movieName', name)
      saveReceiptInfo()
      savePrices()
      isMovie()
    })

    checkout.appendChild(checkoutbutton)
    document.getElementById('receipt').appendChild(checkout)

    console.log(document.getElementById('receipt'))
  } catch (error) {
    console.error("Error displaying receipt: ", error);
  }
}

// Saves information such as movie name, showtime, seats selected, and concessions
function saveReceiptInfo() {
  var receiptMovieInfo = document.getElementById('invoiceContainerMovie')
  var receiptSeatsInfo = document.getElementById('invoiceContainerSeats')
  var receiptConcessionInfo = document.getElementById('invoiceContainerConcessions')

  window.localStorage.setItem('receiptMovie', receiptMovieInfo.innerHTML)
  window.localStorage.setItem('receiptSeats', receiptSeatsInfo.innerHTML)
  window.localStorage.setItem('receiptConcessions', receiptConcessionInfo.innerHTML)
  window.localStorage.setItem('tickettotal', calculateSeatPrice())
  window.localStorage.setItem('concessiontotal', calculateConcessionPrice())
}

// Saves information such as the 
function savePrices() {
  window.localStorage.setItem('subtotal', document.getElementById('subtotalprice').innerHTML)
  window.localStorage.setItem('tax', document.getElementById('taxprice').innerHTML)
  window.localStorage.setItem('total', document.getElementById('totalprice').innerHTML)
}

// Since we are redirecting to checkout.html from the common movie purchasing, we make that clear by saving it to local storage
function isMovie() {
  window.localStorage.setItem('fromMovie','1')
  window.localStorage.setItem('fromMember','0')
  window.localStorage.setItem('fromGift','0')
}

// For all the entries in the seats array from the database,
// create a seat button which stores its coordinates as a value.
async function displaySeats() {
  console.log('Display Seats func called');
  try {
    console.log('Attempting to display seats');
    if (document.getElementById('seatSelect') != null) {
      var movieSelected = window.localStorage.getItem('movieSelected');

      // Accessing database to current movie being read
      await retrieveMovies();
      console.log('Seat Selection for: ' + movieSelected);
      var currMovie = movieHash[movieSelected];
      console.log('Trying to access ' + movieSelected + ': ', currMovie);

      // Retrieving seats for the specified movie
      var seats = await retrieveSeats()

      var anchor = document.createElement('div');
      anchor.style = 'margin-left: 2%;';
      anchor.className = 'seating-container';

      // Calculate the middle of the seats array for the walkway
      // TODO: Figure out another way to not hardcode it if we don't want to
      const halfLength = Math.ceil(seats[0].length / 2);

      console.log('Displaying Seats');
      // Button div for every index of 'seats'
      for (let i = 0; i < seats.length; i++) {
        var row = document.createElement('div');
        row.className = 'row';

        // Create left side
        for (let j = 0; j < halfLength; j++) {
          var button = createSeatButton(i, j);
          row.appendChild(button);

          // If seats are occupied, disable buttons
          if (seats[i][j] == 1) {
            button.disabled = true
            button.style.backgroundColor = '#383838'
          }
        }

        // Create the walkway space
        var walkway = document.createElement('div');
        walkway.style.width = '80px';
        walkway.style.display = 'inline-block';
        row.appendChild(walkway);

        // Create right side
        for (let j = halfLength; j < seats[i].length; j++) {
          var button = createSeatButton(i, j);
          row.appendChild(button);

          // If seats are occupied, disable buttons
          if (seats[i][j] == 1) {
            button.disabled = true
            button.style.backgroundColor = '#383838'
          }
        }

        anchor.appendChild(row);
      }
      console.log(anchor);

      document.getElementById('seatSelect').appendChild(anchor);
      console.log("Appended seat anchor");
    }
  } catch (error) {
    console.error("Error displaying seats: ", error);
  }
}

// Initialize localStorage to store selected seats
window.localStorage.setItem('selectedSeats', JSON.stringify([]))

// Function to update selected seats in localStorage
function updateSelectedSeatsInStorage(selectedSeats) {
  window.localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
}

// Function to retrieve selected seats from localStorage
function getSelectedSeatsFromStorage() {
  return JSON.parse(localStorage.getItem('selectedSeats'));
}

// Gets called in the 'displaySeats()' loop to create a button with its' coordinates
function createSeatButton(row, seat) {
  var button = document.createElement('button');
  button.className = 'seat';
  var character = String.fromCharCode(65 + row);
  var buttonIndex = [row, seat].toString();

  button.textContent = character + "" + seat;
  button.value = buttonIndex;

  // Adding an event listener to toggle seat selection
  button.addEventListener('click', function () {
    var selectedSeats = getSelectedSeatsFromStorage();

    console.log(`Seat selected: ${character}${seat}`);
    this.classList.toggle('selected');

    // If toggle indicates "selected", add it to the local storage
    if (this.classList.contains('selected')) {
      console.log("here --->" + character + seat)
      selectedSeats.push(character + seat);
    } else {
      console.log("removing seats")
      selectedSeats = selectedSeats.filter(s => s !== character + seat);
    }

    // Update selected seats in localStorage
    updateSelectedSeatsInStorage(selectedSeats);

    document.getElementById('seats').innerHTML = ''
    selectedSeats.forEach((seat) => {
      var seatTextElement = document.createElement('p')
      seatTextElement.id = seat
      seatTextElement.textContent = seat + ", "
      seatTextElement.style = 'display: inline;'

      document.getElementById('seats').appendChild(seatTextElement)
    })
    renderTotalSeatPrice()
  });

  return button;
}

// Check if a seat was selected/unselected to add/remove text element from the receipt
function checkSeatStatus(seatSelected, character, seat) {
  if (seatSelected) {
    const seatTextElement = document.createElement('p')
    seatTextElement.id = character + seat
    seatTextElement.textContent = character + seat + ", "
    seatTextElement.style = 'display: inline;'

    document.getElementById('seats').appendChild(seatTextElement)
  }
  else {
    const seatTextElement = document.getElementById(character + seat)
    document.getElementById('seats').removeChild(seatTextElement)
  }

  // Render the total seat price after adding or removing seat
  renderTotalSeatPrice();
}

// Get the number of seats selected
function getNumberOfSeatsSelected() {
  return document.getElementById('seats').getElementsByTagName('p').length
}

// Get the total price for the seats
function calculateSeatPrice() {
  var price = movieHash[window.localStorage.getItem('movieSelected')]['ticketPrice']
  return getNumberOfSeatsSelected() * price
}

// Render the total seat price
function renderTotalSeatPrice(){
  // Format the seat price using decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(calculateSeatPrice());

  // Add formatted price to the header element in the HTML
  document.getElementById('seatPrice').textContent = formattedPrice;
  renderTotal()
}

// -------- DISPLAYING CONCESSIONS --------
async function displayConcessions() {
  try {
    console.log('Attempting to display concessions');
    const sizes = ["Small", "Medium", "Large"];
    const anchor = document.createElement('div');
    anchor.id = 'concessionsMenu';

    if (document.getElementById('menuContainer') != null) {
      const concessionsData = await getConcessionsFromFirestore();
      
      for (const concessionName in concessionsData) {
        const concessionPrices = concessionsData[concessionName];
        
        const dropdown = document.createElement('div');
        dropdown.className = 'interactive-menu-item';

        // Concession name
        var title = document.createElement('h2');
        title.textContent = concessionName;
        title.style = 'display: inline; height = 10px; margin-left: 5%; font-size: 60px; font-family: Brush Script MT, Brush Script Std, cursive;'

        // Img fit to the right side of the box
        var img = document.createElement('img');
        img.src = "menu/" + concessionName + ".jpg"
        img.style = "display: inline; width: 30%; margin-top: -100px; margin-left: 79%;"

        dropdown.appendChild(title)
        dropdown.appendChild(img)

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        dropdownContent.id = `${concessionName}Dropdown`;

        //dropdownContent.appendChild(img)
        
        sizes.forEach((size) => {
          const sizeOption = document.createElement('div');
          sizeOption.className = 'size-option';
          sizeOption.textContent = `${size} - $${concessionPrices[size]}`;
          
          const quantityControls = document.createElement('div');
          quantityControls.className = 'quantity-controls';
          
          const buttonDecrease = document.createElement('button');
          buttonDecrease.className = 'quantity-btn';
          buttonDecrease.textContent = '-';
          
          const quantityDisplay = document.createElement('span');
          quantityDisplay.id = `${size}${concessionName}Quantity`;
          quantityDisplay.textContent = '0';
          
          buttonDecrease.addEventListener("click", function() {
            updateQuantity(size, concessionName, false);
          });
          
          const buttonIncrease = document.createElement('button');
          buttonIncrease.className = 'quantity-btn';
          buttonIncrease.textContent = '+';
          
          buttonIncrease.addEventListener("click", function() {
            updateQuantity(size, concessionName, true);
          });
          
          quantityControls.appendChild(buttonDecrease);
          quantityControls.appendChild(quantityDisplay);
          quantityControls.appendChild(buttonIncrease);
          
          var temp = document.createElement('h2')
          temp.textContent = ""

          sizeOption.appendChild(quantityControls);
          dropdownContent.appendChild(sizeOption);
          dropdownContent.appendChild(temp)
        });

        // When dropdown is clicked, the content transitions instead of popping into existence.
        dropdownContent.style.height = '0px'
        dropdown.addEventListener("click", function() {
          console.log("Concession Toggled")
          dropdownContent.style.height = dropdownContent.style.height == '0px' ? '100px':'0px'
        });

        anchor.appendChild(dropdown);
        anchor.appendChild(dropdownContent);
      }

      console.log(anchor);
      document.getElementById('menuContainer').appendChild(anchor);
    }
  } catch (error) {
    console.error("Error displaying concessions: ", error);
  }
}

// Function to update the quantity of a concession
// function updateQuantity(size, concession, isIncreasing) {
//   const quantityId = `${size}${concession}Quantity`;
//   const quantityDisplay = document.getElementById(quantityId);
//   let quantity = parseInt(quantityDisplay.textContent, 10);
  
//   if (isIncreasing) {
//     quantity += 1;
//   } else if (quantity > 0) {
//     quantity -= 1;
//   }
  
//   quantityDisplay.textContent = quantity;
//   updateConcessions(size, concession); 
// }
function updateQuantity(size, concession, isIncreasing) {
  const quantityId = `${size}${concession}Quantity`;
  const quantityDisplay = document.getElementById(quantityId);
  let quantity = parseInt(quantityDisplay.textContent, 10);

  if (isIncreasing && quantity < 10) {
      quantity++;
  } else if (!isIncreasing && quantity > 0) {
      quantity--;
  }
  
  quantityDisplay.textContent = quantity;
  updateConcessions(size, concession, quantity); // Correctly pass size and updated quantity
}


// In a later version the concessions will be attained from the db
// async function getConcessions() {
//   var concessions = ["Popcorn","Burgers","Pizza","Drink"]
//   return concessions
// }

//Get concession from the database
async function getConcessions() {
  try {
    const concessionsFromFirestore = await getConcessionsFromFirestore();
    return Object.keys(concessionsFromFirestore).map(concessionName => ({
      name: concessionName,
      ...concessionsFromFirestore[concessionName]
    }));
  } catch (error) {
    console.error("Error fetching concessions from Firestore: ", error);
    return [];
  }
}

// Update the concesssions on the receipt
// function updateConcessions(size, concession) {
//   // Get quantity for the concession chosen
//   var quantity = parseInt(document.getElementById(size + concession + 'Quantity').textContent, 10)
//   console.log('Updating: ' + size + concession + ' ' + quantity)

//   // If quantity is 0 and the element exists, remove it
//   // Else if the element exists, update it, otherwise add it
//   if (quantity == 0) {
//     if (document.getElementById(size + concession) != null) {
//       document.getElementById('concessions').removeChild(document.getElementById(size + concession))
//     }
//   } else {
//     if (document.getElementById(size + concession) != null) {
//       document.getElementById(size + concession).textContent = '- x' + quantity + ' ' + size + ' ' + concession
//     } else {
//       var newItem = document.createElement('p')
//       newItem.id = size + concession
//       newItem.textContent = '- x' + quantity + ' ' + size + ' ' + concession
//       newItem.className = 'item'
//       document.getElementById('concessions').appendChild(newItem)
//       console.log(newItem)
//     }
//   }
//   renderTotalConcessionPrice()
// }

async function updateConcessions(size, concession, quantity) {
  console.log('Updating Concession: ', concession, size)
  var concessionsData = await getConcessionsFromFirestore()

  const concessionId = size + concession;
  var concessionElement = document.getElementById(concessionId);
  const pricePerItem = concessionsData[concession][size]; // make sure concessionsData is accessible and contains the prices
  const totalPrice = pricePerItem * quantity;

  if (quantity === 0 && concessionElement) {
    concessionElement.remove();
  } else {
    const itemText = `- x${quantity} ${size} ${concession}`;
    const priceText = `$${totalPrice.toFixed(2)}`;

    if (concessionElement) {
      concessionElement.textContent = `${itemText} ${priceText}`;
    } else {
      concessionElement = document.createElement('p');
      concessionElement.id = concessionId;
      concessionElement.className = 'item';
      concessionElement.textContent = `${itemText} ${priceText}`;
      document.getElementById('concessions').appendChild(concessionElement);
    }
  }

  renderTotalConcessionPrice();
}

// Iterate through the concessions to find all chosen ones to calculate
// function calculateConcessionPrice() {
//   var concessions = ["Popcorn","Burgers","Pizza","Drink"]
//   var sizes = ["Small","Medium","Large"]
//   var total = 0

//   concessions.forEach((concession) => {
//     sizes.forEach((size) => {
//       if(document.getElementById(size + concession + 'Quantity') != null) {
//         total += parseInt(document.getElementById(size + concession + 'Quantity').textContent, 10)
//       }
//     })
//   })
//   return total * 5.00
// }

async function calculateConcessionPrice() {
  let total = 0;
  var sizes = ['Small', 'Medium', 'Large']
  const concessionsData = await getConcessionsFromFirestore()
  sizes.forEach(size => {
      Object.keys(concessionsData).forEach(concession => {
          const quantityId = `${size}${concession}Quantity`;
          const quantity = parseInt(document.getElementById(quantityId)?.textContent || '0', 10);
          total += quantity * concessionsData[concession][size];
      });
  });
  return total;
}

// Render price
async function renderTotalConcessionPrice(){
  var concessionPrice = await calculateConcessionPrice()
  // Format the seat price using decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(concessionPrice);
  // Add formatted price to the header element in the HTML
  document.getElementById('concessionPrice').textContent = formattedPrice;
  renderTotal()
}

// Renders subtotal, tax, and total for the receipt
async function renderTotal() {
  var seatPrice = await calculateSeatPrice()
  var concessionPrice = await calculateConcessionPrice()
  var subTotal = seatPrice + concessionPrice
  var tax = subTotal * 0.0625
  var total = subTotal + tax


  window.localStorage.setItem('subtotalForPoints', subTotal)
  window.localStorage.setItem('total', total)

  // Create a formatted price to the element in the HTML
  var formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(subTotal);
  console.log(subTotal)
  console.log(formattedPrice)
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

  window.localStorage.setItem('TotalPrice', total)
}
 
//This new function fetches concessions and their prices from Firestore
async function getConcessionsFromFirestore() {
  const concessionsSnapshot = await getDocs(collection(db, "concessions"));
  const concessions = {};
  concessionsSnapshot.forEach((doc) => {
    concessions[doc.id] = doc.data();
  });
  return concessions;
}

displayMovieReceipt();
displaySeats();
displayConcessions();