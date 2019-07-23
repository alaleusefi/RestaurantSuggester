fs = require("fs");

drinks = [];
foods = [];

users = null;
userDrinks = [];
userFoods = [];

venues = null;
venueDrinks = [];
venueFoods = [];

decision = { venuesToGo: [], venuesToAvoid: [] };

start();
readUsersFile(() =>
    readVenuesFile(keepGoing));

function keepGoing() {
    populateDrinksUnion();
    addUserDrinkBitmaps();
    addVenueDrinkBitmaps();
    determineVenuesHaveDrinkFor();
    populateFoodsUnion();
    addUserFoodBitmaps();
    addVenueFoodBitmaps();
    determineVenuesHaveFoodFor();
    decide();
    generateOutput();
}

function start() {
    if (process.argv.length < 4) {
        console.log("Please provide input parameters in this format:");
        console.log("node Find.js <users>.json <venues>.json");
    }
}

function readUsersFile(callback) {
    fs.readFile(process.argv[2], 'utf8', (err, data) => {
        users = JSON.parse(data.toLowerCase());
        callback();
    });
}

function readVenuesFile(callback) {
    fs.readFile(process.argv[3], 'utf8', (err, data) => {
        venues = JSON.parse(data.toLowerCase());
        callback();
    });
}

//Cost defenitions:
//U: length of Users
//V: length of Venues
//D: length of Union Drinks
//F: length of Union Foods
//Sum: (U + V) + (U + V) + (U * F) + (U * D) + (V * F) + (V * D) + (V * U) + (V * U) + V 

//Cost: U + V
function populateFoodsUnion() {
    let foodsData = users.map(user => user.wont_eat);
    foodsData = Array.prototype.concat.apply(foodsData, venues.map(venue => venue.food))
    //check line below
    foods = Array.prototype.concat.apply([], foodsData);
    foods = foods.filter((val, ind, arr) => {
        return arr.indexOf(val) == ind;
    });
}

//Cost: U + V
function populateDrinksUnion() {
    let drinksData = users.map(user => user.drinks);
    drinksData = Array.prototype.concat.apply(drinksData, venues.map(venue => venue.drinks))
    drinks = Array.prototype.concat.apply([], drinksData);
    drinks = drinks.filter((val, ind, arr) => {
        return arr.indexOf(val) == ind;
    });

}

//Cost: U * F
function addUserFoodBitmaps() {
    users.forEach(user => {
        user.foodBitmap = "";
        foods.forEach(food => {
            if (user.wont_eat.includes(food))
                user.foodBitmap += 0;
            else
                user.foodBitmap += 1;
        })
    })
}

//Cost: U * D
function addUserDrinkBitmaps() {
    users.forEach(user => {
        user.drinkBitmap = "";
        drinks.forEach(drink => {
            if (user.drinks.includes(drink))
                user.drinkBitmap += 1;
            else
                user.drinkBitmap += 0;
        })
    })
}

//Cost: V * F
function addVenueFoodBitmaps() {
    venues.forEach(venue => {
        venue.foodBitmap = "";
        foods.forEach(food => {
            if (venue.food.includes(food))
                venue.foodBitmap += 1;
            else
                venue.foodBitmap += 0;
        })
    })
}

//Cost: V * D
function addVenueDrinkBitmaps() {
    venues.forEach(venue => {
        venue.drinkBitmap = "";
        drinks.forEach(drink => {
            if (venue.drinks.includes(drink))
                venue.drinkBitmap += 1;
            else
                venue.drinkBitmap += 0;
        })
    })
}

//Cost: V * U
function determineVenuesHaveDrinkFor() {
    venues.forEach(venue => {
        venue.noDrinkFor = [];
        for (i = 0; i < users.length; i++) {
            user = users[i];
            let bitMap = parseInt(venue.drinkBitmap, 2) & parseInt(user.drinkBitmap, 2);
            if (bitMap == 0)
                venue.noDrinkFor.push(user.name);
        };
        venue.qualifiesForDrink = venue.noDrinkFor.length == 0;
    });
}

//Cost: V * U
function determineVenuesHaveFoodFor() {

    venues.forEach(venue => {
        venue.noFoodFor = [];
        for (i = 0; i < users.length; i++) {
            user = users[i];
            let bitMap = parseInt(venue.foodBitmap, 2) & parseInt(user.foodBitmap, 2);
            if (bitMap == 0)
                venue.noFoodFor.push(user.name);
        };
        venue.qualifiesForFood = venue.noFoodFor.length == 0;
    });
}

//cost : V 
function decide() {
    venues.forEach(venue => {
        let qualifies = venue.qualifiesForDrink & venue.qualifiesForFood;
        if (qualifies)
            decision.venuesToGo.push(venue);
        else
            decision.venuesToAvoid.push(venue);
    });
}

function generateOutput() {

    let outputText = "Places to go: \r\n";
    decision.venuesToGo.forEach(venueToGo => {
        outputText += "\r\n\t • " + venueToGo.name + "\r\n";
    });

    outputText += "\r\n\r\n";

    outputText += "Places to avoid: \r\n";
    decision.venuesToAvoid.forEach(venueToAvoid => {
        outputText += "\r\n\t • " + venueToAvoid.name + "\r\n";

        if (venueToAvoid.qualifiesForFood == false)
            outputText += "\t\t ○ There is nothing for " + venueToAvoid.noFoodFor.join(" and ") + " to eat \r\n";
        if (venueToAvoid.qualifiesForDrink == false)
            outputText += "\t\t ○ There is nothing for " + venueToAvoid.noDrinkFor.join(" and ") + " to drink \r\n";
    });

    fs.writeFile("./result.txt", outputText, () => console.log("Please see result.txt in my folder!"));
}
