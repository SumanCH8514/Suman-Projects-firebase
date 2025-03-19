import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  // Replace with your Firebase configuration
  apiKey: "AIzaSyAaC-YdfZWTqfJTjQSBOS6-svD8b5Xb1Ig",
  authDomain: "suman-projects.firebaseapp.com",
  databaseURL: "https://suman-projects-default-rtdb.firebaseio.com",
  projectId: "suman-projects",
  storageBucket: "suman-projects.firebasestorage.app",
  messagingSenderId: "977877873183",
  appId: "1:977877873183:web:dbd8ad8189d816ec2edb2a",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "data");

const dataForm = document.getElementById("dataForm");
const dataTableBody = document.querySelector("#dataTable tbody");
let editItemId = null; // Track the ID of the item being edited

dataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (editItemId) {
    // Update existing item
    update(ref(database, `data/${editItemId}`), { name: name, age: age });
    editItemId = null; // Reset edit mode
    document.getElementById("submitBtn").textContent = "Add Data"; //reset button text
  } else {
    // Add new item
    push(dataRef, { name: name, age: age });
  }

  dataForm.reset();
});

onValue(dataRef, (snapshot) => {
  dataTableBody.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td>${value.name}</td>
                        <td>${value.age}</td>
                        <td>
                            <button class="edit" data-id="${key}" data-name="${value.name}" data-age="${value.age}">Edit</button>
                            <button class="delete" data-id="${key}">Delete</button>
                        </td>
                    `;
      dataTableBody.appendChild(row);
    });
  }
});

dataTableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const itemId = e.target.dataset.id;
    remove(ref(database, `data/${itemId}`));
  } else if (e.target.classList.contains("edit")) {
    const itemId = e.target.dataset.id;
    const name = e.target.dataset.name;
    const age = e.target.dataset.age;

    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("submitBtn").textContent = "Save Changes";
    editItemId = itemId;
  }
});
