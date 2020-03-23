const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector('.account-details');
const accountParty = document.querySelector('.account-extras');
const adminItems = document.querySelectorAll('.admin');

const setupUI = (user) => {
    if(user) {
        if(user.admin) {
            adminItems.forEach(item => item.style.display = "block");
        }
        // account info
        db.collection("users").doc(user.uid).get().then(doc => {
            const document = doc.data();
            const html = `
                <p>Logged in as ${user.email}</p>
                <div class = "pink-text">${user.admin ? 'Admin' : ''}</div>
            `;
            accountDetails.innerHTML = html;
            partyInfo(document);

        })
        //toggle UI elements
        //cycling through all the logged in links and setting their style to block
        loggedInLinks.forEach(item => item.style.display = "block");
        loggedOutLinks.forEach(item => item.style.display = "none");
    }
    else {
        adminItems.forEach(item => item.style.display = 'none');
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
            <div>
            <h6>Last time you took the quiz you answered mostly <strong>democratic</strong><h6>
            <p>Here are some links to keep you informed</p>
            <ul>
                <li><a href = "https://democrats.org">Democrats.org</a><li>
                <li><a href = "https://www.demconvention.com/">2020 Democratic Convention Link</a><li>
            <ul>
            </div>
        `;
        accountParty.innerHTML = html;
    }
    else if(document.party === 2) {
        const html = `
            <div>
            <h6>Last time you took the quiz you answered mostly <strong>republican</strong></h6>
            <p>Here are some links to keep you informed</p>
            <ul>
                <li><a href = "https://www.gop.com/platform/">Republican National Committee</a><li>
                <li><a href = "https://politicalresources.com/for-political-professionals/democratic-and-republican-state-parties-2">Republican State Parties</a><li>
            </ul>
            </div>
        `;
        accountParty.innerHTML = html;
    }
    else if(document.party === 3) {
        const html = `
            <p>Last time you took the quiz you answered <strong>equally democratic and republican</strong></p>
            <p>Here are some links to keep you informed</p>
            <ul>
                <li><a href = "https://democrats.org">Democrats.org</a><li>
                <li><a href = "https://www.demconvention.com/">2020 Democratic Convention Link</a><li>
                <li><a href = "https://www.gop.com/platform/">Republican National Committee</a><li>
                <li><a href = "https://politicalresources.com/for-political-professionals/democratic-and-republican-state-parties-2">Republican State Parties</a><li>
            </ul>
        `;
        accountParty.innerHTML = html;
    }
}

//setup quiz
//when we call in function we take in the data that we receive
const setUpQuiz = (data) => {
    if(data.length) {
    let html = "<h1 class = 'teal-text'>Welcome to the Party Quiz<h1><h6>Answer the questions below to see how your stances on important issues align with the Democratic or Republican Party</h6>";
    
    data.forEach(doc => {
        const quiz = doc.data();
        const div = `
            <div class = "question">
                <h5>${quiz.q}</h5>
            </div>
            <div class = "answers" style = "margin-bottom: 40px;">
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
        quizList.innerHTML = "<h5 style = 'text-align: center;'> Sign-In or Login to View Quiz<h5>"
    }
};


const showResults = (data2, quizList, resultsContainer, user) => {
    var answerContainer = quizList.querySelectorAll('.answers');
    var numDem = 0;
    var numRepub = 0;
    data2.forEach((doc) => {
        const quiz = doc.data();
        const gName = quiz.gName;
        var rates = document.getElementsByName(gName);
        var rate_value;
        for(var i = 0; i < rates.length; i++){
             if(rates[i].checked){
                rate_value = rates[i].value;
            }
        }
        console.log(quiz);
        //const userAnswer = (answerContainer.querySelectorAll('input[name='+gName+']:checked')||{}).value;
        console.log(rate_value);
        if(rate_value == quiz.D) {
            numDem++
        }
        else if (rate_value== quiz.R) {
            numRepub++
        }
    });
    var party;
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
            backgroundColor: "#eee",
            title: {
                text: "User's Party Alignments",
                fontFamily: "tahoma"
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