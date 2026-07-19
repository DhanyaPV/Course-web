const cart = document.querySelector(".navbar .cart");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCart = document.querySelector(".close-cart");

const burger = document.querySelector(".burger");
const menuSidebar = document.querySelector(".menu-sidebar");
const closeMenu = document.querySelector(".close-menu");

const productContainer = document.querySelector(".product");
const cartContent = document.querySelector(".cart-content");

const totalAmount = document.querySelector(".total-amount");
const cartNumber = document.querySelector(".noi");

const clearBtn = document.querySelector(".clear-cart-btn");
const checkoutBtn = document.querySelector(".checkout-btn");


let Cart = [];




// OPEN CART

cart.addEventListener("click",()=>{

    cartSidebar.style.transform="translateX(0%)";


    const overlay=document.createElement("div");

    overlay.classList.add("overlay");

    document.body.appendChild(overlay);



    overlay.addEventListener("click",()=>{

        closeCartFunction();

    });


});





// CLOSE CART

closeCart.addEventListener("click",()=>{

    closeCartFunction();

});



function closeCartFunction(){

    cartSidebar.style.transform="translateX(100%)";


    const overlay=document.querySelector(".overlay");


    if(overlay){

        overlay.remove();

    }

}







// MOBILE MENU


burger.addEventListener("click",()=>{

    menuSidebar.style.transform="translateX(0%)";

});



closeMenu.addEventListener("click",()=>{

    menuSidebar.style.transform="translateX(-100%)";

});



document.querySelectorAll(".menu-list-item a")
.forEach(link=>{

    link.addEventListener("click",()=>{

        menuSidebar.style.transform="translateX(-100%)";

    });

});










// PRODUCTS CLASS


class Products{


    async getProducts(){


        const response=await fetch("products.json");


        const data=await response.json();



        const products=data.items.map(item=>{


            return {

                id:item.sys.id,

                title:item.fields.title,

                price:item.fields.price,

                image:item.fields.image.fields.file.url

            };


        });


        return products;


    }


}









// STORAGE CLASS


class Storage{


    static saveProducts(products){


        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );


    }



    static getProducts(){


        return JSON.parse(
            localStorage.getItem("products")
        ) || [];


    }



    static saveCart(cart){


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


    }



    static getCart(){


        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    }



    static getProduct(id){


        let products=this.getProducts();


        return products.find(product=>product.id===id);


    }


}









// UI CLASS


class UI{


    displayProducts(products){


        let result="";


        products.forEach(product=>{


            result+=`


            <div class="product-card">


                <img src="${product.image}"
                alt="${product.title}">


                <h3>
                    ${product.title}
                </h3>


                <p>
                    $${product.price}
                </p>


                <button 
                class="add-to-cart"
                data-id="${product.id}">

                    Add To Cart

                </button>


            </div>


            `;


        });



        productContainer.innerHTML=result;



    }







    getButtons(){


        const buttons=document.querySelectorAll(".add-to-cart");



        buttons.forEach(button=>{


            button.addEventListener("click",(event)=>{


                const id=event.target.dataset.id;



                const product=Storage.getProduct(id);



                const cartItem={

                    ...product,

                    amount:1

                };




                Cart.push(cartItem);



                Storage.saveCart(Cart);



                this.addCartItem(cartItem);



                this.setCartValues(Cart);



                event.target.innerText="Added";


                event.target.disabled=true;



            });



        });



    }









    addCartItem(item){



        const div=document.createElement("div");


        div.classList.add("cart-product");



        div.innerHTML=`


            <img src="${item.image}" width="80">


            <h3>
                ${item.title}
            </h3>


            <p>
                $${item.price}
            </p>



            <button 
            class="remove-item"
            data-id="${item.id}">

                Remove

            </button>



        `;



        cartContent.appendChild(div);



    }








    setCartValues(cart){



        let total=0;

        let count=0;



        cart.forEach(item=>{


            total += item.price * item.amount;


            count += item.amount;



        });



        totalAmount.innerText=total;


        cartNumber.innerText=count;



    }





}









// REMOVE ITEM


cartContent.addEventListener("click",(event)=>{


    if(event.target.classList.contains("remove-item")){


        const id=event.target.dataset.id;



        Cart=Cart.filter(item=>item.id!==id);



        Storage.saveCart(Cart);



        event.target.parentElement.remove();



        ui.setCartValues(Cart);



    }



});









// CLEAR CART


clearBtn.addEventListener("click",()=>{


    Cart=[];


    Storage.saveCart(Cart);



    cartContent.innerHTML="";


    totalAmount.innerText="0";


    cartNumber.innerText="0";



});









// CHECKOUT


checkoutBtn.addEventListener("click",()=>{


    if(Cart.length===0){


        alert("Your cart is empty!");


    }

    else{


        alert("Order placed successfully!");



        Cart=[];



        Storage.saveCart(Cart);



        cartContent.innerHTML="";


        totalAmount.innerText="0";


        cartNumber.innerText="0";



    }


});









// START APPLICATION


const ui=new UI();

const products=new Products();



document.addEventListener("DOMContentLoaded",()=>{


    products.getProducts()

    .then(products=>{


        Storage.saveProducts(products);



        ui.displayProducts(products);



        ui.getButtons();



        Cart=Storage.getCart();



        Cart.forEach(item=>{


            ui.addCartItem(item);


        });



        ui.setCartValues(Cart);



    })

    .catch(error=>{


        console.log(
            "Error loading products:",
            error
        );


    });



});