const quizList = document.querySelector(".quiz");
const resultsContainer = document.querySelector(".results");
const submitButton = document.querySelector("#submit");

//add admin could function
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const adminEmail = document.querySelector("#admin-email").value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail}).then(result => {
    console.log(result);
  });
});


// listen for auth status changes
auth.onAuthStateChanged(user => { 
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        user.admin = idTokenResult.claims.admin;
        setupUI(user)
      })
      
      db.collection('questions').onSnapshot(snapshot => {
        setUpQuiz(snapshot.docs)
        const document = snapshot.docs;
      submitButton.addEventListener("click", (e) => {
          e.preventDefault();
          showResults(document, quizList, resultsContainer, user)
          showGraph(user)
      });
       
      });
      setupUI(user)
    } else {
      setupUI(user) 
      setUpQuiz([])
    }
  })


//create new question
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  db.collection("questions").add({
    q: createForm["question"].value,
    o: [createForm["option1"].value, createForm["option2"].value],
    gName: createForm["groupName"].value,
    D: parseInt(createForm["democrat"].value, 10), 
    R: parseInt(createForm["republican"].value, 10)
  }).then(() => {
      //close modal and reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    }
  )
})


// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      email: signupForm['signup-email'].value,
    }) 
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector(".error").innerHTML = ' '; 
  }).catch(err => {
       signupForm.querySelector(".error").innerHTML = err.message;

  });
});


//logout 
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut();
});

//login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
    //prevents page from reloading
    e.preventDefault();

    //get user info
    const email  = loginForm["login-email"].value;
    const password  = loginForm["login-password"].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close the signup modal & reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector(".error").innerHTML = '';
    }).catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message;
    })

})


