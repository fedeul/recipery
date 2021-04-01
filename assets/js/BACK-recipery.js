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

// CONTROLAR USUARIO ACTIVO
function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var user = firebase.auth().currentUser;
      // addNavs();
      usuarioActivo();
      listaItems();
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
  // let UserProfileLabelMail = document.getElementById("UserProfileLabelMail");
  let UserProfileLabel = document.getElementById("UserProfileLabel");
  // let UserProfileLabelPhoto = document.getElementById("UserPhoto");
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();

  if (user.emailVerified) {
    UserProfileLabel.innerHTML = `${user.displayName}`;
    console.log("Hi!");
  } else {
    var url = "index.html";
    window.location = url;
  }
}

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

// SUMAR ITEM A LISTA TO DO DESDE MOBILE
// function addItemMOBILE() {
//   var db = firebase.firestore();
//   var itemName = document.getElementById("itemNameMOBILE").value;
//   var itemTag = document.getElementById("itemTagMOBILE").value;
//   var itemrecipe = document.getElementById("itemrecipeMOBILE").value;

//   var user = firebase.auth().currentUser;

//   db.collection(`${user.email}`)
//     .add({
//       name: itemName,
//       tag: itemTag,
//       recipe: itemrecipe,
//     })
//     .then(function (docRef) {
//       // console.log("Document written with ID: ", docRef.id);
//       document.getElementById("itemNameMOBILE").value = "";
//       document.getElementById("itemTagMOBILE").value = null;
//       document.getElementById("itemrecipeMOBILE").value = "";
//       listNavs();
//       closeAdd();
//       $(".close").click();
//     })
//     .catch(function (error) {
//       console.error("Error adding document: ", error);
//     });
// }

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
              <a class="gallery-cover gray" style="height: 300px;">
                  <img class="responsive-img" style="background-color:${
                    doc.data().bg_img
                  };" src="${doc.data().img}"
                      alt="${doc.data().tag}">
              </a>
              <div class="gallery-header">
                  <span id="-card-${doc.id}">${doc.data().name}</span>
              </div>
              <div class="gallery-body">
                  <div class="title-wrapper">         
                  <textarea id="cardInside-${
                    doc.id
                  }" class="materialize-textarea">${doc.data().name}</textarea>
                  </div>
          
                  <div class="row">
                      <div class="input-field col s2 inline">
                      <textarea id="${
                        doc.id
                      }-prepTime" style="font-size:1em; padding-bottom: 0;" class="materialize-textarea">${
        doc.data().prepTime
      }</textarea>
                      <label class="active" for="weight"><i class="material-icons">pending_actions
                      </i> Prep. time </label>
                      </div>
                      <div class="input-field col s2 inline">
                      <textarea id="${
                        doc.id
                      }-cookTime" style="font-size:1em; padding-bottom: 0;" class="materialize-textarea">${
        doc.data().cookTime
      }</textarea>
                      <label class="active" for="weight"><i class="material-icons">more_time
                      </i> Cook time </label>
                      </div>
                      <div class="input-field col s2 inline">
                      <textarea id="${
                        doc.id
                      }-servings" style="font-size:1em; padding-bottom: 0;" class="materialize-textarea">${
        doc.data().servings
      }</textarea>
                      <label class="active" for="weight"><i class="material-icons">restaurant
                      </i> Servings </label>
                      </div>

                      <div class="input-field col s2 inline">
                      <textarea  id="${
                        doc.id
                      }-bg_img" style="font-size:1em; padding-bottom: 0;" class="materialize-textarea">${
        doc.data().bg_img
      }</textarea>
                      <label class="active" for="weight"><i class="material-icons">palette
                      </i> Color </label>
                      </div>
                      
                  </div>

                  <p class="description">Recipe</p>

                  <div class="editor" id="${doc.id}-Editor">${
        doc.data().recipe
      }</div>
     
                    
   
              </div>
              <div class="gallery-action">
                <a class="btn-floating btn-large orange lighten-2 waves-effect waves-yellow"><i
                          class="material-icons" onclick="editar('${
                            doc.id
                          }')">save</i></a>
                  <a class="btn-floating btn-large red lighten-2 waves-effect waves-red"><i class="material-icons" onclick="eliminarFOREVER('${
                    doc.id
                  }')">delete</i></a>
              </div>
          </div>
        </div>
        `;
      reloadGallery();

      // CKEditor
      InlineEditor.create(document.querySelector(".editor"), {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "strikethrough",
            "underline",
            "|",
            "link",
            "imageUpload",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "indent",
            "outdent",
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
    });
  });
}

// SUMAR PAN A LISTA
function addBread() {
  var db = firebase.firestore();
  let steps = `<div class="editor ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred" id="${itemsId}-Editor" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor, main" contenteditable="true"><h3> Start writing your recipe here 🍞</h3></div>`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Bread",
      img: "/assets/img/bread.png",
      bg_img: "#00e676",
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
      $("#$docRef.id").galleryExpand("open");
      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 2000,
        },
        style: {
          main: {
            background: "#00e676",
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
  let steps = `<div class="editor ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred" id="${itemsId}-Editor" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor, main" contenteditable="true"><h3> Start writing your recipe here 🍕</h3></div>`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Pizza",
      img: "/assets/img/pizza.png",
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
  let steps = `<div class="editor ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred" id="${itemsId}-Editor" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor, main" contenteditable="true"><h3> Start writing your recipe here 🧁</h3></div>`;

  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "New Dessert",
      img: "/assets/img/dessert.png",
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

// EDITAR ITEM DESKTOP
function editar(id) {
  var user = firebase.auth().currentUser;
  var elementoActualLista = db.collection(`${user.email + user.uid}`).doc(id);
  $(".gallery-expand").galleryExpand("close");

  var editItemName = document.getElementById(`cardInside-${id}`);
  var editItemColor = document.getElementById(`${id}-bg_img`).value;
  var recipeNew = document.getElementById(id + "-Editor");

  return elementoActualLista
    .update({
      name: editItemName.value,
      recipe: recipeNew.innerHTML,
      bg_img: editItemColor,
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

// ELIMINAR ITEM FOREVER
function eliminarFOREVER(id) {
  var db = firebase.firestore();
  var user = firebase.auth().currentUser;
  $(".gallery-expand").galleryExpand("close");

  db.collection(`${user.email + user.uid}`)
    .doc(id)
    .delete()
    .then(function () {
      // location.reload();
      reloadGallery();

      console.log("Document successfully deleted!");
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
      iqwerty.toast.toast("Deleted! 👋 ", toastOptions); // TOAST ENDS
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
}

// Reload jQuery de Gallery
function reloadGallery() {
  (function ($) {
    $(function () {
      // Navbar
      $(".button-collapse").sideNav();
      var categories = $("nav .categories-container");
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
