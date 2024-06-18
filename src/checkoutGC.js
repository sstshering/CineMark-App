import app from './config'
import { getAuth, indexedDBLocalPersistence, onAuthStateChanged } from 'firebase/auth'
import { doc, getFirestore, getDoc, arrayUnion, updateDoc, collection, getDocs } from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app)

async function checkDate() {
  document.getElementById("checkout").addEventListener("submit", async function (event) {
    event.preventDefault();
    var expirationDate = document.getElementById("ccExpiration").value;
    var inputMonth = parseInt(expirationDate.substring(0, 2));
    var inputYear = parseInt(expirationDate.substring(3, 5));
    var currentDate = new Date();
    var currentYear = Number(currentDate.getFullYear() % 100);
    var currentMonth = Number(currentDate.getMonth() + 1);

    if (inputYear >= currentYear && (inputYear > currentYear || inputMonth >= currentMonth)) {
      console.log("Valid expiration date");
      document.getElementById("ccExpiration").classList.remove("is-invalid");
      document.getElementById("ccExpiration").classList.add("is-valid");
      
      // Continue with the rest of the checkout process
      // ... 

      window.location.href = 'index.html';
    } else {
      console.log("Invalid expiration date");
      document.getElementById("ccExpiration").classList.remove("is-valid");
      document.getElementById("ccExpiration").classList.add("is-invalid");
    }
  });
}

checkDate();

async function updateReceipt() {
  const giftCardAmount = parseFloat(window.localStorage.getItem('giftCardAmount') || '0');
  const giftCardQuantity = parseInt(window.localStorage.getItem('giftCardQuantity') || '1');
  
  const subtotal = giftCardAmount * giftCardQuantity;
  const tax = 0; // Assuming no tax for gift card purchases
  const total = subtotal; // No tax added

  const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);
  const formattedTax = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tax);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  const formattedGiftCardAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(giftCardAmount);
  // Update the DOM with the new values
  document.getElementById('subtotalprice').textContent = formattedSubtotal;
  document.getElementById('taxprice').textContent = formattedTax;
  document.getElementById('totalprice').textContent = formattedTotal;
  
  // Update the receipt detail section if it exists
  const receiptDetail = document.getElementById('receipt');
  console.log("giftCardQuantity: " + giftCardQuantity);
  console.log("formattedSubtotal: " + formattedSubtotal);
  console.log("formattedTotal: " + formattedTotal);
  console.log("selectedAmount: " + giftCardAmount);
  if (receiptDetail) {
    receiptDetail.innerHTML += `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">Gift Card Amount</h6>
          <small class="text-muted">Quantity: ${giftCardQuantity}</small>
        </div>
        <span class="text-muted">${formattedGiftCardAmount}</span>
      </li>
 

  
    
    `;
  }
  
  displayPrices();
}

async function displayReceipt() {
  // 2
  console.log("Enter display Receipt");
  var receipt = window.localStorage.getItem('receipt');
  document.getElementById('receipt').innerHTML = receipt;
  document.getElementById('receipt').className = 'receiptStatic';

  if(window.localStorage.getItem('fromGift') == '1') {
    displayGiftCardReceipt();
  }
  displayPrices();
}


function displayGiftCardReceipt() {
  //  1 
    // Retrieve gift card amount and quantity from localStorage
    console.log("Enter display gift card receipt");
    const giftCardAmount = parseFloat(window.localStorage.getItem('giftCardAmount') || '0');
    const giftCardQuantity = parseInt(window.localStorage.getItem('giftCardQuantity') || '1');
  
    // Calculate the subtotal and total
    const subtotal = giftCardAmount * giftCardQuantity;
    const total = subtotal; // Assuming no tax for gift card purchases
  
    // Format the subtotal and total for display
    const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);
    const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  
    // Update the DOM elements with the gift card details
    const receiptContainer = document.getElementById('receipt');
    if (receiptContainer) {
      receiptContainer.innerHTML = '<h1>Test Content</h1>';
      console.log('Content set successfully');
    } else {
      console.error('Receipt container not found');
    }
    
    console.log('Current innerHTML:', receiptContainer.innerHTML);
    receiptContainer.textContent = 'This is a direct text content test.';
    console.log('After setting textContent');
    // Assuming you have an element with id="receipt" to insert the items
    console.log("before diplay html");
    const giftCardSummary = `
    <h1> HEHEHEHEHEHEHEHE</H1> 
      <div class="receipt-items">
      
        <p class="receipt-item"><strong>Gift Card x${giftCardQuantity}</strong></p>
        <p class="receipt-price">${formattedSubtotal}</p>
      </div>
      <div class="receipt-total">
        <p class="receipt-total-label"><strong>Total</strong></p>
        <p class="receipt-total-price">${formattedTotal}</p>
      </div>
    `;
    console.log("after diplay html");
    
  
    receiptContainer.innerHTML = giftCardSummary;
    console.log('Current innerHTML:', receiptContainer.innerHTML);
  }

  function displayPrices() {
    // 3
    console.log("Enter display prices()");
    // var subtotal = window.localStorage.getItem('subtotal')
    // var tax = window.localStorage.getItem('tax')
    // var total = window.localStorage.getItem('total')

    const giftCardAmount = parseFloat(window.localStorage.getItem('giftCardAmount') || '0');
    const giftCardQuantity = parseInt(window.localStorage.getItem('giftCardQuantity') || '1');
    const subtotal = giftCardAmount * giftCardQuantity;

    const taxRate = 0.0825; // 8.25% tax rate
    const tax = subtotal * taxRate;

    const total = subtotal + tax;

    const formattedSubtotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);
    const formattedTax = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tax);
    const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

    document.getElementById('subtotalprice').innerHTML = formattedSubtotal
    document.getElementById('taxprice').innerHTML = formattedTax
    document.getElementById('totalprice').innerHTML = formattedTotal
  }
  
  // Call displayGiftCardReceipt to update the invoice when the page loads or at the appropriate time in your page's lifecycle
  //displayGiftCardReceipt();
  
  
  // This function should be called when the page loads
  displayReceipt();
  
  updateReceipt();
