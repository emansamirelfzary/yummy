"use strict"
// loading screen
$(document).ready(function () {
  $("#meals-loading").fadeOut(100)
      $("#main-loading").fadeOut(500, function(){
          $("html").css("overflow","auto");
          $("#main-loading").remove();
      });
  
});


// Nav Bar
let menuWidth= $(".menu").innerWidth();
$("nav").css("left",-menuWidth)
console.log(menuWidth)
$("#open").click(function(){
    $("#open").addClass("d-none");
    $("#close").removeClass("d-none");
    $("nav").animate({"left":"0"},500)
    $(".links li").animate({"top":"0px"},300)
     
})
function closeMenu(){
    $("#close").addClass("d-none");
    $("#open").removeClass("d-none");
    $("nav").animate({"left":-menuWidth},500);
    $(".links li").animate({"top":"250px"},100);   
}
$("#close").click(closeMenu)

// gloobal variables
let apiEndPoint="", // ==> to send API to getMeals function as a prameter
 allMeals= [],
 categoryMeals=[],
 mealsArea=[],
 mealsIngredients=[]

// get meals 
function getMeals (apiEndPoint){ 
  $("#meals-loading").fadeIn(100)

    fetch(apiEndPoint).then(Response =>Response.json()).then(data=> {
     allMeals=data.meals
     console.log(allMeals)
    displayMeals(allMeals)
    $("#meals-loading").fadeOut(500)
    closeMenu()

})
.catch(error =>{
    console.log("edo:",error);

})
}

/*
let getMeals= async (apiEndPoint)=> {
  $("#meals-loading").fadeIn(100)

  try{
    let Response= await fetch(apiEndPoint);
    let data= await Response.json();
     allMeals=data.meals;
     console.log(allMeals)
    displayMeals(allMeals)
       $("#meals-loading").fadeOut(500)}
       catch (error){
        console.log("error")
       }
  
}
*/

// display meals
function displayMeals(allMeals) {
  $(".contact-form").addClass("d-none")

    let cartona=``;
      for (let i = 0; i < allMeals.length; i++) {
        cartona += `<div class="col-md-3" onclick="getDetails('${allMeals[i].idMeal}')"><div class="image details rounded-3 overflow-hidden position-relative"><img src="${allMeals[i].strMealThumb}" class="w-100" alt="mealimg"><div class="overlay d-flex align-items-center"><h3>${allMeals[i].strMeal}</h3></div></div></div>`;
      }
       
   $('#showMeals').html(cartona)

}
// Initialize the page
getMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s`);

// meals details
// get details
function getDetails(mealId){
    $("#meals-loading").fadeIn(100)

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`).then(Response =>Response.json()).then(data=> {
      let  mealDetails=data.meals
        showDetails(mealDetails[0])
        console.log(mealDetails[0])
          $("#meals-loading").fadeOut(500)
          closeMenu()

   })
   .catch(error =>{
       console.log("edo:",error);
   })
}

// display details
function showDetails (mealDetails){
  $(".contact-form").addClass("d-none");
  $("#search-input").addClass("d-none")

    let cartona=``,
    ingre=``,
    tags=``;
      for (let i=1;i<20; i++){
        if(mealDetails[`strIngredient${i}`] && mealDetails[`strMeasure${i}`] !==""){
        ingre+=`<span>${mealDetails[`strMeasure${i}`]} ${mealDetails[`strIngredient${i}`]}</span>`
        }
      }
      if(mealDetails.strTags !== null){
      let tagName=mealDetails.strTags.split(",")
      for (let i=0;i<tagName.length; i++){
        tags+=`<span>${tagName[i]}</span>`
        
      }}
        cartona += `<div class="col-md-4"><div><img src="${mealDetails.strMealThumb}" class="w-100 rounded-3" alt="mealimg"><h3 class="text-white  fs-2">${mealDetails.strMeal}</h3></div></div>
        <div class="col-md-8"><div class="text-white"><h2>Instructions</h2><p>${mealDetails.strInstructions}</p><ul class="p-0"><li>Area :<span>${mealDetails.strArea}</span></li><li>Category :<span>${mealDetails.strCategory}</span></li><li class="ingred">Recipes :<br>${ingre}</li><li class="tags">Tags :<br>${tags}</li><div class="mt-3"><a class="btn btn-success me-2" href="${mealDetails.strSource}" target="_blank">source</a><a class="btn btn-danger" href="${mealDetails.strYoutube}" target="_blank">youtube</a></div>`;
      
       
   $('#showMeals').html(cartona)
}


// search meal
$("#search").click(function() {
    $("#search-input").removeClass("d-none")
    $(".contact-form").addClass("d-none")
    $("#showMeals").empty() 
    closeMenu()
});
// search by firsl letter    
$("#letter").keyup(function(){ 
    closeMenu()
let fLetter = $("#letter").val()
console.log(letter);
apiEndPoint = `https://www.themealdb.com/api/json/v1/1/search.php?f=${fLetter}`;
  getMeals(apiEndPoint);
  $("#meals-loading").fadeOut(500)
}
  )

// search by name 
$("#name").keyup(function(){ 
    closeMenu()
    let mealName = $(this).val()
    console.log(mealName);
    apiEndPoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
      getMeals(apiEndPoint);
      if (allMeals) {displayMeals(allMeals)} 
      else {displayMeals([])}    
      $("#meals-loading").fadeOut(500)

    })

//categories
//get categories
$("#categories").click(function(){
  $("#meals-loading").fadeIn(100)

        fetch("https://www.themealdb.com/api/json/v1/1/categories.php").then(Response =>Response.json()).then(data=> {
         categoryMeals=data.categories
         console.log(categoryMeals)
         closeMenu()
        displayCategories(categoryMeals)
        $("#meals-loading").fadeOut(500)

    })
    .catch(error =>{
        console.log("edo:",error);
    })
})
// display categories
function displayCategories(categoryMeals){
  $(".contact-form").addClass("d-none");
  $("#search-input").addClass("d-none")


let cartona=``;
      for (let i = 0; i < categoryMeals.length; i++) {
        let description = categoryMeals[i].strCategoryDescription.split(" ").slice(0,20).join(" "); //=> split(sperate ever word) slice(cut of these words only 20) join(collect them in sentance again)
        cartona += `<div class="col-md-3"><div class="image categ rounded-3 overflow-hidden position-relative"><img src="${categoryMeals[i].strCategoryThumb}" class="w-100" alt="mealimg"><div class="overlay text-center"><h3>${categoryMeals[i].strCategory}</h3><p class="px-2">${description}</p></div></div></div>`;
      }
   $('#showMeals').html(cartona); 

   // categories filter
   $(".categ").click(function(){
    let categoryName = $(this).find("h3").text()
    apiEndPoint = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
    getMeals(apiEndPoint);
    console.log(categoryName);
})      
}

//area
//get area
$("#area").click(function(){
  $("#meals-loading").fadeIn(100)

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list").then(Response =>Response.json()).then(data=> {
     mealsArea=data.meals
     console.log(mealsArea)
     closeMenu()
    displayArea(mealsArea)
    $("#meals-loading").fadeOut(500)

})
.catch(error =>{
    console.log("edo:",error);
})
})

// display area
function displayArea(mealsArea){
  $(".contact-form").addClass("d-none");
  $("#search-input").addClass("d-none")

let cartona=``;
  for (let i = 0; i < mealsArea.length; i++) {
    cartona += `<div class="col-md-3"><div class="text-center mb-4 area"><i class="fa-solid fa-house-laptop fa-4x text-white"></i><h3 class="text-white">${mealsArea[i].strArea}</h3></div></div>`;
  }
$('#showMeals').html(cartona);
// filter area
$(".area").click(function(){
    let areaName = $(this).find("h3").text()
    apiEndPoint = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`;
    getMeals(apiEndPoint);
})  

}


// ingredients
// get ingredients
$("#ingredients").click(function(){
  $("#meals-loading").fadeIn(100)

    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list").then(Response =>Response.json()).then(data=> {
     mealsIngredients=data.meals.slice(0,20)
     console.log(mealsIngredients)
     closeMenu()
    displayIngredients(mealsIngredients)
    $("#meals-loading").fadeOut(500)

})
.catch(error =>{
    console.log("edo:",error);
})
})

// display ingredients
function displayIngredients(mealsIngredients){
  $(".contact-form").addClass("d-none");
  $("#search-input").addClass("d-none")

let cartona=``;
  for (let i = 0; i < mealsIngredients.length; i++) {
    let descriptionIn = mealsIngredients[i].strDescription.split(" ").slice(0,20).join(" ");

    cartona += `<div class="col-md-3"><div class="text-center text-white mb-4 area"><i class="fa-solid fa-drumstick-bite fa-4x text-white"></i><h3>${mealsIngredients[i].strIngredient}</h3><p>
    ${descriptionIn}</p></div></div>`;
  }
$('#showMeals').html(cartona);
// filter ingredient
$(".area").click(function(){
    let ingredientsName = $(this).find("h3").text()
    apiEndPoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientsName}`;
    getMeals(apiEndPoint);
})  

}


// contact 
$("#contact").click(function(){
$(".contact-form").removeClass("d-none")
$("#search-input").addClass("d-none")
$("#showMeals").empty()
closeMenu()
})

// inputs validation
  let nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z])$/,
      nameValue="",
      emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      emailValue="",
      phoneRegex = /^[0-9]{11}$/,
      phoneValue="",
      ageRegex = /^(0?[1-9]|[1-9][0-9])$/,
      ageValue="",
      passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      passwordValue="",
      rePasswordValue="";

  //name
$("#nameInput").on("input", function() {
      nameValue = $(this).val();
  if (!nameRegex.test(nameValue)) {
    $(".name-alert").removeClass("d-none").text("Special characters and numbers not allowed");
    $("#submitBtn").prop("disabled", true);
  } else {
    $(".name-alert").addClass("d-none");
    enableSubmitBtn();
  }
});

// Email
$("#emailInput").on("input", function() {
      emailValue = $(this).val();
  if (!emailRegex.test(emailValue)) {
    $(".email-alert").removeClass("d-none").text("Email not valid (e.g., example@yyy.zzz)");
    $("#submitBtn").prop("disabled", true);
  } else {
    $(".email-alert").addClass("d-none");
    enableSubmitBtn();
  }
});

// Phone
$("#phoneInput").on("input", function() {
      phoneValue = $(this).val();
  if (!phoneRegex.test(phoneValue)) {
    $(".phone-alert").removeClass("d-none").text("Enter a valid Phone Number");
    $("#submitBtn").prop("disabled", true);
  } else {
    $(".phone-alert").addClass("d-none");
    enableSubmitBtn();
  }
});

// Age
$("#ageInput").on("input", function() {
      ageValue = $(this).val();
  if (!ageRegex.test(ageValue)) {
    $(".age-alert").removeClass("d-none").text("Enter a valid age");
    $("#submitBtn").prop("disabled", true);
  } else {
    $(".age-alert").addClass("d-none");
    enableSubmitBtn();
  }
});

// Password
$("#passwordInput").on("input", function() {
      passwordValue = $(this).val();
  if (!passwordRegex.test(passwordValue)) {
    $(".password-alert").removeClass("d-none").text("Enter a valid password (Minimum eight characters, at least one letter and one number)");
    $("#submitBtn").prop("disabled", true);
  } else {
    $(".password-alert").addClass("d-none");
    enableSubmitBtn();
  }
});

// Re-enter Password
$("#repasswordInput").on("input", function() {
      rePasswordValue = $(this).val();
  if (passwordValue !== rePasswordValue) {
    $(".repassword-alert").removeClass("d-none").text("Enter a valid repassword");
    $("#submitBtn").prop("disabled", true);
  } else {
    $(".repassword-alert").addClass("d-none");
console.log(passwordValue)
    enableSubmitBtn()}})

  //enable btn
  // .test return boloan false or true 
    function enableSubmitBtn(){
      if (nameRegex.test(nameValue) && emailRegex.test(emailValue) && phoneRegex.test(phoneValue) && ageRegex.test(ageValue) && passwordRegex.test(passwordValue) && passwordValue === rePasswordValue){
      $("#submitBtn").prop("disabled", false);
    console.log(nameRegex.test(nameValue))}
    }
