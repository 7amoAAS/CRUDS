// [01]=> Get total
// [02]=> Create product
// [03]=> Clear inputs
// [04]=> Save data to local storage
// [05]=> Read
// [06]=> Count
// [07]=> Delete
// [08]=> Update
// [09]=> Search
// [10]=> Clean date

//? Select Items
const titleEl = document.getElementById("title");
const priceEl = document.getElementById("price");
const taxesEl = document.getElementById("taxes");
const adsEl = document.getElementById("ads");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const categoryEl = document.getElementById("category");
const createBtn = document.getElementById("create");
const updateBtn = document.getElementById("update");
const searchEl = document.getElementById("search");
const seByTBtn = document.getElementById("search-by-title");
const seByCBtn = document.getElementById("search-by-category");
const tbodyContainer = document.getElementById("tbody");
const deleteAllContainer = document.querySelector(".delete-all");
const deleteAllBtn = document.getElementById("delete-all");

let mood = "create";
let tmp;

// console.log(deleteAllBtn);

//TODO AddEventListeners
// Create product
createBtn.addEventListener("click", createProdcut);

// Delete all products
deleteAllBtn.addEventListener("click", deleteAllProducts);

// Search by title
seByTBtn.addEventListener("click", searchByMood);

// Search by category
seByCBtn.addEventListener("click", searchByMood);

// Search data
searchEl.addEventListener("input", searchData);

//* Save To LS
// Get products if there's ofcourse
let dataProducts;
if (localStorage.product != null) {
	dataProducts = JSON.parse(localStorage.product);
} else {
	dataProducts = [];
}

//! Functions

// Get total
function getTotal() {
	if (priceEl.value !== "") {
		const total =
			Number(priceEl.value) +
			Number(taxesEl.value) +
			Number(adsEl.value) -
			Number(discountEl.value);
		totalEl.innerText = total;

		// Add green color
		totalEl.parentElement.style.backgroundColor = "#cafc01";
		totalEl.style.color = "#161334";
	} else {
		// Clean the value of total
		totalEl.innerText = "";
		// return the defult color
		totalEl.parentElement.style.backgroundColor = "#c8389f";
		totalEl.style.color = "#161334";
	}
}

// Create product
function createProdcut() {
	const newProduct = {
		title: titleEl.value.toLowerCase(),
		price: priceEl.value,
		taxes: taxesEl.value,
		ads: adsEl.value,
		discount: discountEl.value,
		count: countEl.value,
		category: categoryEl.value.toLowerCase(),
		total: totalEl.innerHTML,
	};

	if (
		newProduct.title !== "" &&
		newProduct.price !== "" &&
		newProduct.count < 150 &&
		newProduct.category !== ""
	) {
		if (mood === "create") {
			if (newProduct.count > 1) {
				for (let i = 0; i < countEl.value; i++) {
					dataProducts.push(newProduct);
				}
			} else {
				dataProducts.push(newProduct);
				// Clear inputs
				clearInputs();
			}
		} else {
			// Get index of the item
			dataProducts[tmp] = newProduct;

			// Back to defult of craete btn
			createBtn.innerText = "Create";

			// show count input
			countEl.style.display = "block";

			// Back to defult of the mood
			mood = "create";
			
			// Clear inputs
			clearInputs();
		}
	}

	localStorage.setItem("product", JSON.stringify(dataProducts));

	// Show products
	showProducts();
}

// Clear inputs
function clearInputs() {
	const allInputs = document.querySelectorAll("form input");

	// console.log(allInputs.length);
	for (let i = 0; i < allInputs.length; i++) {
		allInputs[i].value = "";
	}

	totalEl.innerText = "";
	totalEl.parentElement.style.backgroundColor = "#c8389f";
}

// Show products
function showProducts() {
	let table = "";
	for (let i = 0; i < dataProducts.length; i++) {
		table += `
    <tr>
      <td>${i + 1}</td>
      <td>${dataProducts[i].title}</td>
      <td>${dataProducts[i].price}</td>
      <td>${dataProducts[i].ads}</td>
      <td>${dataProducts[i].discount}</td>
      <td>${dataProducts[i].total}</td>
      <td>${dataProducts[i].category}</td>
      <td><button onclick="updateItem(${i})" class="btn updBtn">update</button></td>
      <td><button onclick="deleteItem(${i})" class="btn delBtn">delete</button></td>
    </tr>`;
	}
	tbodyContainer.innerHTML = table;
	showAndHideDeleteContainer();
}
showProducts();

// Delete one item
function deleteItem(i) {
	dataProducts.splice(i, 1);
	localStorage.product = JSON.stringify(dataProducts);
	showProducts();
}

// show and hide delete all container
function showAndHideDeleteContainer() {
	if (dataProducts.length > 0) {
		deleteAllContainer.classList.add("show");
		deleteAllContainer.classList.remove("hide");
	} else {
		deleteAllContainer.classList.add("hide");
		deleteAllContainer.classList.remove("show");
	}
	deleteAllBtn.innerText = `Delete all (${dataProducts.length})`;
}

// Delete all products
function deleteAllProducts() {
	localStorage.clear();
	dataProducts = [];
	showProducts();
}

// Update items
function updateItem(i) {
	// Update values
	titleEl.value = dataProducts[i].title;
	priceEl.value = dataProducts[i].price;
	taxesEl.value = dataProducts[i].taxes;
	adsEl.value = dataProducts[i].ads;
	discountEl.value = dataProducts[i].discount;
	totalEl.value = dataProducts[i].total;
	categoryEl.value = dataProducts[i].category;

	// Change to update btn
	createBtn.innerText = "Update";

	// Change the mood
	mood = "update";

	// remove count input
	countEl.style.display = "none";

	// Get Total
	getTotal();

	// Change tmp to i
	tmp = i;

	// Scrollt to up page
	window.scroll({
		top: 0,
	});
}

// Search by...
let searchMood = "title";

function searchByMood(e) {
	if (this.id === "search-by-title") {
		searchMood = "title";
	} else {
		searchMood = "category";
	}
	searchEl.placeholder = `Search by ${searchMood}`;
	searchEl.focus();
	searchEl.value = "";
	showProducts();
}

function searchData() {
	let table = "";
	for (let i = 0; i < dataProducts.length; i++) {
		if (searchMood == "title") {
			if (dataProducts[i].title.includes(this.value.toLowerCase())) {
				table += `
					<tr>
						<td>${i + 1}</td>
						<td>${dataProducts[i].title.toLowerCase()}</td>
						<td>${dataProducts[i].price}</td>
						<td>${dataProducts[i].ads}</td>
						<td>${dataProducts[i].discount}</td>
						<td>${dataProducts[i].total}</td>
						<td>${dataProducts[i].category.toLowerCase()}</td>
						<td><button onclick="updateItem(${i})" class="btn updBtn">update</button></td>
						<td><button onclick="deleteItem(${i})" class="btn delBtn">delete</button></td>
					</tr>`;
			}
		} else {
			if (dataProducts[i].category.includes(this.value.toLowerCase())) {
				table += `
					<tr>
						<td>${i + 1}</td>
						<td>${dataProducts[i].title.toLowerCase()}</td>
						<td>${dataProducts[i].price}</td>
						<td>${dataProducts[i].ads}</td>
						<td>${dataProducts[i].discount}</td>
						<td>${dataProducts[i].total}</td>
						<td>${dataProducts[i].category.toLowerCase()}</td>
						<td><button onclick="updateItem(${i})" class="btn updBtn">update</button></td>
						<td><button onclick="deleteItem(${i})" class="btn delBtn">delete</button></td>
					</tr>`;
			}
		}
	}
	tbodyContainer.innerHTML = table;
}
