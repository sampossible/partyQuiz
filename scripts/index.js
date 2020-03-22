const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector('.account-details');
const accountParty = document.querySelector('.account-extras');

const setupUI = (user) => {
    if(user) {
        // account info
        db.collection("users").doc(user.uid).get().then(doc => {
            const document = doc.data();
            const hi = `
                <p>Logged in as ${user.email}</p>
            `;
            accountDetails.innerHTML = hi;
            partyInfo(document);

        })
        
        //toggle UI elements
        //cycling through all the logged in links and setting their style to block
        loggedInLinks.forEach(item => item.style.display = "block");
        loggedOutLinks.forEach(item => item.style.display = "none");
    }
    else {
        // clear account info
        accountDetails.innerHTML = '';
        accountParty.innerHTML = '';
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = "none");
        loggedOutLinks.forEach(item => item.style.display = "block");
    }
}

//setup party information
const partyInfo = (document) => {
    if(document.party === 1) {
        const html = `
            <p>Here are some links to get you started DEMOCRAT</p>
            <div>Last time you took the quiz you answered mostly democratic</div>
        `;
        console.log("woot")
        accountParty.innerHTML = html;
    }
    else if(document.party === 2) {
        const html = `
            <p>Here are some links to get you started REPUBLICAN</p>
            <div>Last time you took the quiz you answered mostly republican</div>
        `;
        accountParty.innerHTML = html;
    }
    else if(document.party === 3) {
        const html = `
            <p>Here are some links to get you answered equally democratic and republican</p>
        `;
        accountParty.innerHTML = html;
    }
}

//setup quiz
//when we call in function we take in the data that we receive
const setUpQuiz = (data) => {
    if(data.length) {
    let html = "";
    
    data.forEach(doc => {
        const quiz = doc.data();
        const div = `
            <div class = "question">
                <h5>${quiz.q}</h5>
            </div>
            <div class = "answers">
                <label>
                    <input name= ${quiz.gName} type="radio" value = "0" required = "required"/>
                    <span>${quiz.o[0]}</span>
                </label>
        
                <label>
                    <input name= ${quiz.gName} type="radio" value = "1" required ="required"/>
                    <span>${quiz.o[1]}</span>
                </label>

            </div>
            </div>
        `;
        html += div

    });
    

    quizList.innerHTML = html;
    }
    else {
        quizList.innerHTML = '<h5 class = "center-align">Login to View Quiz</h5>'
    }
};


const showResults = (data, quizList, resultsContainer, user) => {
    var answerContainer = quizList.querySelector('.answers');
    var numDem = 0;
    var numRepub = 0;
    data.forEach((doc) => {
        const quiz = doc.data();
        const gName = quiz.gName;
        const userAnswer = (answerContainer.querySelector('input[name='+gName+']:checked')||{}).value;
        console.log(userAnswer);
        if(parseInt(userAnswer, 10) === quiz.D) {
            numDem++
        }
        else if (parseInt(userAnswer, 10)===quiz.R) {
            numRepub++
        }
        
    });
    var party = 0;
    if (numDem > numRepub) {
        party = 1;
        resultsContainer.innerHTML = 'You answered mostly Democratic';
    }
    else if (numRepub > numDem) {
        party = 2;
        resultsContainer.innerHTML = 'You answered mostly Republican';
    }
    else if (numRepub === numDem){
        party = 3;
        resultsContainer.innerHTML = 'You answered equally democratic and republican';
    }
        

        db.collection('users').doc(user.uid).set({
            party: party,
            numDem: numDem,
            numRepub: numRepub
          });
        
};




// graph js
const showGraph = (user => {
    db.collection('users').doc(user.uid).get().then(doc => {
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title: {
                text: "User's Party Alignments"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label}",
                dataPoints: [
                    {y: doc.data().numDem, label: "Democratic"},
                    {y: doc.data().numRepub, label: "Republican"},
                ]
            }]
        });
        chart.render();
    
    })
})
	
//script for 
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);


    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    
  
  });