let firebaseConfig = {
apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID.firebaseio.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "G-MEASUREMENT_ID",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.firestore();

// CREATE ACCOUNT
function registrar() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let name = document.getElementById("name").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function () {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: name,
        photoURL: "noPhoto",
      });
      verificar();
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

// LOGIN
function ingresar() {
  let emailUser = document.getElementById("emailUser").value;
  let passwordUser = document.getElementById("passwordUser").value;
  let contenido_wrong = document.getElementById("contenido_wrong");

  firebase
    .auth()
    .signInWithEmailAndPassword(emailUser, passwordUser)
    .then(function () {
      ingresoUserLogged();
    })
    .catch(function (error) {
      contenido_wrong.innerHTML = `
            <div class="alert alert-danger" role="alert">
            <i class="tiny material-icons">priority_high
            </i> Wrong email or password.
            </div>
        `;
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}

function verificar() {
  var user = firebase.auth().currentUser;

  user
    .sendEmailVerification()
    .then(function () {
      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 18000,
        },
        style: {
          main: {
            background: "red",
            color: "#fff",
            fontWeight: "700",
          },
        },
      };
      iqwerty.toast.toast(
        `Almost done! Please ${user.displayName} enter to your email and verify your account.`,
        toastOptions
      ); // TOAST ENDS
      // Email sent.
      addSampleRecipes();
      setTimeout(function () {
        var url = "yourRecipery.html";
        window.location = url;
      }, 19000);
    })
    .catch(function (error) {
      // An error happened.
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var user = firebase.auth().currentUser;
      ingresoUserLogged();
    } else {
      // No user is signed in.
    }
  });
}
observador();

function ingresoUserLogged() {
  let VERIFYaccount = document.getElementById("VERIFYaccount");
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  if (user.emailVerified) {
    var url = "yourRecipery.html";
    window.location = url;
  } else {
    VERIFYaccount.innerHTML = `
        <div class="red white-text" role="alert">
        <i class="material-icons tiny">priority_high
        </i> YOU MUST TO VERIFY YOUR ACCOUNT! <br> Please, enter to your email and check your inbox.
        </div>
        `;
  }
}

// UPDATE PASSWORD
function forgotPassword() {
  var auth = firebase.auth();
  var forgotEmail = document.getElementById("forgotEmail").value;

  auth
    .sendPasswordResetEmail(forgotEmail)
    .then(function () {
      // TOAST STARTS
      const toastOptions = {
        settings: {
          duration: 18000,
        },
        style: {
          main: {
            background: "green",
            color: "#fff",
            fontWeight: "700",
          },
        },
      };
      iqwerty.toast.toast(
        `If your account exists, you will recive the instructions in your inbox.`,
        toastOptions
      ); // TOAST ENDS
      // Email sent.
    })
    .catch(function (error) {
      // An error happened.
    });
}

// Create the 4 initial recipes
function addSampleRecipes() {
  var db = firebase.firestore();
  var user = firebase.auth().currentUser;

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "Brownies",
      img: "./assets/img/brownie.jpg",
      bg_img: "#42a5f5",
      tag: "dessert",
      recipe:
        "<h4>Ingredientes</h4><ul><li>170g chocolate semi amargo, picado asi nomás</li><li>110g manteca</li><li>200g azúcar negra</li><li>3 huevos chicos (155g) o 2 bien grandes</li><li>55ml (1/4 taza) cafe fuerte líquido</li><li>140g (1 taza) harina 0000</li><li>1/2 cucharadita sal</li></ul><p><br></p><h4>Pasos</h4><ol><li>Prender el horno a 180ºC.</li><li>Enmantecar o forrar con papel manteca o aluminio un molde de 20x20cm.</li><li>Preparar el cafe y reservar.</li><li>En un bowl derretir chocolate y manteca, en el microondas (de a 15 segundos revolviendo bien cada vez) o sobre cacerola con agua hirviendo, sobre el vapor, que el agua no toque el fondo del molde.</li><li>Agregar azúcar con batidor de mano y mezclar bien.</li><li>Agregar huevos y mezclar sin batir hasta unir todo.</li><li>Agregar cafe, harina y sal. Mezclar bien.</li><li>Poner en el molde y cocinar por unos 20 a 30 minutos, hasta que se le haga una capita brillante por encima pero todavía se mueva un poco.</li><li>Dejen enfriar antes de cortar. &nbsp;- Se recomienda tenerlos en la heladera. -</li></ol><sup>Fuente: @paulampics.</sup>",
      servings: 10,
      prepTime: 15,
      cookTime: 30,
    })
    .then({})
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "Fugazzeta rellena",
      img: "./assets/img/fugazzetta.jpg",
      bg_img: "#42a5f5",
      tag: "pizza",
      recipe:
        "<h4>Ingredientes para una pizza grande&nbsp;</h4><ul><li>550g harina 000/panificable</li><li>375g agua</li><li>5g levadura instantánea/15g fresca</li><li>12g sal</li><li>6g aceite de oliva</li></ul><h4>Pasos</h4><ol><li>Amasar como más les guste y dejar levar hasta duplicar. Luego dividir y dejar fermentar nuevamente en frío por 48 horas... si resisten. Antes de usar, sacar de la heladera un par de horas antes. Esta larga fermentación hará la masa mucho más liviana, aireda y con mucho sabor.</li><li>Estirar la primer masa y la colocar dentro del molde, después cortar pedazos pequeños de queso y rellenar. Cubrir todo con la segunda masa previamente estirada y por arriba unas cebollas finamente cortadas, algunas hiervas, queso rallado (adicional), un toque de sal, pimienta y oliva.</li><li>En horno a leña a 300°C serán unos 10 minutos. En horno hogareño al máximo unos 20 mins.</li></ol><sup>Fuente: Gluten Morgen.</sup>",
      servings: 8,
      prepTime: 60,
      cookTime: 30,
    })
    .then({})
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

  db.collection(`${user.email + user.uid}`)
    .add({
      name: "Pan Integral Casero",
      img: "./assets/img/pan-integral.jpg",
      bg_img: "#42a5f5",
      tag: "bread",
      recipe:
        "<h3>Ingredientes</h3><ul><li>2 tazas de harina integral</li><li>1/2 taza de harina común</li><li>2 cditas/8g. de levadura en polvo</li><li>2 cdas. de azúcar</li><li>1 cdita. de sal</li><li>1 taza de leche</li><li>2 cdas. de aceite de oliva</li><li>1 huevo</li></ul><h4>Paso a paso</h4><ol><li>Colocar las 2 tazas de harina integral y la media taza de harina común en un bol.</li><li>Agregar 2 cucharadas de azúcar y una cucharadita de sal.</li><li>Sumar un sobrecito (8 gr aprox) de levadura en polvo y mezclar super bien hasta que esté todo integrado.</li><li>Ahora vamos a ir agregando de a poco una taza de leche tibia, mientras mezclar con la mano hasta que esté bien unido.</li><li>Una vez que está todo integrado agregamos un huevo y dos cucharadas de aceite de oliva. Puede reemplazarse por aceite común pero el aceite de oliva le da un sabor especial.</li><li>Seguir mezclando hasta que quede una pasta y amasarla durante 10 minutos. No va a tener pinta de una masa de pan, pero confíen.</li><li>Agregar de a poco más harina blanca, aproximadamente 1/4 de taza. Mezclar un poco más y obtendrán una masa mucho más firme.</li><li>Pasar a la mesada y amasar unas 60 veces hasta que la masa esté bien consistente.</li><li>Reservar en un bol o plato con un repasador encima, y dejar levar durante 10 minutos. Si, solamente 10 minutos.</li><li>Estirar la masa sobre la mesada (solo un poco) y enrollarlo para que tenga forma de pan.</li><li>Untar con aceite de oliva una budinera o recipiente para cocinar el pan. Colocar la masa, taparlo con un repasador y dejar levar nuevamente, ésta vez por 35 minutos. Mientras tanto vamos a precalentar el horno a 200º, lo cual es muy importante para que ya esté bien caliente a la hora de meter el pan a cocinar.</li><li>Una vez que haya levado, pincelamos con agua y colocamos semillas encima. El agua es simplemente para que se peguen las semillas al pan.</li><li>Salpicar el horno con unas gotitas de agua para generar un poquitito de vapor. Hornear durante 30 minutos.</li></ol><sup>Fuente: Paulina Cocina.</sup>",
      servings: 12,
      prepTime: 55,
      cookTime: 30,
    })
    .then({})
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}
