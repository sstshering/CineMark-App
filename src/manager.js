
import app from "./config"
import { doc, getFirestore, collection, getDocs } from "firebase/firestore";

// gets the database from Firestore project
const db = getFirestore(app)

// Retrieves the movies from the DB
async function retrieveMovies() {
  // Access movie collection in Firestore
  const querySnapshot = await getDocs(collection(db, "movies"))
  var movies = []

  // Store the movie data in a list to be rendered in manager's table
  querySnapshot.forEach((doc) => {
    movies.push(doc.data())
  });

  return movies;
}

async function displayMoviesTable() {
  try {
    let movies = await retrieveMovies();
    var table = document.getElementById("movies-table");
    const body = document.createElement('tbody');

    movies.forEach(async (movie) => {
      const showtimesSnapshot = await getDocs(collection(db, "movies/" + movie.id + "/showtimes"));

      showtimesSnapshot.forEach((showtimeDoc) => {
        // Access each showtime document
        const data = showtimeDoc.data();
        const timesMap = data.times;

        console.log(timesMap)

        // Get an array of keys of timesMap
        const keys = Object.keys(timesMap);

        // Iterate over the keys
        keys.forEach((key) => {
          const row = document.createElement("tr")
          row.scope = "row"

          const id = document.createElement('td')
          id.textContent = movie.id

          const name = document.createElement('td')
          name.textContent = movie.name

          const rating = document.createElement('td')
          rating.textContent = movie.rating

          const genre = document.createElement('td')
          genre.textContent = movie.genre

          const runtime = document.createElement('td')
          runtime.textContent = movie.runtime

          const date = document.createElement('td')
          date.textContent = showtimeDoc.id

          const time = document.createElement('td')
          time.textContent = key

          const revenue = document.createElement('td')
          revenue.textContent = movie.ticketRevenue

          row.appendChild(id)
          row.appendChild(name)
          row.appendChild(rating)
          row.appendChild(genre)
          row.appendChild(runtime)
          row.appendChild(date)
          row.appendChild(time)
          row.appendChild(revenue)

          body.appendChild(row)

        });

        table.appendChild(body)
      })
    })
  } catch (error) {
    console.error("Error:", error);
  }
}

await displayMoviesTable()

// Filter movies by ID
function filterTableById() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("id-filter");
  filter = input.value.toUpperCase();
  table = document.getElementById("movies-table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, skip header
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0]; // ID is the first column
    if (td) {
      txtValue = td.textContent || td.innerText;
      // Check if the text content of the cell matches the filter
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""; // Show the row
      } else {
        tr[i].style.display = "none"; // Hide the row
      }
    }
  }
}

// Attach event listener to the input element for filtering
document.getElementById("id-filter").addEventListener("input", filterTableById);
