import app from "./config";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

//fetch revenue data from Firestore
async function fetchRevenueData() {
    console.log("fetching rev data")
    const revenueData = {};
    const querySnapshot = await getDocs(collection(db, "movies"));
    querySnapshot.forEach(doc => {
        revenueData[doc.data().name] = [doc.data().ticketRevenue, doc.data().ticketPrice];
    });
    console.log(revenueData)
    return revenueData;
}

async function renderTable() {
    const revenueData = await fetchRevenueData();
    const tableBody = document.getElementById('revenueTable');

    Object.keys(revenueData).forEach((key) => {
        const row = `
            <tr>
                <td>${key}</td>
                <td>${revenueData[key][0]}</td>
                <td>${revenueData[key][1]}</td>
            </tr>`;
        console.log(row)
        tableBody.innerHTML += row;
    });
}

//call table
document.addEventListener('DOMContentLoaded', renderTable);