const products = [

  {
    id:"classic",
    name:"Classic Neon Burger",
    price:120,
    cat:"main",
    icon:"🍔",
    desc:"Beef patty, cheese, lettuce, tomato and house sauce.",
    c1:"#52182f",
    c2:"#19152a"
  },

  {
    id:"hotdog",
    name:"Retro Hot Dog",
    price:70,
    cat:"main",
    icon:"🌭",
    desc:"Grilled sausage, crispy onions, mustard and ketchup.",
    c1:"#643016",
    c2:"#1e1613"
  },

  {
    id:"fries",
    name:"Arcade Fries",
    price:25,
    cat:"side",
    icon:"🍟",
    desc:"Crispy salted fries with optional neon sauce.",
    c1:"#58480f",
    c2:"#1b1911"
  },

  {
    id:"coca",
    name:"Coca-Cola",
    price:30,
    cat:"drink",
    icon:"🥤",
    desc:"Cold classic soda.",
    c1:"#501414",
    c2:"#171116"
  },

  {
    id:"water",
    name:"Bottled Water",
    price:20,
    cat:"drink",
    icon:"💧",
    desc:"Chilled natural water.",
    c1:"#0e3f50",
    c2:"#101a22"
  },

  {
    id:"malt",
    name:"Malt Drink 0.0",
    price:37,
    cat:"drink",
    icon:"🍺",
    desc:"Non-alcoholic malt-style drink.",
    c1:"#56420f",
    c2:"#1d1911"
  },

  {
    id:"cake",
    name:"Chocolate Cake",
    price:45,
    cat:"dessert",
    icon:"🍰",
    desc:"Chocolate cake with neon sugar sprinkles.",
    c1:"#46231a",
    c2:"#23131c"
  },

  {
    id:"icecream",
    name:"Vanilla Ice Cream",
    price:25,
    cat:"dessert",
    icon:"🍨",
    desc:"Creamy vanilla ice cream with chocolate drizzle.",
    c1:"#57482a",
    c2:"#1d1916"
  },

  {
    id:"flan",
    name:"Classic Flan",
    price:33,
    cat:"dessert",
    icon:"🍮",
    desc:"House caramel flan.",
    c1:"#62400f",
    c2:"#20170f"
  },

  {
    id:"double",
    name:"Double Pixel Burger",
    price:165,
    cat:"main",
    icon:"🍔",
    desc:"Double beef, double cheese and smoky sauce.",
    c1:"#431536",
    c2:"#181626"
  },

  {
    id:"chicken",
    name:"Cyber Chicken Burger",
    price:135,
    cat:"main",
    icon:"🍗",
    desc:"Crispy chicken, slaw and spicy mayo.",
    c1:"#594112",
    c2:"#211912"
  },

  {
    id:"rings",
    name:"Neon Onion Rings",
    price:55,
    cat:"side",
    icon:"🧅",
    desc:"Crunchy onion rings with ranch dip.",
    c1:"#573a12",
    c2:"#1f1712"
  },

  {
    id:"shake",
    name:"Pink Galaxy Shake",
    price:65,
    cat:"drink",
    icon:"🥤",
    desc:"Strawberry milkshake with whipped cream.",
    c1:"#5f183f",
    c2:"#211522"
  },

  {
    id:"lemonade",
    name:"Electric Lemonade",
    price:45,
    cat:"drink",
    icon:"🍋",
    desc:"Fresh lemonade with mint.",
    c1:"#4c5010",
    c2:"#172014"
  },

  {
    id:"brownie",
    name:"Midnight Brownie",
    price:50,
    cat:"dessert",
    icon:"🍫",
    desc:"Warm brownie with vanilla topping.",
    c1:"#3f241a",
    c2:"#151217"
  }

];


const qty =
  Object.fromEntries(

    products.map(
      product => [
        product.id,
        0
      ]
    )

  );


const menuGrid =
  document.getElementById(
    "menuGrid"
  );


const cart =
  document.getElementById(
    "cart"
  );


const overlay =
  document.getElementById(
    "overlay"
  );


const modal =
  document.getElementById(
    "modal"
  );



function money(value){

  return "$" +
    Number(value)
      .toLocaleString(
        "en-US"
      );

}



function categoryName(category){

  return {

    main:
      "Burger / Main",

    side:
      "Side",

    drink:
      "Drink",

    dessert:
      "Dessert"

  }[category];

}



function renderMenu(
  filter = "all"
){

  const visible =

    filter === "all"

    ? products

    : products.filter(
        product =>
          product.cat === filter
      );


  menuGrid.innerHTML =

    visible.map(
      product => `


      <article class="menu-card">


        <div
          class="food-art"
          style="
            --c1:${product.c1};
            --c2:${product.c2}
          "
        >

          <div class="food-icon">

            ${product.icon}

          </div>

        </div>


        <div class="menu-body">


          <div class="menu-title-row">

            <h3>
              ${product.name}
            </h3>

            <span class="price">

              ${money(
                product.price
              )}

            </span>

          </div>


          <p>
            ${product.desc}
          </p>


          <div class="menu-footer">

            <span class="category">

              ${categoryName(
                product.cat
              )}

            </span>


            <div class="qty">


              <button
                type="button"
                onclick="
                  changeQty(
                    '${product.id}',
                    -1
                  )
                "
              >
                −
              </button>


              <input
                id="qty-${product.id}"
                value="${qty[product.id]}"
                readonly
              >


              <button
                type="button"
                onclick="
                  changeQty(
                    '${product.id}',
                    1
                  )
                "
              >
                +
              </button>


            </div>


          </div>


        </div>


      </article>


    `

    ).join("");

}



window.changeQty =
function(
  id,
  delta
){

  qty[id] =
    Math.max(
      0,
      qty[id] + delta
    );


  const input =
    document.getElementById(
      `qty-${id}`
    );


  if(input){

    input.value =
      qty[id];

  }


  renderCart();

};



function renderCart(){

  const selected =

    products.filter(

      product =>
        qty[product.id] > 0

    );


  const count =

    selected.reduce(

      (
        sum,
        product
      ) =>

        sum +
        qty[product.id],

      0

    );


  const subtotal =

    selected.reduce(

      (
        sum,
        product
      ) =>

        sum +
        product.price *
        qty[product.id],

      0

    );


  const service =

    Math.round(
      subtotal * 0.05
    );


  const total =

    subtotal +
    service;


  document
    .getElementById(
      "cartCount"
    )
    .textContent =
      count;


  document
    .getElementById(
      "subtotal"
    )
    .textContent =
      money(subtotal);


  document
    .getElementById(
      "service"
    )
    .textContent =
      money(service);


  document
    .getElementById(
      "total"
    )
    .textContent =
      money(total);



  document
    .getElementById(
      "cartItems"
    )
    .innerHTML =


    selected.length

    ?

    selected.map(

      product => `


      <div class="cart-item">

        <div>

          <b>
            ${product.name}
          </b>

          <small>

            ${qty[product.id]}

            ×

            ${money(
              product.price
            )}

          </small>

        </div>


        <b>

          ${money(

            qty[product.id] *
            product.price

          )}

        </b>

      </div>


      `

    ).join("")


    :


    `

    <div class="empty-cart">

      Your order is empty.

      <br>

      Add products from the menu.

    </div>

    `;

}



function openCart(){

  cart
    .classList
    .add("open");


  overlay
    .classList
    .add("show");


  cart
    .setAttribute(
      "aria-hidden",
      "false"
    );

}



function closeCart(){

  cart
    .classList
    .remove("open");


  cart
    .setAttribute(
      "aria-hidden",
      "true"
    );


  if(
    !modal
      .classList
      .contains("show")
  ){

    overlay
      .classList
      .remove("show");

  }

}



function openModal(){

  closeCart();


  overlay
    .classList
    .add("show");


  modal
    .classList
    .add("show");

}



function closeModal(){

  modal
    .classList
    .remove("show");


  overlay
    .classList
    .remove("show");

}



document
  .getElementById(
    "openCart"
  )
  .addEventListener(
    "click",
    openCart
  );



document
  .getElementById(
    "closeCart"
  )
  .addEventListener(
    "click",
    closeCart
  );



document
  .getElementById(
    "closeModal"
  )
  .addEventListener(
    "click",
    closeModal
  );



document
  .getElementById(
    "clearCart"
  )
  .addEventListener(

    "click",

    () => {

      products
        .forEach(

          product =>

            qty[product.id] = 0

        );


      const active =

        document
          .querySelector(
            ".filter.active"
          );


      renderMenu(

        active

        ? active.dataset.filter

        : "all"

      );


      renderCart();

    }

  );



document
  .getElementById(
    "confirmOrder"
  )
  .addEventListener(

    "click",

    () => {


      const hasItems =

        products.some(

          product =>
            qty[product.id] > 0

        );


      if(!hasItems){

        alert(
          "Add at least one product first."
        );

        return;

      }


      openModal();

    }

  );



overlay
  .addEventListener(

    "click",

    () => {

      closeCart();

      closeModal();

    }

  );



document
  .querySelectorAll(
    ".filter"
  )
  .forEach(

    button => {

      button
        .addEventListener(

          "click",

          () => {


            document
              .querySelectorAll(
                ".filter"
              )
              .forEach(

                item =>

                  item
                    .classList
                    .remove(
                      "active"
                    )

              );


            button
              .classList
              .add(
                "active"
              );


            renderMenu(
              button.dataset.filter
            );

          }

        );

    }

  );



renderMenu();

renderCart();
