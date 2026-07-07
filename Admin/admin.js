/* ================= VARIABLES ================= */

const loginPage =
  document.getElementById("loginPage");

const dashboard =
  document.getElementById("dashboard");

const ordersTable =
  document.getElementById("ordersTable");

let currentFilter = "all";

let orders = [];

/* ================= CUSTOM POPUP ================= */

function showPopup(

  title,
  message,
  callback = null

){

  const popupOverlay =
    document.getElementById("popupOverlay");

  const popupTitle =
    document.getElementById("popupTitle");

  const popupMessage =
    document.getElementById("popupMessage");

  const popupOk =
    document.getElementById("popupOk");

  const popupCancel =
    document.getElementById("popupCancel");

  popupTitle.innerText = title;

  popupMessage.innerText = message;

  popupOverlay.style.display = "flex";

  popupOk.onclick = () => {

    popupOverlay.style.display = "none";

    if(callback){

      callback();

    }

  };

  popupCancel.onclick = () => {

    popupOverlay.style.display = "none";

  };

}

/* ================= LOGIN ================= */

function loginAdmin(){

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value.trim();

  /* ================= EMPTY CHECK ================= */

  if(
    username === "" ||
    password === ""
  ){

    showPopup(

      "Missing Fields",

      "Please enter username and password"

    );

    return;

  }

  /* ================= LOGIN CHECK ================= */

  if(
    username === "admin" &&
    password === "admin123"
  ){

    showPopup(

      "Login Success 🎉",

      "Welcome Back Admin",

      () => {

        loginPage.style.display = "none";

        dashboard.style.display = "block";

        fetchOrders();

      }

    );

  }else{

    showPopup(

      "Login Failed",

      "Invalid Username or Password"

    );

  }

}

/* ================= LOGOUT ================= */

function logoutAdmin(){

  showPopup(

    "Logout",

    "Are you sure you want to logout?",

    () => {

      /* HIDE DASHBOARD */

      dashboard.style.display = "none";

      /* SHOW LOGIN */

      loginPage.style.display = "flex";

      /* CLEAR INPUTS */

      document.getElementById("username").value = "";

      document.getElementById("password").value = "";

      

    }

  );

}

/* ================= FETCH ORDERS ================= */

async function fetchOrders(){

  try{

    const response = await fetch(

      "https://mahakalifoodstore.onrender.com/api/orders"

    );

    orders = await response.json();

    loadOrders();

  }catch(error){

    console.log(error);

    showPopup(

      "Server Error",

      "Unable to fetch orders"

    );

  }

}

/* ================= AUTO REFRESH ================= */

setInterval(() => {

  fetchOrders();

}, 2000);

/* ================= LOAD ORDERS ================= */

function loadOrders(){

  ordersTable.innerHTML = "";

  let filteredOrders = orders;

  if(currentFilter !== "all"){

    filteredOrders =
      orders.filter(order =>

        order.status === currentFilter

      );

  }

  filteredOrders.forEach(order => {

    ordersTable.innerHTML += `
    
      <tr>

        <td>
          #${order.id}
        </td>

        <td>
          ${order.customer_name}
        </td>

        <td>
          ${order.items}
        </td>

        <td>
          ₹${order.amount}
        </td>

        <td>
          ${order.address}
        </td>

        <td>

          <span class="status ${order.status}">

            ${order.status}

          </span>

        </td>

        <td>
${(() => {
    const d = new Date(order.created_at);

    const weekday = d.toLocaleString("en-IN", {
        weekday: "short",
        timeZone: "Asia/Kolkata"
    });

    const date = d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata"
    });

    const time = d.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    });

    return `${weekday}, ${date} ${time}`;
})()}
</td>

        <td>

          <button

            class="action-btn ${
              order.status === "pending"
              ? "deliver-btn"
              : "undeliver-btn"
            }"

            onclick="toggleOrderStatus(${order.id})"

          >

            ${
              order.status === "pending"
              ? "Delivered"
              : "Undelivered"
            }

          </button>

          <button

            class="action-btn delete-btn"

            onclick="deleteOrder(${order.id})"

          >

            Delete

          </button>

        </td>

      </tr>
    
    `;

  });

  updateStats();

}

/* ================= UPDATE STATS ================= */

function updateStats(){

  document.getElementById("totalOrders").innerText =

    orders.length;

  document.getElementById("pendingOrders").innerText =

    orders.filter(order =>

      order.status === "pending"

    ).length;

  document.getElementById("deliveredOrders").innerText =

    orders.filter(order =>

      order.status === "delivered"

    ).length;

  let revenue = 0;

  orders.forEach(order => {

    revenue += order.amount;

  });

  document.getElementById("totalRevenue").innerText =

    revenue;

}

/* ================= FILTER ================= */

function showOrders(type){

  currentFilter = type;

  document
    .querySelectorAll(".order-tabs button")

    .forEach(btn => {

      btn.classList.remove("active");

    });

  event.target.classList.add("active");

  loadOrders();

}

/* ================= TOGGLE STATUS ================= */

async function toggleOrderStatus(id){

  const order =
    orders.find(order => order.id === id);

  let newStatus =

    order.status === "pending"

    ? "delivered"

    : "pending";

  showPopup(

    "Change Status",

    `Are you sure you want to mark this order as ${newStatus}?`,

    async () => {

      try{

        await fetch(

          `https://mahakalifoodstore.onrender.com/api/update-status/${id}`,

          {

            method:"PUT",

            headers:{
              "Content-Type":"application/json"
            },

            body:JSON.stringify({

              status:newStatus

            })

          }

        );

        fetchOrders();

      }catch(error){

        console.log(error);

      }

    }

  );

}
/* ================= DELETE ORDER ================= */

async function deleteOrder(id){

  showPopup(

    "Delete Order",

    "Are you sure you want to delete this order?",

    async () => {

      try{

        await fetch(

          `https://mahakalifoodstore.onrender.com/api/delete-order/${id}`,

          {
            method:"DELETE"
          }

        );

        fetchOrders();

      }catch(error){

        console.log(error);

      }

    }

  );

}

/* ================= CLEAR FILTER ================= */

function clearFilter(){

  document.getElementById("fromDate").value = "";

  document.getElementById("toDate").value = "";

  loadOrders();

  

}

/* ================= APPLY DATE FILTER ================= */

function applyDateFilter(){

  const fromDate =
    document.getElementById("fromDate").value;

  const toDate =
    document.getElementById("toDate").value;

  /* ================= EMPTY CHECK ================= */

  if(
    fromDate === "" ||
    toDate === ""
  ){

    showPopup(

      "Missing Dates",

      "Please select both dates"

    );

    return;

  }

  const filtered = orders.filter(order => {

    const orderDate =
      new Date(order.created_at);

    const from =
      new Date(fromDate);

    const to =
      new Date(toDate);

    return (
      orderDate >= from &&
      orderDate <= to
    );

  });

  ordersTable.innerHTML = "";

  filtered.forEach(order => {

    ordersTable.innerHTML += `
    
      <tr>

        <td>
          #${order.id}
        </td>

        <td>
          ${order.customer_name}
        </td>

        <td>
          ${order.items}
        </td>

        <td>
          ₹${order.amount}
        </td>

        <td>
          ${order.address}
        </td>

        <td>

          <span class="status ${order.status}">

            ${order.status}

          </span>

        </td>

        <td>
  ${new Date(order.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })}
</td>

        <td>

          <button

            class="action-btn ${
              order.status === "pending"
              ? "deliver-btn"
              : "undeliver-btn"
            }"

            onclick="toggleOrderStatus(${order.id})"

          >

            ${
              order.status === "pending"
              ? "Delivered"
              : "Undelivered"
            }

          </button>

          <button

            class="action-btn delete-btn"

            onclick="deleteOrder(${order.id})"

          >

            Delete

          </button>

        </td>

      </tr>
    
    `;

  });

  

}