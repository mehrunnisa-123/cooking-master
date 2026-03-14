// 1.  Recipe Data (8 Delicious Recipes)
const recipes = [
    {
        id: 1,
        name: "Classic Pancakes",
        category: "Breakfast",
        ingredients: ["Flour", "Egg", "Milk", "Sugar"],
        instructions: "Mix ingredients, pour onto a hot pan, and flip when bubbles appear. Serve with syrup!",
        image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400"
    },
    {
        id: 2,
        name: "Grilled Chicken Salad",
        category: "Lunch",
        ingredients: ["Chicken", "Lettuce", "Tomato", "Olive Oil"],
        instructions: "Grill chicken breast, chop veggies, and toss with olive oil and salt.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
    },
    {
        id: 3,
        name: "Chocolate Lava Cake",
        category: "Dessert",
        ingredients: ["Cocoa", "Butter", "Flour", "Dark Chocolate"],
        instructions: "Melt chocolate and butter, mix with flour, and bake for 12 mins at 200°C.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
    },
    {
        id: 4,
        name: "Veggie Pasta",
        category: "Lunch",
        ingredients: ["Pasta", "Tomato Sauce", "Bell Peppers", "Garlic"],
        instructions: "Boil pasta. Sauté veggies in garlic and sauce. Mix and serve with cheese.",
        image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400"
    },
    {
        id: 5,
        name: "Chicken Biryani",
        category: "Lunch",
        ingredients: ["Chicken", "Rice", "Lemon", "Chili Flakes"],
        instructions: "Boil the Chicken. Boil the rice. Add ingredients.",
        image: "https://cdn.shopify.com/s/files/1/0570/2113/6986/files/B3.jpg?v=1681556895"
    },
    {
        id: 6,
        name: "Fruit Parfait",
        category: "Dessert",
        ingredients: ["Yogurt", "Granola", "Berries", "Honey"],
        instructions: "Layer yogurt, granola, and berries in a glass. Drizzle with honey.",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400"
    },
    {
        id: 7,
        name: "Paneer Tikka",
        category: "Lunch",
        ingredients: ["Paneer", "Yogurt", "Spices", "Onion"],
        instructions: "Marinate paneer in spiced yogurt. Skewer with onions and grill until charred.",
        image: "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg"
    },
    {
        id: 8,
        name: "Smoothie Bowl",
        category: "Breakfast",
        ingredients: ["Banana", "Spinach", "Almond Milk", "Chia Seeds"],
        instructions: "Blend banana, spinach, and milk. Pour in a bowl and top with chia seeds.",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400"
    }
];

// Persistent Favorites using localStorage
let favorites = JSON.parse(localStorage.getItem('favs')) || [];

// DOM Elements
const resultsContainer = document.getElementById('results-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const favoritesList = document.getElementById('favorites-list');

// --- 2. Function to Display Recipes (DOM Creation) ---
function displayRecipes(filteredList) {
    resultsContainer.innerHTML = ""; 

    if (filteredList.length === 0) {
        resultsContainer.innerHTML = `<div class="error-msg">No recipes found for your search. Try another ingredient!</div>`;
        return;
    }

    filteredList.forEach(recipe => {
        // DOM Creation Method
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <div class="card-info">
                <h3>${recipe.name}</h3>
                <p class="tag">${recipe.category}</p>
                <button class="view-btn" onclick="toggleInstructions(this)">View Instructions</button>
                <div class="instructions">${recipe.instructions}</div>
                <button class="fav-btn" onclick="addToFavorites(${recipe.id})">Add to Favorites ❤️</button>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// --- 3. Search & Filter Logic---
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);

    // Validation to prevent empty search
    if (query === "" && selectedCategories.length === 0) {
        alert("Please enter an ingredient or pick a category first!");
        return;
    }

    const filtered = recipes.filter(r => {
        const matchesIngredient = r.ingredients.some(ing => ing.toLowerCase().includes(query));
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(r.category);
        return matchesIngredient && matchesCategory;
    });

    displayRecipes(filtered);
});

// --- 4. Favorites Management (DOM Manipulation) ---
function addToFavorites(id) {
    const recipe = recipes.find(r => r.id === id);
    
    // Check if already exists
    if (favorites.some(fav => fav.id === id)) {
        alert("Oops! This recipe is already in your favorites.");
        return;
    }

    favorites.push(recipe);
    updateFavoritesUI();
    saveToStorage();
}

function removeFromFavorites(id) {
    favorites = favorites.filter(fav => fav.id !== id);
    updateFavoritesUI();
    saveToStorage();
}

function updateFavoritesUI() {
    favoritesList.innerHTML = "";
    favorites.forEach(fav => {
        const li = document.createElement('li');
        // Setting content and a remove button
        li.innerHTML = `
            <span><strong>${fav.name}</strong> - ${fav.category}</span>
            <button class="remove-btn" onclick="removeFromFavorites(${fav.id})">Remove</button>
        `;
        favoritesList.appendChild(li);
    });
}

// --- 5. Interactive: Collapsible Instructions (DOM Traversal) ---
function toggleInstructions(btn) {
    // DOM Traversal: Using parentNode to find the sibling instructions div
    const cardInfo = btn.parentNode;
    const content = cardInfo.querySelector('.instructions');
    
    content.classList.toggle('show');
    btn.innerText = content.classList.contains('show') ? "Hide Instructions" : "View Instructions";
}

// LocalStorage Helper
function saveToStorage() {
    localStorage.setItem('favs', JSON.stringify(favorites));
}

// Initializing the page with all recipes
displayRecipes(recipes);
updateFavoritesUI();