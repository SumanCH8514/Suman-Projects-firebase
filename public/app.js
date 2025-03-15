// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaC-YdfZWTqfJTjQSBOS6-svD8b5Xb1Ig",
  authDomain: "suman-projects.firebaseapp.com",
  databaseURL: "https://suman-projects-default-rtdb.firebaseio.com",
  projectId: "suman-projects",
  storageBucket: "suman-projects.firebasestorage.app",
  messagingSenderId: "977877873183",
  appId: "1:977877873183:web:dbd8ad8189d816ec2edb2a",
  measurementId: "G-28BD21XBEL",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const dataForm = document.getElementById("dataForm");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const dataTableBody = document.querySelector("#dataTable tbody");

let editId = null;

// Load Data
const loadData = () => {
  db.collection("users")
    .get()
    .then((querySnapshot) => {
      dataTableBody.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `
          <tr>
            <td>${data.name}</td>
            <td>${data.age}</td>
            <td class="actions">
              <button onclick="editData('${doc.id}')">Edit</button>
              <button class="delete" onclick="deleteData('${doc.id}')">Delete</button>
            </td>
          </tr>
        `;
        dataTableBody.innerHTML += row;
      });
    });
};

// Add or Update Data
dataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const age = ageInput.value;

  if (editId) {
    // Update Data
    db.collection("users")
      .doc(editId)
      .update({ name, age })
      .then(() => {
        loadData();
        editId = null;
        dataForm.reset();
      });
  } else {
    // Add Data
    db.collection("users")
      .add({ name, age })
      .then(() => {
        loadData();
        dataForm.reset();
      });
  }
});

// Edit Data
const editData = (id) => {
  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      const data = doc.data();
      nameInput.value = data.name;
      ageInput.value = data.age;
      editId = id;
    });
};

// Delete Data
const deleteData = (id) => {
  if (confirm("Are you sure you want to delete this record?")) {
    db.collection("users")
      .doc(id)
      .delete()
      .then(() => {
        loadData();
      });
  }
};

// Load Data on Page Load
window.onload = loadData;
