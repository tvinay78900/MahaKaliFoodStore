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

/* ================= FOOD DATA ================= */

const foods = [

  {
    id:1,
    name:"Burger",
    price:100,
    image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop"
  },

  {
    id:2,
    name:"Pizza",
    price:150,
    image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
  },

  {
    id:3,
    name:"Cold Drink",
    price:60,
    image:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1974&auto=format&fit=crop"
  },

  {
    id:4,
    name:"French Fries",
    price:80,
    image:"https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1974&auto=format&fit=crop"
  },

  {
    id:5,
    name:"Pasta",
    price:120,
    image:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1974&auto=format&fit=crop"
  },

  {
    id:6,
    name:"Sandwich",
    price:90,
    image:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1974&auto=format&fit=crop"
  }

];

/* ================= VARIABLES ================= */

let cart = [];

const menuContainer =
  document.getElementById("menuContainer");

const cartItems =
  document.getElementById("cartItems");

const totalPrice =
  document.getElementById("totalPrice");

const totalItems =
  document.getElementById("totalItems");

const searchInput =
  document.getElementById("searchInput");

/* ================= DISPLAY FOODS ================= */

function displayFoods(items){

  menuContainer.innerHTML = "";

  items.forEach(food => {

    menuContainer.innerHTML += `
    
      <div class="food-card">

        <img src="${food.image}">

        <div class="food-info">

          <h3>${food.name}</h3>

          <p>Fresh & Delicious Food</p>

          <div class="food-bottom">

            <span class="price">
              ₹${food.price}
            </span>

            <button onclick="addToCart(${food.id})">
              Add
            </button>

          </div>

        </div>

      </div>
    
    `;

  });

}

displayFoods(foods);

/* ================= ADD TO CART ================= */

function addToCart(id){

  const item =
    foods.find(food => food.id === id);

  const existing =
    cart.find(food => food.id === id);

  if(existing){

    existing.quantity++;

  }else{

    cart.push({

      ...item,

      quantity:1

    });

  }

  updateCart();

  /* ================= POPUP ================= */

  // showPopup(

  //   "Added To Cart 🛒",

  //   `${item.name} added successfully`

  // );

  /* ================= AUTO SCROLL ================= */

  document.getElementById("cart").scrollIntoView({

    behavior:"smooth"

  });

}

/* ================= UPDATE CART ================= */

function updateCart(){

  if(cart.length === 0){

    cartItems.innerHTML = `
    
      <div class="empty-cart">

        <i class="fa-solid fa-cart-shopping"></i>

        <h3>Your Cart is Empty</h3>

        <p>
          Add items from menu to place an order
        </p>

      </div>
    
    `;

    totalPrice.innerText = 0;

    totalItems.innerText = 0;

    return;

  }

  cartItems.innerHTML = "";

  let total = 0;

  let items = 0;

  cart.forEach(item => {

    total += item.price * item.quantity;

    items += item.quantity;

    cartItems.innerHTML += `
    
      <div class="cart-item">

        <div class="cart-left">

          <img src="${item.image}">

          <div>

            <h3>${item.name}</h3>

            <p>₹${item.price}</p>

          </div>

        </div>

        <div class="quantity">

          <button onclick="decreaseQuantity(${item.id})">
            -
          </button>

          <span>${item.quantity}</span>

          <button onclick="increaseQuantity(${item.id})">
            +
          </button>

        </div>

      </div>
    
    `;

  });

  totalPrice.innerText = total;

  totalItems.innerText = items;

}

/* ================= INCREASE ================= */

function increaseQuantity(id){

  const item =
    cart.find(food => food.id === id);

  item.quantity++;

  updateCart();

}

/* ================= DECREASE ================= */

function decreaseQuantity(id){

  const item =
    cart.find(food => food.id === id);

  item.quantity--;

  if(item.quantity <= 0){

    cart = cart.filter(food =>
      food.id !== id
    );

  }

  updateCart();

}

/* ================= PLACE ORDER ================= */

async function placeOrder(){

  const name =
    document.getElementById("name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const address =
    document.getElementById("address").value.trim();

  /* ================= EMPTY FIELD CHECK ================= */

  if(
    name === "" ||
    phone === "" ||
    address === ""
  ){

    showPopup(

      "Missing Fields",

      "Please fill all delivery details"

    );

    return;

  }

  /* ================= PHONE VALIDATION ================= */

  if(phone.length < 10){

    showPopup(

      "Invalid Phone",

      "Please enter valid phone number"

    );

    return;

  }

  /* ================= EMPTY CART CHECK ================= */

  if(cart.length === 0){

    showPopup(

      "Empty Cart",

      "Please add items to cart first"

    );

    return;

  }

  const total =
    cart.reduce((sum, item) =>

      sum + item.price * item.quantity

    , 0);

  const items =
    cart.map(item =>

      `${item.name} x${item.quantity}`

    ).join(", ");

  /* ================= CONFIRM ORDER ================= */

  showPopup(

    "Confirm Order",

    "Are you sure you want to place this order?",

    async () => {

      try{

        document.getElementById("loadingOverlay").style.display = "flex";

        const response = await fetch(

          "https://mahakali-food-store.onrender.com/api/place-order",

          {

            method:"POST",

            headers:{
              "Content-Type":"application/json"
            },

            body:JSON.stringify({

              customer_name:name,

              phone:phone,

              address:address,

              items:items,

              amount:total

            })

          }

        );

        const data =
          await response.json();

        document.getElementById("loadingOverlay").style.display = "none";

        /* ================= SUCCESS ================= */

        showPopup(

          "Order Placed 🎉",

          "Your order has been placed successfully"

        );

        /* ================= CLEAR CART ================= */

        cart = [];

        updateCart();

        /* ================= CLEAR FORM ================= */

        document.getElementById("name").value = "";

        document.getElementById("phone").value = "";

        document.getElementById("address").value = "";

      }catch(error){

        console.log(error);

        showPopup(

          "Server Error",

          "Unable to place order"

        );

      }

    }

  );

}

/* ================= SCROLL ================= */

function scrollToMenu(){

  document.getElementById("menu").scrollIntoView({

    behavior:"smooth"

  });

}

/* ================= SEARCH ================= */

searchInput.addEventListener("keyup", () => {

  const value =
    searchInput.value.toLowerCase();

  const filtered =
    foods.filter(food =>

      food.name
      .toLowerCase()
      .includes(value)

    );

  displayFoods(filtered);

});