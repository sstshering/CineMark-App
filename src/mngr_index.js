
import app from "./config"
import {getFirestore, collection, addDoc, getDoc, setDoc, doc, updateDoc, deleteDoc, getDocs} from "firebase/firestore";
import{getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

// gets the database from Firestore project
const db = getFirestore(app)
const storage = getStorage(app)
// the movie collection
// if something doesn't exist in the db this creates it
// creates the reference variable to the collection 
const movieCol = collection(db, "movies")
const showtimeHash = {};

async function displayAllButtons() {
  addMovieButton()
  updateMovieButton()
  deleteMovieButton()
  addManagerButton()
  viewMovieButton()
  addPromoButton()
  revenueButton()
}



async function addMovieButton() {
  if(document.getElementById("addMovieButton")) {
    document.getElementById("addMovieButton").addEventListener("click", function(event) {
      event.preventDefault();
      // Perform actions for setting a movie
      console.log("Set movie button clicked");
      window.location.href = "addMovie.html"
  });
}
//The set movie function, used to add movies to firestore
const addMovieForm = document.getElementById("setMovie");
      // can pass in an id and something about merging, look at documentation google firebase. console -> docs
    if (addMovieForm != null)
      addMovieForm.addEventListener("submit", (event)=> {
        event.preventDefault()

        const file = document.querySelector('#movieImage').files[0]
        const fileName = `${new Date().getTime()}-${file.name}`
        const storageRef = ref(storage, `movies/${fileName}`)
        const selectedGenre = document.getElementById("movieGenre").value;
        
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_change',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log('Upload is ' + progress + '% done')
          },
          (error) => {
            console.error("Upload failed:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
              const movie = {
                name: addMovieForm.movieName.value,
                description: addMovieForm.movieDescription.value,
                //numberofSeats: addMovieForm.numberOfSeats.value,
                runtime: addMovieForm.movieRuntime.value,
                rating: addMovieForm.movieRating.value,
                //showTime: addMovieForm.movieShowTime.value,
                review: addMovieForm.movieReview.value,
                id: addMovieForm.id.value,
                movieImage: downloadURL,
                genre: addMovieForm.movieGenre.value,
                ticketPrice: addMovieForm.ticketPrice.value
                
              };

              const movieDocRef = doc(db, "movies", movie.id);

              setDoc(movieDocRef, movie)
                .then(() => {
                  console.log("Movie added successfully!");
                  window.location.reload();
                })
                .catch((error) => {
                  console.error("Error adding movie: ", error);
                });
            }).catch((error) => {
              console.error("Error getting download URL: ", error);
            });
              
            })
          }
      )
};


//Updates the movie showtimes
async function updateMovieButton() {
  document.getElementById("updateMovieButton").addEventListener("click", function(event) {
    event.preventDefault();
    // Perform actions for setting a movie
    console.log("Update movie button clicked");
    window.location.href = "updateMovie.html"

    // reference to the html doc for updating movie
    const updateForm= document.querySelector("#updateMovie")
    if (updateForm != null)
      updateForm.addEventListener("submit", (event) => {
        event.preventDefault()
        // in the movies collection, update the value for the form
        const myDoc = doc(db, "movies",updateForm.id.value)
        // we can only update showtime right now
        updateDoc(myDoc, {
          showTime: updateForm.movieShowTime.value
        })
        .then(() => {
          console.log("Doc updated")
        })
        .catch((e) => {
          console.log(e)
        })
      })
    if (updateForm != null)
      updateForm.addEventListener("submit", (event) => {
        event.preventDefault()
        // in the movies collection, update the value for the form
        const myDoc = doc(db, "movies",updateForm.id.value)
        // we can only update showtime right now
        updateDoc(myDoc, {
          showTime: updateForm.movieShowTime.value
        })
        .then(() => {
          console.log("Doc updated")
        })
        .catch((e) => {
          console.log(e)
        })
      })
  });
}

// Delete movie. Uses the id of the movie
// the # sign means "reference" to the delete movie html
async function deleteMovieButton() {
  const deleteMovieForm= document.querySelector("#deleteMovie")
  if (deleteMovieForm != null)
    deleteMovieForm.addEventListener("submit", (event) => {
      event.preventDefault()
      // will delete the movie from the movies collection with this id
      const movieID = deleteMovieForm.id.value
      const movieRef = doc(movieCol, movieID)

      deleteDoc(movieRef)
      // "asynchronous" is a promise
      .then(() => {
        console.log("Document deleted.")
        window.location.reload();
      })
      .catch((e) => {
        console.log(e)
      })
    });
}

//Add a new manager. Must be logged in as manager to see this option. 
async function addManagerButton() {
  document.getElementById("addManagerButton").addEventListener("click", function(event) {
      event.preventDefault();
      // Perform actions for setting a movie
      console.log("Add manager button clicked");
      window.location.href = "createManager.html"

      // the form to create a manager 
      const createAccountForm = document.querySelector("#createManagerAccount");
      if (createAccountForm != null)
          createAccountForm.addEventListener("submit",(event)=>{
              event.preventDefault()
              // user info
              const name = createAccountForm.name.value
              const email = createAccountForm.email.value
              const pass = createAccountForm.password.value
              //console.log(name)

              // this will sign the created user in after creating the account
              createUserWithEmailAndPassword(auth, email, pass) 
              .then((userCredential)=>{
                  // holds the credentials from auth
                  const user = userCredential.user
                  // can use the uid to verify user access
                  const uid = user.uid;
                  console.log(user)
                  console.log(user.uid)
                  
              })
              
              .catch((e)=>{
                  //Error from persistence caught
                  console.log(e)
              })
          })
  });

    const setManagerForm = document.querySelector("#assignManager")
    setManagerForm.addEventListener("submit", (event)=>{
        event.preventDefault()

        const newManager = {
            firstName: setManagerForm.firstName.value,
            lastName: setManagerForm.lastName.value,
            email: setManagerForm.email.value,
            role: setManagerForm.role.value,
            doh: setManagerForm.doh.value,
            uid:uid 
            //id: setManagerForm.id.value
        }
        // I don't know if we need this part here since they're making the profile
        /*
        updateProfile(auth.currentUser,{
            displayName: assignManagerForm.firstName.value
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
        */
        const userDocRef = doc(db, "users", uid)
        setDoc(userDocRef, newManager)
        .then(()=>{
            console.log("New Manager Added")
            
        })
        .catch((e)=>{
            console.log(e) 
        })
    });
}


async function viewMovieButton() {
  document.getElementById("viewMovieButton").addEventListener("click", function(event) {
    event.preventDefault();
    // Perform actions for setting a movie
    console.log("View movie button clicked");
    window.location.href = "viewMovies.html"
  });
}

//Redirects to the page where promos are written
async function addPromoButton() {
  document.getElementById("promoButton").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "promos.html" 
  });
}

async function revenueButton() {
  document.getElementById("revenueButton").addEventListener("click", function(event) {
    event.preventDefault();
    console.log("View Revenue button clicked");
    window.location.href = "revenue.html";
  });
}

displayAllButtons()


//dropdown with movies
async function populateMoviesDropdown() {
  const querySnapshot = await getDocs(movieCol);
  const movieDropdown = document.getElementById("movie");
  movieDropdown.innerHTML = ""; //clear prev 
  console.log("i'm getting info on movies")
  querySnapshot.forEach((doc) => {
      const movieData = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = movieData.name;
      movieDropdown.appendChild(option);
  });
}
//populate movies dropdown
populateMoviesDropdown();

//dropdown with dates for the selected movie
async function populateDatesDropdown(movieId) {
  const movieDocRef = doc(db, "movies", movieId);
  const showtimesCollectionRef = collection(movieDocRef, "showtimes");
  const querySnapshot = await getDocs(showtimesCollectionRef);
  const dateDropdown = document.getElementById("date");
  dateDropdown.innerHTML = ""; //clear prev
  console.log("i'm getting info on dates")
  querySnapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = doc.id; //doc id is date
      dateDropdown.appendChild(option);
  });
}


async function populateTimesDropdown(movieId, dateId) {
  // Retrieve showtimes for the specified movie and date
  const showtimesRetrieved = await retrieveShowtimes(movieId, dateId);
  // Get reference to the dropdown element
  const timeDropdown = document.getElementById("time");
  // Clear existing options
  timeDropdown.innerHTML = "";
  // Check if showtimes were successfully retrieved
  if (showtimesRetrieved) {
    // Check if showtimes for the specified date exist in showtimeHash
    if (showtimeHash[dateId]) {
      // Retrieve the keys (time slots) from the inner object for the specified date
      const timeSlots = Object.keys(showtimeHash[dateId]);

      // Iterate over the time slots and add them as options to the dropdown
      timeSlots.forEach((timeSlot) => {
        const option = document.createElement("option");
        option.value = timeSlot;
        option.textContent = timeSlot; // Assuming timeSlot is the text content
        timeDropdown.appendChild(option);
      });
    } else {
      // No showtimes found for the specified date
      console.error("No showtimes found for the specified date.");
    }
  } else {
    // Show error message or handle failure case
    console.error("Failed to retrieve showtimes.");
  }
}


//update the showtime
const updateShowtimeForm = document.getElementById("updateShowtime");
updateShowtimeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const movieId = updateShowtimeForm.movie.value;
  const dateId = updateShowtimeForm.date.value;
  const time = updateShowtimeForm.time.value;
  const updatedTime = updateShowtimeForm.updatedTime.value;
  const movieDocRef = doc(db, "movies", movieId);
  console.log("Movie ID:", movieId);
  console.log("Date ID:", dateId);
  console.log("Time: ", time);

// Construct collection reference
  console.log(showtimeHash);
  try {
    // Construct document reference for the specific showtime
    const showtimeRef = doc(db, "movies", movieId, "showtimes", dateId);
    const showtimeDoc = await getDoc(showtimeRef);

    if (showtimeDoc.exists()) {
      // Update the time slot in the showtime document
      const showtimeData = showtimeDoc.data();
      if (showtimeData.times && showtimeData.times[time]) {
        // Update the value of the old key with the new value
        showtimeData.times[updatedTime] = showtimeData.times[time];
        delete showtimeData.times[time];
        // Update the showtime document with the modified times object
        await setDoc(showtimeRef, { times: showtimeData.times });
        console.log("Showtime updated successfully!");
      } else {
        console.log("Time slot not found!");
      }
    } else {
      console.log("Showtime document not found!");
    }
  } catch (error) {
    console.error("Error updating showtime: ", error);
  }
});

async function retrieveShowtimes(movieId, dateId) {

  try {
    const showtimeSnapshot = await getDocs(collection(db, "movies/" + movieId + "/showtimes"))

    showtimeSnapshot.forEach((doc) => {
      showtimeHash[doc.id] = doc.data()["times"]
    })
    return true;
    console.log('Retrieved showtimes: ', showtimeHash)

  } catch (error) {
    console.log("Error retrieving showtimes ", error)
    return false;
  }
}



//event listener for movie dropdown change
document.getElementById("movie").addEventListener("change", async (event) => {
  const selectedMovieId = event.target.value;
  if (selectedMovieId) {
      await populateDatesDropdown(selectedMovieId);
  }
});


//event listener for date dropdown change
document.getElementById("date").addEventListener("change", async (event) => {
  console.log("Date dropdown changed"); // Add this line for testing
  const selectedMovieId = document.getElementById("movie").value;
  const selectedDateId = event.target.value;
  console.log(selectedDateId);
  if (selectedDateId) {
      console.log("i selected a date");
      await populateTimesDropdown(selectedMovieId, selectedDateId);
  }
});



