var questions = [
     {
        q: "The United States _____ regulate fracking",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States ______ enact a wealth tax on individuals making above $10 million annually.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "Government-run healthcare insurance _______ be an option for everyone.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States ________ consider taxing carbon emissions by private companies.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States _____ provide federal funding for abortions.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States ____ provide a jobs guarantee for American citizens.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States _____ guarantee paid maternal and paternal leave for all workers.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States _____ prioritize reducing the national debt over other discretionary spending",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States ________ re-write the tax code to eliminate loopholes for large companies, such as Amazon.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    },
    {
        q: "The United States _________ re-enter the Paris Climate Agreement.",
        o: [
            "should",
            "should not",
        ],
        D: 0,
        R: 1

    }
    
];



var quiz = {
  draw : function () {
  // quiz.draw() : draw the quiz

    // Fetch the HTML quiz wrapper
    var wrapper = document.getElementById("quiz-wrap");

    // Loop through all the questions
    // Create all the necessary HTML elements
    for (var index in questions) {
      var number = parseInt(index) + 1; // The current question number
      var qwrap = document.createElement("div"); // A div wrapper to hold this question and options
      qwrap.classList.add("question"); // CSS class, for cosmetics

      // The question - <h1> header
      var question = document.createElement("h1");
      question.innerHTML = number + ") " + questions[index]['q'];
      qwrap.appendChild(question);

      // The options - <input> radio buttons and <label>
      for (var oindex in questions[index]['o']) {
        // The <label> tag
        var label = document.createElement("label");
        qwrap.appendChild(label);

        // The <option> tag
        var option = document.createElement("input");
        option.type = "radio";
        option.value = oindex;
        option.required = true;
        option.classList.add("oquiz"); // Will explain this later in function submit below

        // Remember that a radio button group must share the same name
        option.name = "quiz-" + number;
        label.appendChild(option);

        // Add the option text
        var otext = document.createTextNode(questions[index]['o'][oindex]);
        label.appendChild(otext);
      }

      // Finally, add this question to the main HTML quiz wrapper
      wrapper.appendChild(qwrap);
    }

    // Attach submit button + event handler to the quiz wrapper
    var submitbutton = document.createElement("input");
    submitbutton.type = "submit";
    wrapper.appendChild(submitbutton);
    wrapper.addEventListener("submit", quiz.submit);
  },

  submit : function (evt) {
  // quiz.submit() : Handle the calculations when the user submits to quiz
    // Stop the form from submitting
    evt.preventDefault();
    evt.stopPropagation();

    // Remember that we added an "oquiz" class to all the options?
    // We can easily get all the selected options this way
    var selected = document.querySelectorAll(".oquiz:checked");

    // Get the score
    var republican = 0;
    var democrat = 0;
    for (var index in questions) {
      if (selected[index].value == questions[index]['D']) {
        democrat++;
      }
      else if (selected[index].value == questions[index]['R']) {
        republican++;
      }
    }

    // Update and show the score
    // Instead of creating elements, we can also directly alter the inner HTML
    var html = "<h1>";
    if (democrat > republican) {
      html += "You answered mostly Democratic";
      //writeNumberToDatabase("democrat", democrat, republican);
    } else if (republican < democrat) {
      html += "You answered mostly Republican";
      //writeNumberToDatabase("republican", democrat, republican);
    } else {
      html += "You answered equally Republican and Democrat!";
      //writeNumberToDatabase("neither", democrat, republican);
    }
    
    document.getElementById("quiz-wrap").innerHTML = html;
  }
};


/* [INIT] */
window.addEventListener("load", quiz.draw);