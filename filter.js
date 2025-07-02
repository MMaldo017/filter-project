const data = [
  {
    id: 1,
    name: "Invicta Men's Pro Diver",
    img: "https://m.media-amazon.com/images/I/71e04Q53xlL._AC_UY879_.jpg",
    price: 74,
    cat: "Dress",
  },
  {
    id: 11,
    name: "Invicta Men's Pro Diver 2",
    img: "https://m.media-amazon.com/images/I/71e04Q53xlL._AC_UY879_.jpg",
    price: 74,
    cat: "Dress",
  },
  {
    id: 2,
    name: "Timex Men's Expedition Scout ",
    img: "https://m.media-amazon.com/images/I/91WvnZ1g40L._AC_UY879_.jpg",
    price: 40,
    cat: "Sport",
  },
  {
    id: 3,
    name: "Breitling Superocean Heritage",
    img: "https://m.media-amazon.com/images/I/61hGDiWBU8L._AC_UY879_.jpg",
    price: 200,
    cat: "Luxury",
  },
  {
    id: 4,
    name: "Casio Classic Resin Strap ",
    img: "https://m.media-amazon.com/images/I/51Nk5SEBARL._AC_UY879_.jpg",
    price: 16,
    cat: "Sport",
  },
  {
    id: 5,
    name: "Garmin Venu Smartwatch ",
    img: "https://m.media-amazon.com/images/I/51kyjYuOZhL._AC_SL1000_.jpg",
    price: 74,
    cat: "Casual",
  },
];

//reference the DOM

const productsContainer = document.querySelector(".products"); //---> container with the products
const searchInput = document.querySelector(".search");//search input box
const categoriesContainer = document.querySelector('.cats');
const priceRange = document.querySelector(".priceRange");
const priceValue = document.querySelector('.priceValue');


//function to display products based on the filtered data

const displayProducts = (filteredProducts) => {

    productsContainer.innerHTML = filteredProducts.map(product =>

        `
        <div class="product">
            <img src=${product.img} alt="">
            <span class="name">${product.name}</span>
            <span class="priceText">${product.price}</span>
        </div>
        `
    ).join("");//joins the mapped html strings

};

displayProducts(data);

//filter products based off the input box
searchInput.addEventListener("keyup", (e) => {

    const value = e.target.value.toLowerCase()// converts to lowercase

    if(value){
        //filter method
        displayProducts(data.filter(item => item.name.toLocaleLowerCase().indexOf(value) !== -1 ))
    }else{
        displayProducts(data)
    }
})

//function to dynamically set and display categories

const setCategories = () => {

    //extract unique categories from the data
    const allCats = data.map(item => item.cat);//repeating cats

    const categories = [
        "All",
        ...allCats.filter((item,i) =>{
            return allCats.indexOf(item) === i
        })
    ];


//display categories as clickable spans
categoriesContainer.innerHTML = categories.map(cat => 
    `
    <span class="cat">${cat}</span>
    `
).join("")


//Event listener for category filtering
categoriesContainer.addEventListener("click", (e) => {
    const selectedCat = e.target.textContent;//get the selected cat

    if(selectedCat === "All"){
        displayProducts(data)
    }else{
        displayProducts(data.filter(item=>
            item.cat === selectedCat
        ))
    }
})

}


//function to set up price range filter

const setPrices = () =>{
    const priceList = data.map(item=>item.price);
    const minPrice = Math.min(...priceList);
    const maxPrice = Math.max(...priceList);

    //configure the price range slider
    priceRange.min = minPrice;
    priceRange.max = maxPrice;
    priceRange.value = maxPrice;
    priceValue.textContent = "$" + maxPrice

    //add an eventListener to filter products based on price range
    priceRange.addEventListener("input", (e) =>{
        priceValue.textContent = "$" + e.target.value
        displayProducts(data.filter(item=>item.price <= e.target.value))

    })


}



setPrices();
setCategories();