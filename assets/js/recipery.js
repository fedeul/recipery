// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyC5Fuj_wTpHoA0Mq9z_IEOEseGuwcF6mx0",
  authDomain: "paan-2a30d.firebaseapp.com",
  projectId: "paan-2a30d",
  storageBucket: "paan-2a30d.appspot.com",
  messagingSenderId: "201448873426",
  appId: "1:201448873426:web:c3c39e98f8e97f3499bc0b",
  measurementId: "G-3R3PD4T1W5",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.firestore();
var db = firebase.firestore();

// GENERAR ITEM ID

var itemsId = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

// Reload jQuery de Gallery
function reloadGallery() {
  (function ($) {
    $(function () {
      // Navbar
      // $(".button-collapse").sideNav();
      var categories = $("nav .categories-container");
      categories.removeClass("pinned");
      if (categories.length) {
        categories.pushpin({ top: categories.offset().top });
        var $links = categories.find("li");
        $links.each(function () {
          var $link = $(this);
          $link.on("click", function () {
            $links.removeClass("active");
            $link.addClass("active");
            var hash = $link.find("a").first()[0].hash.substr(1);
            var $galleryItems = $(".gallery .gallery-item");

            $galleryItems.stop().addClass("gallery-filter").fadeIn(100);

            if (hash !== "all") {
              var $galleryFilteredOut = $galleryItems
                .not("." + hash)
                .not(".all");
              $galleryFilteredOut.removeClass("gallery-filter").hide();
            }

            // transition layout
            $masonry.masonry({
              transitionDuration: ".3s",
            });
            // only animate on layout
            $masonry.one("layoutComplete", function (event, items) {
              $masonry.masonry({
                transitionDuration: 0,
              });
            });
            setTimeout(function () {
              $masonry.masonry("layout");
            }, 1000);
          });
        });
      }

      setTimeout(function () {
        var onShow = (el) => {
          var carousel = el.find(".carousel.initialized");
          carousel.carousel({
            dist: 0,
            padding: 10,
          });
        };
        $(".gallery-expand").galleryExpand({
          onShow: onShow,
        });

        $(".blog .gallery-expand").galleryExpand({
          onShow: onShow,
          fillScreen: true,
          inDuration: 500,
        });
      }, 1000);
    }); // end of document ready
  })(jQuery); // end of jQuery name space
}

// CONTROLAR USUARIO ACTIVO
function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var user = firebase.auth().currentUser;
      // addNavs();
      usuarioActivo();
      listaItems();
      numeroItems();
      numeroItemsTagBread();
      numeroItemsTagDessert();
      numeroItemsTagPizza();
      numeroItemsTagMainDish();
    } else {
      // No user is signed in.
      var url = "index.html";
      window.location = url;
    }
  });
}
observador();

// SALUDAR USUARIO ACTIVO
function usuarioActivo() {
  // let usuarioActivo = document.getElementById("usuarioActivo");
  // let usuarioActivoMobile = document.getElementById("usuarioActivoMobile");
  let UserProfileLabelMail = document.getElementById("UserProfileLabelMail");
  let UserProfileLabel = document.getElementById("UserProfileLabel");
  let UserProfileLabelPhoto = document.getElementById("UserProfileLabelPhoto");
  let UserProfileMobileLabelPhoto = document.getElementById(
    "UserProfileMobileLabelPhoto"
  );
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();

  if (user.emailVerified) {
    UserProfileLabel.innerHTML = `${user.displayName}`;
    UserProfileLabelMail.innerHTML = `${user.email}`;

    if (user.photoURL === "noPhoto") {
      UserProfileMobileLabelPhoto.innerHTML = `<img src="./assets/img/user.png" class="img-user" 
      style="margin-top: 20px;padding: 1px;background-color: #000;border-radius: 50%;" alt="userIMG"
      width="46" />`;
      UserProfileLabelPhoto.innerHTML = `<img src="./assets/img/user.png" class="img-user"
      style="margin-top: 20px;padding: 1px;background-color: #000;border-radius: 50%;" alt="userIMG"
      width="46">`;
    } else {
      UserProfileMobileLabelPhoto.innerHTML = `<img  class="img-user" style="margin-top: 20px;padding: 1px;background-color: #000;border-radius: 50%;"  width="46" src="${user.photoURL}"  alt="${user.displayName}'s photo">`;
      UserProfileLabelPhoto.innerHTML = `<img src="${user.photoURL}" class="img-user"
              style="margin-top: 20px;padding: 1px;background-color: #000;border-radius: 50%;" alt="${user.displayName}'s photo"
              width="46">`;
    }
    console.log("Hi" + user.displayName);
  } else {
    var url = "index.html";
    window.location = url;
  }
}

// UPDATE PROFILE   ------------- ⚠ under construction ⚠ ------------------
// function updateProfile() {
//   var user = firebase.auth().currentUser;

//   user
//     .updateProfile({
//       photoURL: "noPhoto",
//     })
//     .then(function () {
//       // TOAST STARTS
//       const toastOptions = {
//         settings: {
//           duration: 2000,
//         },
//         style: {
//           main: {
//             background: "#000",
//             color: "#fff",
//             fontWeight: "700",
//           },
//         },
//       };
//       iqwerty.toast.toast("Photo profile updated!  🤳 ", toastOptions); // TOAST ENDS
//     })
//     .catch(function (error) {
//       // An error happened.
//     });
// }

// LOG OUT
function logOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
    });
}

//LISTAR RECETAS
function listaItems() {
  let listaItems = document.getElementById("listaItems");
  var db = firebase.firestore();
  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`).onSnapshot((querySnapshot) => {
    listaItems.innerHTML = "";
    querySnapshot.forEach((doc) => {
      listaItems.innerHTML += `
        <div class="col l4 m6 s12 gallery-item gallery-expand gallery-filter ${
          doc.data().tag
        }" id="${doc.id}">
          <div class="gallery-curve-wrapper" id="${doc.id}-wrapper">
              <a class="gallery-cover" style="height:250px; background-color:${
                doc.data().bg_img
              };">
                  <img class="responsive-img" style="background-color:${
                    doc.data().bg_img
                  };" src="${doc.data().img}"
                      alt="${doc.data().tag}">
              </a>
              <div class="gallery-header">
                  <span id="-card-${doc.id}" class="truncate">${
        doc.data().name
      }</span>
              </div>
              <div class="gallery-body z-depth-5" id="${doc.id}-body">
                  <div class="title-wrapper">         
                  <h3 id="cardInside-${doc.id}" class="materialize-textarea">${
        doc.data().name
      }</h3>
                  </div>
          
                  <div class="row center">

                      <div class="input-field col s12 m6 l3 inline" style="display:none;">
                      <p  id="${
                        doc.id
                      }-bg_img" class="materialize-textarea recipe_extra_fields">${
        doc.data().bg_img
      }</p>
                      <label class="active" for="weight"><i class="material-icons">palette
                      </i> Color </label>
                      </div>

                      <div class="input-field col s12 m6 l3 inline">
                      <p id="${
                        doc.id
                      }-servings" style="margin-bottom: 35px;margin-left: 35px;" class="left materialize-textarea recipe_extra_fields" >${
        doc.data().servings
      }</p>
                      <label class="active" for="weight"><i class="material-icons">restaurant
                      </i> Servings </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <p id="${
                        doc.id
                      }-totalTime" class="materialize-textarea recipe_extra_fields">${
        doc.data().prepTime + doc.data().cookTime
      }</p>
                      <label class="active" for="weight"><i class="material-icons">more_time
                      </i> Total time </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <p id="${
                        doc.id
                      }-cookTime" class="materialize-textarea recipe_extra_fields">${
        doc.data().cookTime
      }</p>
                      <label class="active" for="weight"><i class="material-icons">alarm_add
                      </i> Cook time </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <p id="${
                        doc.id
                      }-prepTime" class="materialize-textarea recipe_extra_fields">${
        doc.data().prepTime
      }</p>
                      <label class="active" for="weight"><i class="material-icons">pending_actions
                      </i> Prep. time </label>
                      </div>
                      
                      
                  </div>

                  <p class="description">Recipe</p>

                  <span id="${doc.id}-recipe" class="recipe_textarea">${
        doc.data().recipe
      }</span>
     
                    
   
              </div>
              <div class="gallery-action" id="${doc.id}-actions">
                <a class="btn-floating btn-large orange lighten-2 waves-effect waves-yellow"><i
                          class="material-icons" onclick="startEdit('${
                            doc.id
                          }','${doc.data().name}','${doc.data().bg_img}','${
        doc.data().img
      }','${doc.data().cookTime}','${doc.data().prepTime}','${
        doc.data().servings
      }','${doc.data().recipe}')">edit</i></a>

                  
              </div>
          </div>
        </div>
        `;
      reloadGallery();

      //

      //
    });
  });
}

// NÚMERO DE ITEMS EN LISTA
function numeroItems() {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  let numeroItems = document.getElementById("numeroItems");

  db.collection(`${user.email + user.uid}`).onSnapshot(
    (snapshot) => (numeroItems.innerHTML = `(${snapshot.size})`)
  );
}

function numeroItemsTagMainDish() {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  let numeroItemsTagMainDish = document.getElementById(
    "numeroItemsTagMainDish"
  );

  db.collection(`${user.email + user.uid}`)
    .where("tag", "==", "main-dish")
    .onSnapshot(
      (snapshot) => (numeroItemsTagMainDish.innerHTML = `(${snapshot.size})`)
    );
}

function numeroItemsTagBread() {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  let numeroItemsTagBread = document.getElementById("numeroItemsTagBread");

  db.collection(`${user.email + user.uid}`)
    .where("tag", "==", "bread")
    .onSnapshot(
      (snapshot) => (numeroItemsTagBread.innerHTML = `(${snapshot.size})`)
    );
}

function numeroItemsTagPizza() {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  let numeroItemsTagPizza = document.getElementById("numeroItemsTagPizza");

  db.collection(`${user.email + user.uid}`)
    .where("tag", "==", "pizza")
    .onSnapshot(
      (snapshot) => (numeroItemsTagPizza.innerHTML = `(${snapshot.size})`)
    );
}

function numeroItemsTagDessert() {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  let numeroItemsTagDessert = document.getElementById("numeroItemsTagDessert");

  db.collection(`${user.email + user.uid}`)
    .where("tag", "==", "dessert")
    .onSnapshot(
      (snapshot) => (numeroItemsTagDessert.innerHTML = `(${snapshot.size})`)
    );
}

// SUMAR MAIN DISH
function addMainDish() {
  var db = firebase.firestore();
  let steps = `Start writing your recipe here 🥘`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Main Dish",
      img: "./assets/img/main-dish.png",
      bg_img: "#ffffff",
      tag: "main-dish",
      recipe: steps,
      servings: 0,
      prepTime: 0,
      cookTime: 0,
    })
    .then(function (docRef) {
      reloadGallery();
      console.log("Document written with ID: ", docRef.id);
      document.getElementById(`${docRef.id}-wrapper`).className =
        "gallery-curve-wrapper pulse-recipe";
      let url = "#" + docRef.id;
      window.location = url;

      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 2000,
        },
        style: {
          main: {
            background: "#fff",
            color: "#000",
            fontWeight: "700",
          },
        },
      };
      iqwerty.toast.toast("New recipe created! 🥘 ", toastOptions); // TOAST ENDS
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

// SUMAR PAN A LISTA
function addBread() {
  var db = firebase.firestore();
  let steps = `Start writing your recipe here 🍞`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Bread",
      img: "./assets/img/bread.png",
      bg_img: "#42a5f5",
      tag: "bread",
      recipe: steps,
      servings: 0,
      prepTime: 0,
      cookTime: 0,
    })
    .then(function (docRef) {
      reloadGallery();
      console.log("Document written with ID: ", docRef.id);
      document.getElementById(`${docRef.id}-wrapper`).className =
        "gallery-curve-wrapper pulse-recipe";
      let url = "#" + docRef.id;
      window.location = url;

      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 2000,
        },
        style: {
          main: {
            background: "#42a5f5",
            color: "#000",
            fontWeight: "700",
          },
        },
      };
      iqwerty.toast.toast("New recipe created! 🍞 ", toastOptions); // TOAST ENDS
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

// SUMAR PIZZA A LISTA
function addPizza() {
  var db = firebase.firestore();
  let steps = `Start writing your recipe here 🍕`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Pizza",
      img: "./assets/img/pizza.png",
      bg_img: "#fbc02d",
      tag: "pizza",
      recipe: steps,
      servings: 0,
      prepTime: 0,
      cookTime: 0,
    })
    .then(function (docRef) {
      reloadGallery();
      console.log("Document written with ID: ", docRef.id);
      document.getElementById(`${docRef.id}-wrapper`).className =
        "gallery-curve-wrapper pulse-recipe";
      let url = "#" + docRef.id;
      window.location = url;

      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 2000,
        },
        style: {
          main: {
            background: "#fbc02d",
            color: "#000",
            fontWeight: "700",
          },
        },
      };
      iqwerty.toast.toast("New recipe created! 🍕 ", toastOptions); // TOAST ENDS
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

// SUMAR POSTRE A LISTA
function addDessert() {
  var db = firebase.firestore();
  let steps = `Start writing your recipe here 🧁`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Dessert",
      img: "./assets/img/dessert.png",
      bg_img: "#ff80ab ",
      tag: "dessert",
      recipe: steps,
      servings: 0,
      prepTime: 0,
      cookTime: 0,
    })
    .then(function (docRef) {
      reloadGallery();
      console.log("Document written with ID: ", docRef.id);
      document.getElementById(`${docRef.id}-wrapper`).className =
        "gallery-curve-wrapper pulse-recipe";
      let url = "#" + docRef.id;
      window.location = url;

      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 2000,
        },
        style: {
          main: {
            background: "#ff80ab ",
            color: "#000",
            fontWeight: "700",
          },
        },
      };
      iqwerty.toast.toast("New recipe created! 🧁 ", toastOptions); // TOAST ENDS
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

// COMENZAR EDICIÓN
function startEdit(
  id,
  name,
  bg_img,
  img,
  cookTime,
  prepTime,
  servings,
  recipe
) {
  var nameEdited = name;
  var bg_imgEdited = bg_img;
  var imgEdited = img;
  var cookTimeEdited = cookTime;
  var prepTimeEdited = prepTime;
  var servingsEdited = servings;
  var recipeEdited = recipe;

  document.getElementById(`${id}-actions`).onclick = "";

  document.getElementById(`${id}-body`).innerHTML = `
  <div class="title-wrapper red-text">         
                  <textarea id="cardInside-${id}" class="materialize-textarea">${nameEdited}</textarea>
                  </div>
          
                  <div class="row center">
                  
                      <div class="input-field col s6 m6 l2 inline">
                      <textarea id="${id}-servings" class="materialize-textarea recipe_extra_fields">${parseInt(
    servingsEdited
  )}</textarea>
                      <label class="active" for="weight"><i class="material-icons">restaurant
                      </i> Servings </label>
                      </div>

                      <div class="input-field col s6 m6 l2 inline">
                      <textarea  id="${id}-img" class="materialize-textarea recipe_extra_fields">${imgEdited}</textarea>
                      <label class="active" for="weight"><i class="material-icons">wallpaper
                      </i> Image </label>
                      </div>

                      <div class="input-field col s6 m6 l2 inline">
                      <textarea  id="${id}-bg_img" class="materialize-textarea recipe_extra_fields">${bg_imgEdited}</textarea>
                      <label class="active" for="weight"><i class="material-icons">palette
                      </i> Color </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <textarea  id="${id}-totalTime" class="materialize-textarea recipe_extra_fields" style="font-size: x-small!important;font-style: italic;padding-top: 6px;">automatic value</textarea>
                      <label class="active" for="weight"><i class="material-icons">more_time
                      </i> Total time </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <textarea id="${id}-cookTime" class="materialize-textarea recipe_extra_fields">${parseInt(
    cookTimeEdited
  )}</textarea>
                      <label class="active" for="weight"><i class="material-icons">alarm_add
                      </i> Cook time </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <textarea id="${id}-prepTime" class="materialize-textarea recipe_extra_fields">${parseInt(
    prepTimeEdited
  )}</textarea>
                      <label class="active" for="weight"><i class="material-icons">pending_actions
                      </i> Prep. time </label>
                      </div>
                                            
                  </div>

                  <p class="description">Recipe</p>

                  <div id="${id}-editor" class="recipe_textarea z-depth-3">${recipeEdited}</div>

                <div style="margin-top:18px;">
                  <a style="cursor:pointer;" class="left"><i class="material-icons grey-text" onclick="eliminar('${id}')">delete</i></a>
                  <a class="btn green waves-effect waves-light btn-small right" onclick="editar('${id}')"><i class="material-icons right" >save</i>Save</a>
                  <a class="btn-flat waves-effect waves-red right" onclick="cancelEdit('${id}','${nameEdited}','${bg_imgEdited}','${parseInt(
    cookTimeEdited
  )}','${parseInt(prepTimeEdited)}','${parseInt(
    servingsEdited
  )}','${recipeEdited}')" style="margin-right: 10px;">Cancel</a>
                </div>

 `;
  // CKEditor
  InlineEditor.create(document.querySelector(`#${id}-editor`), {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "underline",
        "|",
        "numberedList",
        "bulletedList",
        "outdent",
        "indent",
        "|",
        "blockQuote",
        "insertTable",
        "|",
        "undo",
        "redo",
      ],
    },
    language: "en",
    image: {
      toolbar: ["imageTextAlternative"],
    },
    licenseKey: "",
  })
    .then((editor) => {
      window.editor = editor;
    })
    .catch((error) => {
      console.error("Oops, something went wrong!");
      console.error(
        "Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:"
      );
      console.warn("Build id: vkmckg2i2aig-8hvnjvoh3l8g");
      console.error(error);
    });
}

// CANCEL EDITAR
function cancelEdit(
  id,
  nameEdited,
  bg_imgEdited,
  cookTimeEdited,
  prepTimeEdited,
  servingsEdited,
  recipeEdited
) {
  var nameCanceled = nameEdited;
  var bg_imgCanceled = bg_imgEdited;
  var cookTimeCanceled = parseInt(cookTimeEdited);
  var prepTimeCanceled = parseInt(prepTimeEdited);
  var servingsCanceled = parseInt(servingsEdited);
  var recipeCanceled = recipeEdited;

  document.getElementById(`${id}-body`).innerHTML = `
  <div class="title-wrapper">         
                  <h3 id="cardInside-${id}" class="materialize-textarea">${nameCanceled}</h3>
                  </div>
          
                  <div class="row center">

                      <div class="input-field col s12 m6 l3 inline" style="display:none;">
                      <p  id="${id}-bg_img" class="materialize-textarea recipe_extra_fields">${bg_imgCanceled}</p>
                      <label class="active" for="weight"><i class="material-icons">palette
                      </i> Color </label>
                      </div>

                      <div class="input-field col s12 m6 l3 inline">
                      <p id="${id}-servings" style="margin-bottom: 35px;margin-left: 35px;" class="left materialize-textarea recipe_extra_fields">${parseInt(
    servingsCanceled
  )}</p>

      <label class="active" for="weight"><i class="material-icons">restaurant
                      </i> Servings </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <p id="${id}-totalTime" class="materialize-textarea recipe_extra_fields">${parseInt(
    cookTimeCanceled + prepTimeCanceled
  )}</p>
                      <label class="active" for="weight"><i class="material-icons">more_time
                      </i> Total time </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <p id="${id}-cookTime" class="materialize-textarea recipe_extra_fields">${parseInt(
    cookTimeCanceled
  )}</p>
                      <label class="active" for="weight"><i class="material-icons">alarm_add
                      </i> Cook time </label>
                      </div>

                      <div class="input-field col s4 l2 inline right">
                      <p id="${id}-prepTime" class="materialize-textarea recipe_extra_fields">${parseInt(
    prepTimeCanceled
  )}</p>
                      <label class="active" for="weight"><i class="material-icons">pending_actions
                      </i> Prep. time </label>
                      </div>
                      
                    </div> 
                      <p class="description">Recipe</p>

                  <span id="${id}-recipe" class="recipe_textarea">${recipeCanceled}</span>
                      
 `;
}

// EDITAR ITEM
function editar(id) {
  var user = firebase.auth().currentUser;
  var elementoActualLista = db.collection(`${user.email + user.uid}`).doc(id);
  $(".gallery-expand").galleryExpand("close");

  var editItemName = document.getElementById(`cardInside-${id}`).value;
  var editItemColor = document.getElementById(`${id}-bg_img`).value;
  var editItemImg = document.getElementById(`${id}-img`).value;
  var editItemPrepTime = document.getElementById(`${id}-prepTime`).value;
  var editItemCookTime = document.getElementById(`${id}-cookTime`).value;
  var editItemServings = document.getElementById(`${id}-servings`).value;
  var editItemRecipe = document.getElementById(`${id}-editor`).innerHTML;

  return elementoActualLista
    .update({
      name: editItemName,
      recipe: editItemRecipe,
      bg_img: editItemColor,
      img: editItemImg,
      servings: parseInt(editItemServings),
      prepTime: parseInt(editItemPrepTime),
      cookTime: parseInt(editItemCookTime),
    })
    .then(function () {
      reloadGallery();
      console.log("Document successfully updated!");

      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 2000,
        },
        style: {
          main: {
            background: "#000",
            color: "#fff",
          },
        },
      };
      iqwerty.toast.toast("Changes saved! ✔ ", toastOptions); // TOAST ENDS
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

// ELIMINAR ITEM
function eliminar(id, user) {
  var user = firebase.auth().currentUser;
  var r = confirm(
    "Hey " +
      user.displayName +
      "! Are you sure you want to delete this recipe? This action can not be undo..."
  );
  if (r == true) {
    eliminarFOREVER(id);
    // TOAST STARTS
    const toastOptions = {
      settings: {
        duration: 2000,
      },
      style: {
        main: {
          background: "#000",
          color: "#fff",
        },
      },
    };
    iqwerty.toast.toast("Deleted! 👋 ", toastOptions); // TOAST ENDS;
  } else {
    // TOAST STARTS
    const toastOptions = {
      settings: {
        duration: 2000,
      },
      style: {
        principal: {
          background: "# 000",
          color: "#fff",
        },
      },
    };
    iqwerty.toast.toast("Ok, continue cooking", toastOptions); // END OF TOAST
  }
}
function eliminarFOREVER(id) {
  var db = firebase.firestore();
  var user = firebase.auth().currentUser;
  var nav_filter = document.getElementById("nav_filter");
  $(".gallery-expand").galleryExpand("close");

  db.collection(`${user.email + user.uid}`)
    .doc(id)
    .delete()
    .then(function () {
      reloadGallery();
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
}

// Detects if device is on iOS
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipod/.test(userAgent);
};
// Detects if device is in standalone mode
const isInStandaloneMode = () =>
  "standalone" in window.navigator && window.navigator.standalone;

const InstallMessage = document.getElementById("InstallMessage");

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
  InstallMessage.style =
    "visibility: visible; position: fixed;  bottom: 0;  left: 0;  z-index: 999;";
}

// UNDER CONTRUCTION-------
