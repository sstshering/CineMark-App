import { getAdditionalUserInfo, updateCurrentUser, getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./config"

import { collection, getFirestore, getDocs } from "firebase/firestore";
//import { NormalModule } from "webpack";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

const auth = getAuth(app)

const movieHash = {};
const showtimeHash = {};
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Retrieves the movies from the DB
async function retrieveMovies() {
  // Access movie collection in Firestore
  const querySnapshot = await getDocs(collection(db, "movies"))
  var movies = []

  // Store the movie data in a list to be rendered in createMovieCardDecks()
  querySnapshot.forEach((doc) => {
    movies.push(doc.data())
  });

  movies.forEach((movie) => {
    movieHash[movie.id] = movie;
  })

  return movies;
}

// Retrieves all the showtimes from the db ONLY for the movie selected
async function retrieveShowtimes() {
  var movieSelected = window.localStorage.getItem('movieSelected')
  try {
    const showtimeSnapshot = await getDocs(collection(db, "movies/" + movieSelected + "/showtimes"))

    showtimeSnapshot.forEach((doc) => {
      showtimeHash[doc.id] = doc.data()["times"]
    });

    console.log('Retrieved showtimes: ', showtimeHash)

  } catch (error) {
    console.log("Error retrieving showtimes ", error)
  }
}

// Filter movies by genre when each button is clicked
async function filterMoviesByGenre(movies) {
  // Filter by genre if button is clicked
  if (document.getElementById("animeFilter") != null) {
    document.getElementById("animeFilter").addEventListener("click", function () {
      // movies.filter()
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      const animeMovies = movies.filter((movie) => movie.genre.includes("Anime"))
      createMovieCardDecks(animeMovies)

      console.log("anime filter button clicked")
    })
  }
  if (document.getElementById("actionFilter") != null) {
    document.getElementById("actionFilter").addEventListener("click", function () {
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      const actionMovies = movies.filter((movie) => movie.genre.includes("Action"))
      createMovieCardDecks(actionMovies)

      console.log("action filter button clicked")
    })
  }
  if (document.getElementById("comedyFilter") != null) {
    document.getElementById("comedyFilter").addEventListener("click", function () {
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      const comedyMovies = movies.filter((movie) => movie.genre.includes("Comedy"))
      createMovieCardDecks(comedyMovies)

      console.log("comedy filter button clicked")
    })
  }

  if (document.getElementById("horrorFilter") != null) {
    document.getElementById("horrorFilter").addEventListener("click", function () {
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      const horrorMovies = movies.filter((movie) => movie.genre.includes("Horror"))
      createMovieCardDecks(horrorMovies)

      console.log("horror filter button clicked")
    })
  }
 
  if (document.getElementById("musicalFilter") != null) {
    document.getElementById("musicalFilter").addEventListener("click", function () {
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      const musicalMovies = movies.filter((movie) => movie.genre.includes("Musical"))
      createMovieCardDecks(musicalMovies)

      console.log("musical filter button clicked")
    })
  }
  if (document.getElementById("romanceFilter") != null) {
    document.getElementById("romanceFilter").addEventListener("click", function () {
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      const romanceMovies = movies.filter((movie) => movie.genre.includes("Romance"))
      createMovieCardDecks(romanceMovies)

      console.log("romace filter button clicked")
    })
  }

  if (document.getElementById("allMoviesFilter") != null) {
    document.getElementById("allMoviesFilter").addEventListener("click", function () {
      document.getElementById("moviesCardDeckContainer").innerHTML = ""
      createMovieCardDecks(movies)

      console.log("all movies filter button clicked")
    })
  }
}

var movies = await retrieveMovies()
createMovieCardDecks(movies) // By default show all the movies
filterMoviesByGenre(movies)

// Create movie card deck dynamically
// Avoids previous overflow of page
async function createMovieCardDecks(movies) {
  // Create card deck using Bootstrap
  const cardDeckContainer = document.getElementById("moviesCardDeckContainer")
  // var movies = await retrieveMovies()
  let currentRow = 0

  movies.forEach((movie, index) => {
    // Only allow 4 movies per row
    if (index % 6 == 0) {
      currentRow = document.createElement("div")
      currentRow.className = 'row-container'
      cardDeckContainer.appendChild(currentRow)
    }

    const cardDeck = document.createElement("div")

    const card = document.createElement("div")
    card.className = 'card-container'

    // Navigate to movieSelect.html if movie was clicked
    card.addEventListener("click", function () {
      window.location.href = "movieSelect.html"
      window.localStorage.setItem('movieSelected', movie.id) // Keep track of movie name once redirected to movieSelect.html
    });

    const cardBody = document.createElement("div")

    // Holds movie's img
    // TODO: Retrieve movie image from DB insted of hardcoding it here
    const image = document.createElement("img")
    image.className = "card-img-top"
    image.src = movie.movieImage

    const cardInfo = document.createElement('div')
    cardInfo.className = 'card-info-container'

    // Holds movie's name (title of the card)
    const title = document.createElement("h5")
    title.style.marginLeft = '2%'
    title.style.fontSize = '20px'
    title.style.color = '#fffffffa'
    title.textContent = movie.name

    // Holds movie's rating
    const rating = document.createElement("p")
    rating.className = 'card-subinfo-container'
    rating.textContent = 'Rated ' + movie.rating

    // Holds movie's review
    const review = document.createElement("p")
    var stars = createStars(movie.review);
    review.innerHTML = "<p>" + stars + "</p>"
    review.style.fontSize = '25px'
    review.className = 'card-subinfo-container'


    // Add element child to parent (cardBody)
    cardBody.appendChild(image)
    cardInfo.appendChild(title)
    cardInfo.appendChild(rating)
    cardInfo.appendChild(review)

    // Add cardBody to card
    card.appendChild(cardBody)
    // Add card to card deck
    cardDeck.appendChild(card)
    // Add cardInfo to card
    cardDeck.appendChild(cardInfo)
    // Add cardDeck to the current row
    currentRow.appendChild(cardDeck)
  })
}

// Displays a single movie with all its' corresponding information such as name, description, etc.
// Accesses local storage to obtain the selected movie from the previous screen
async function acquireOne() {
  if (document.getElementById('movieSelect') != null) {
    await retrieveMovies();
    var movieSelected = window.localStorage.getItem('movieSelected');
    console.log('Displaying: ' + movieSelected)
    var currMovie = movieHash[movieSelected]
    console.log('Trying to access ' + movieSelected + ': ', currMovie)

    // Child of 'movieSelect' Element
    var anchor = document.createElement('div');
    anchor.setAttribute('class', 'container');
    anchor.setAttribute('style', 'margin-left: 5%; margin-top: 2%; grid-template-columns: 1fr 2fr; display: grid;');

    // Child of anchor
    var imgDiv = document.createElement('div');
    imgDiv.setAttribute('class', 'img');

    // Child of imgDiv
    var image = document.createElement('img');
    image.setAttribute('src', currMovie.movieImage);
    image.setAttribute('style', 'width: auto; height: 500px; margin-top: 30px; margin-right: 30px; margin-bottom: 30px; margin-left: -20px; object-fit: cover; object-position: 50%;');
    image.className = 'showtimeCont'

    imgDiv.appendChild(image)

    // Child of anchor
    var textDiv = document.createElement('Text');
    textDiv.className = 'movieText'
    textDiv.style.height = '500px'

    // Child of textDiv
    var name = document.createElement('h1');
    name.textContent = currMovie.name;
    name.style.marginBottom = '0%';
    name.style.marginTop = '-20px'

    // Child of textDiv
    var runtime = document.createElement('h2')
    runtime.className = 'movieSubText'
    runtime.textContent = currMovie.runtime + " min";

    // Child of textDiv
    var rating = document.createElement('h2');
    rating.className = 'movieSubText'
    rating.textContent = "Rating: " + currMovie.rating;

    // Child of textDiv
    var review = document.createElement('h2');
    var stars = createStars(currMovie.review);
    review.innerHTML = "<h2>" + stars + "</h2>"
    review.style.marginBottom = '5%';
    console.log(review)

    // Child of textDiv
    var description = document.createElement('h3')
    description.textContent = currMovie.description;
    description.style.marginBottom = '0';
    description.style.lineHeight = '1.75';

    imgDiv.appendChild(image)

    textDiv.appendChild(name);
    textDiv.appendChild(runtime);
    textDiv.appendChild(rating);
    textDiv.appendChild(review);
    textDiv.appendChild(description);

    anchor.appendChild(imgDiv);
    anchor.appendChild(textDiv);

    // Append the anchor element to the div
    document.getElementById('movieSelect').appendChild(anchor);
  }
}

// Iteratively accesses firebase movie that was selected to find all dates and times.
// Adds buttons to each time which is saved to local storage for the seatSelection screen.
async function displayShowtimes() {
  if (document.getElementById('movieSelect') != null) {
    await retrieveShowtimes();
    var anchor = document.createElement('div')
    anchor.setAttribute('class', 'container')
    anchor.style.marginLeft = '0%'

    // For each date, create a header with the date
    Object.keys(showtimeHash).forEach((date) => {

      var monthDayYear = date.split('-')

      var dateHead = document.createElement('h1')
      dateHead.className = 'showtimeDate'
      dateHead.textContent = month[monthDayYear[0]-1] + " " + monthDayYear[1]

      var br = document.createElement('br')
      dateHead.appendChild(br)
      anchor.appendChild(dateHead)

      var timeContainer = document.createElement('div')
      timeContainer.style = 'margin-left: 10%'
      timeContainer.className = 'showtimeCont'

      // For each time in each date create a button that displays a time and redirects to the seatSelection html
      Object.keys(showtimeHash[date]).forEach((time) => {

        var timeButton = document.createElement('button')
        timeButton.className = 'showtimeTime'
        timeButton.style.fontSize = "20px"
        timeButton.style.fontWeight = "700"
        timeButton.textContent = time

        // When the button is clicked, save the date and time for that showing for future use
        timeButton.addEventListener("click", function () {
          window.location.href = "seatSelection.html"
          window.localStorage.setItem('dateSelected', date)
          window.localStorage.setItem('timeSelected', time)
          console.log("Saved selected date to local storage: " + date)
          console.log("Saved selected time to local storage: " + time)
        })

        timeContainer.appendChild(timeButton)
        
      })

      anchor.appendChild(timeContainer)

    })

    // Append the anchor element to the div
    document.getElementById('displayShowtimes').appendChild(anchor);
    console.log(anchor)
  }
}

function createStars(num) {
  /*
  &#9734 - unfilled star
  &#9733 - filled star
  */
  var finalString = ''
  var anchor = document.createElement('div')
  for(let i = 0; i < num; i++) {
    finalString += '&#9733'
  }
  for(let j = 0; j < 5-num; j++) {
    finalString += '&#9734'
  }
  return finalString
}

async function blankReceipt() {
  try {
    var anchor = document.createElement('div')
    anchor.className = 'receipt'
    anchor.id = 'receiptAnchor'

    var invoiceContainerInfo = document.createElement('div')
    invoiceContainerInfo.id = 'invoiceContainerInfo'
    invoiceContainerInfo.className = 'invoice-container'
    invoiceContainerInfo.style = 'margin-left: 0%;'

    var logo = document.createElement('div')
    logo.className = 'logo inline'
    var logoImg = document.createElement('img')
    logoImg.src = 'images/Logo.jpg'
    logoImg.alt = 'CineMark Logo'
    logoImg.style = 'width: 50px;'

    var rand = Math.floor(Math.random() * 100000)
    var orderNum = document.createElement('div')
    orderNum.id = 'ordernum'
    orderNum.className = 'inline noBot itemLabel'
    orderNum.textContent = 'Order: #5381' + rand

    var line = document.createElement('hr')
    line.style = 'border-width: 2px; margin-top: 0px; margin-bottom: 2px;'

    logo.appendChild(logoImg)
    invoiceContainerInfo.appendChild(logo)
    invoiceContainerInfo.appendChild(orderNum)
    invoiceContainerInfo.appendChild(line)

    anchor.appendChild(invoiceContainerInfo)

    // ---- ITEM TITLE ----
    var itemTitle = document.createElement('div')
    itemTitle.id = 'items'
    itemTitle.className = 'itemLabel center'
    itemTitle.textContent = 'Items'

    anchor.appendChild(itemTitle)

    // ---- TOTAL PRICE INFORMATION ----
    var subTotal = document.createElement('h3')
    subTotal.className = 'noBot noTop item'
    subTotal.style = 'position: absolute; bottom: 19%; right: 5%'
    subTotal.textContent = 'Subtotal'

    var subTotalPrice = document.createElement('h3')
    subTotalPrice.className = 'noBot noTop price'
    subTotalPrice.style = 'position: absolute; bottom: 16%; right: 5%'
    subTotalPrice.id = 'subtotalprice'

    var tax = document.createElement('h3')
    tax.className = 'noBot noTop item'
    tax.style = 'position: absolute; bottom: 13%; right: 5%'
    tax.textContent = 'Tax'

    var taxPrice = document.createElement('h3')
    taxPrice.className = 'noBot noTop price'
    taxPrice.style = 'position: absolute; bottom: 10%; right: 5%'
    taxPrice.id = 'taxprice'

    var total= document.createElement('h3')
    total.className = 'noBot noTop item'
    total.style = 'position: absolute; bottom: 5%; right: 5%'
    total.textContent = 'Total'

    var totalPrice = document.createElement('h3')
    totalPrice.className = 'noBot noTop price'
    totalPrice.style = 'position: absolute; bottom: 2%; right: 5%'
    totalPrice.id = 'totalprice'

    // ---- SYNTHESIZE TOTAL PRICE INFO ----
    anchor.appendChild(subTotal)
    anchor.appendChild(subTotalPrice)
    anchor.appendChild(tax)
    anchor.appendChild(taxPrice)
    anchor.appendChild(total)
    anchor.appendChild(totalPrice)

    console.log('Sending receipt data to local storage')
    var receiptContent = anchor.innerHTML
    window.localStorage.setItem('receipt', receiptContent)
    
  } catch (error) {
    console.error("Error displaying receipt: ", error);
  }
}

acquireOne()
displayShowtimes()
blankReceipt()





