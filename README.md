# CineWave - Movie Theater System

**Development Team - Team #1: Uno Chi:**

> Paulina Calderon, Raul Baez, Diana Valles, Natalia Mesta, Elizabeth Martin, Sonam Tshering

## Table of Contents

- [CineWave - Movie Theater System](#cinewave---movie-theater-system)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [User Guide](#user-guide)
    - [Main Features](#main-features)
      - [Main Page](#main-page)
      - [Sign-up / Sign-in](#sign-up--sign-in)
      - [Movie selection](#movie-selection)
      - [Seat selection](#seat-selection)
      - [About page](#about-page)
      - [Food \& drinks selection](#food--drinks-selection)
      - [Gift cards](#gift-cards)
      - [Receipt](#receipt)
      - [Checkout](#checkout)
      - [View Profile](#view-profile)
    - [Manager section](#manager-section)
      - [Set Movie section](#set-movie-section)
  - [Developer Guide](#developer-guide)
    - [How to install NVM](#how-to-install-nvm)
      - [Mac users](#mac-users)
      - [Windows users](#windows-users)
    - [How to install Webpack](#how-to-install-webpack)
    - [How to run backend](#how-to-run-backend)
    - [How to run frontend](#how-to-run-frontend)
    - [Technologies and Tools](#technologies-and-tools)

## Project Description

CineWave is a web platform that allows you to buy tickets based on the movie showtime and seat availability. Customers are also part of the membership program that can be used to redeem points to get free movie tickets. The system also allows customers to get concession items and faciliate the arrival to the movie theater.

## User Guide

### Main Features

#### Main Page

The main page contains various buttons and interactable elements such that a user may find what they need to:

1. Sign-In
2. Browse a movie list
3. Filter the movie list
4. Select a movie to view showtimes

Also displayed is a carousel that containes top movie picks (See Below)

<img width="600" alt="Screenshot 2024-05-06 at 9 42 17 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/77069312-c2da-4a33-b060-9a406e4a8349">

<img width="600" alt="Screenshot 2024-05-06 at 9 42 40 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/378e72f9-f579-44d1-b5b6-3e380454a3ee">

#### Sign-up / Sign-in

In order to access data, administrators and customers will need to sign-in. If it is the first time looking at the system then they will need to create an account. There will be browser persistence so that while the browser remains active the user's login info will persist.

<img width="600" alt="Screenshot 2024-04-29 at 6 48 52 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/3aad2ee3-0d6c-4094-8d12-a33c6b2e08ba">

<img width="600" alt="Screenshot 2024-04-29 at 6 49 03 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/9f10250e-4d44-492e-b22f-586f4a1ed599">

#### Movie selection

From the movie list, customers can click on the movie that they are interested in to display the movie's description. Next, the movie's details will pop up inlcuding:

1. Name
2. Rating
3. Rate Score
4. Desciption

Then there will be a button to inicate if the user wishes to purchase a ticket for this movie (See Below). Also available here are the showtimes and the dates/times for each, buttons redirect to the appropriate seat selection.

<img width="600" alt="Screenshot 2024-04-29 at 6 45 18 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/907ed24a-daf8-4fc6-95d5-9ae1529fb230">

#### Seat selection

After selecting a specific movie, users will be directed to a seat selection screen where they can choose their preferred seats within the theater. This interactive seat map provides a visual layout of the theater, ensuring users can select the best available seating for their experience.

<img width="600" alt="Screenshot 2024-04-29 at 6 54 39 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/9c62d432-e39c-47ec-bd76-53da8b5fb4b2">

#### About page

The about page provides general information about our movie theater. This information includes: what makes us unique, our history, our mission, membership programs, contact information, gallery, and FAQs.

<img width="600" alt="Screenshot 2024-04-01 at 11 01 53 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/4101b67d-a7d0-4969-889b-632fc695d1c5">

#### Food & drinks selection

The new food & drinks section allows users to order their favorite concessions online. After selecting their seats, users can choose from a variety of food, snacks and drinks to purchase. 

<img width="600" alt="Screenshot 2024-05-06 at 9 46 49 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/de7bc6dc-293e-4e19-a9cd-0a52f8999c10">

#### Membership Information

Users can view the member benefits by going through the following table and opt-in by creating an account and selecting the membership type or by changing their current membership through theur profile.

<img width="600" alt="Screenshot 2024-05-06 at 9 47 19 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/53ef860c-207a-4538-addb-9ba987157e2e">

#### Gift cards

The gift cards page provides functionalities to the user to buy a gift cards either for a friend, himself/herself, or check current card balance.

<img width="600" alt="Screenshot 2024-04-01 at 11 02 17 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/e43fdf4c-7c1c-4682-99ff-8da4d12cbe95">

<img width="600" alt="Screenshot 2024-04-14 at 4 38 54 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/915fae74-98a8-4ac5-befc-72a6ad0d36eb">

<img width="600" alt="Screenshot 2024-04-14 at 4 33 47 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/f654d71a-6fe9-417c-8818-cefd92845110">

<img width="600" alt="Screenshot 2024-04-14 at 4 34 02 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/09f3fe16-7998-4ba6-93eb-5dcaaff17f89">

<img width="600" alt="Screenshot 2024-04-14 at 4 34 13 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/2161da54-1f23-45e7-a80f-fe3e29c2cbe3">

<img width="600" alt="Screenshot 2024-04-14 at 4 34 24 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/8336002b-8baf-49ff-ba8e-04e5031be536">

<img width="600" alt="Screenshot 2024-04-29 at 6 59 13 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/143745995/10c1c2c0-e48a-4ca5-b2e5-afd0b3f19b77">

#### Receipt

Notice the receipt to the right of the seat selection, detailing information about the movie the user has selected. Also on the receipt will be information that is updated dynamically as the user selects seats and chooses their concession items. The 'checkout' button will redirect to the checkout page where the user is prompted to enter their card information.

<img width="600" alt="Receipt Screenshot" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/124196992/c887ff9b-4c60-4d97-a0fb-d6485f9bb29c">

#### Checkout

After a user selects their desired seats and concessions, the checkout will allow the user to pay. The form validates the entered fields (e.g 16-digit card, specific requested format, valid date, etc). If signed-in, the user has the option to use of of their saved payment methods and/or redeem rewards.

<img width="600" alt="Screenshot 2024-05-06 at 9 55 53 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/10d33eaf-95a3-4954-a232-4d172e9453e1">

#### View Profile

The user can click on the user account button displayed in the navigation bar and access their account profile where they can see their membership type, accumulated points, tickets and payment card information saved.

<img width="600" alt="Screenshot 2024-05-06 at 9 53 06 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/78bcbb8f-4129-4c5c-b4b2-e5f55dc5c282">
<img width="600" alt="Screenshot 2024-05-06 at 9 55 01 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/44fb9ad2-de66-4cb7-bd8c-1ccd3ad6933d">

### Manager section

The manager section includes a page where movies can be added, modified, or removed from the app. This action will add/modify/remove the movie to/from both the main page's display and the database. 

1. The manager will sign in to the app using their manager email and password.
2. Users have roles, managers are assigned the role of admin. The role is checked when user logs in.
3. Once the user is verified as a manager, the manager button will appear in the navigation bar of the page.
4. Clicking on the manager button takes the user to the manager page.

<img width="1511" alt="Screenshot 2024-04-02 at 1 20 20 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/57511049/50f5ffd5-4cdd-43b8-9b54-1272f25ed429">

#### Set Movie section

Once the manager is logged in and has navigated to the set movie page, they can begin to manage the movies by going to the manager page where they will find a series of buttons: Add a Movie, Update Movies, Add a Manager, View Movies, Promos, and View Revenue.

<img width="1438" alt="Screenshot 2024-05-06 at 11 00 12 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/73561937/0dded81f-9789-4ade-9bcd-52dfe7bfdf32">


To add a movie:

1. The manager must add the name of the movie, the genre, the description, the runtime, the rating, the review, the ticket price, an id for the movie. The id of the movie should be the name of the movie with underscores replacing spaces between words.
2. The manager will have to select the image that corresponds to a movie from the upload image button. The images are stored in firebase storage for retrieval.

<img width="847" alt="Screenshot 2024-05-06 at 11 00 42 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/73561937/abae62aa-1c63-4ebf-9eec-eda5f4382552">

To update a movie:

1. The manager must choose a movie from the dropdown.
2. Based on the movie, the manager must then choose a date.
3. Based on the date, the manager must then choose a time.
4. Then they can update the showtime by typing in the new showtime.
5. The manager can finish updating by clicking the update showtime button.
6. The showtime is updated in the hashmap located in the database.

<img width="802" alt="Screenshot 2024-05-06 at 10 57 27 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/73561937/fe3797b6-79a8-467a-b343-7194aef3c421">


To remove a movie:

1. The manager must use the id of the movie that they wish to remove.
2. The manager clicks remove, and the movie is removed from the display and database.

<img width="275" alt="Screenshot 2024-05-06 at 10 57 44 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/73561937/53885d26-721a-498e-bb3a-314104047213">

To add a manager:
1. The manager will create a sign in account for the new manager. The sign in account will use a company email and password.
2. The manager will create an employee profile for the new manager. 
3. The profile will include the role "admin".
4. The admin role will render the visibility of the manager button when signed in.


To view all the movies:
1. The manager can see a table with all of the current movies with their respective attributes.
2. They can also filter by ID.

To view the revenue:
1. The manager can see the current movies' revenue and ticket price.

<img width="924" alt="Screenshot 2024-05-06 at 11 05 03 PM" src="https://github.com/UTEP-Agile-SP24/team-repository-team-1/assets/73561937/63d2dc0c-808c-47bc-9c17-aeab1a067f3f">



## Developer Guide

### How to install NVM

#### Mac users

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

#### Windows users

Go to [NVM windows releases](https://github.com/coreybutler/nvm-windows/releases), then Download/Run: `nvm-setup.exe`.

1. Select Yes if a prompt says: “Node v##.##.## is already installed. Do you want NVM tocontrol this version?”.
2. Select OK to C:\Program Files\nodejs will be overwritten.
3. Select Finish.
4. Close all terminals/cmd prompts.

Run one of the following commands:

```shell
nvm install node
```

```shell
nvm install latest
```

Open terminal (Windows can use VS Code/PowerShell). Run the commands:

```shell
nvm -v
```

```shell
node -v
```

> **_NOTE:_**  If successful, both should provide a version number in the console.

### How to install Webpack

You may need to run the following commands to be able to run the project.

```shell
npm init -y
```

```shell
npm i webpack webpack-cli -D
```

> **_NOTE:_** The command `npm run build` should be already available. If not, then go to `package.json File => Scripts`. Add `“build”: “webpack –mode=development”`.

### How to run backend

1. Install Google Firebase Integration if you have not already by running the following command:

    ```shell
    npm install firebase
    ```

2. Install NVM/Node if you do not have it already. Then run the following command:

    ```shell
    npm run build
    ```

### How to run frontend

The development team is using the live server extension available in Visual Studio Code to render the HTML page.

### Technologies and Tools

- Programming languages: JavaScript
- Styling: HTML, CSS Bootsrap
- Database: Firestore Database
