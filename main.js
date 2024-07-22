// Selector's

let categoryContainer = document.querySelectorAll(".category .box");
let quizContainer = document.querySelector(".quiz-container");
let theName = document.querySelector(".name");
let countQuestion = document.querySelector(".count");
let containerSpans = document.querySelector(".spans");
let theBtn = document.querySelector(".submit-btn");
let quizArea = document.querySelector(".question-area");
let quizAnswerArea = document.querySelector(".answer-area");
let myResult = document.querySelector(".result");
let theBulltes = document.querySelector(".count-down");
let containerTimer = document.querySelector(".timer");
// Set Option's
let currentElement = 0;
let theShuffleOfAnswerDiv = [];
let rightAnswer = 0;
let interVal;


document.querySelector(".back").addEventListener("click", () => setTimeout(() => { window.location.reload()}, 1000));

// Looping
categoryContainer.forEach((el) => {
  el.addEventListener("click", (e) => {
    console.log(e.currentTarget.dataset.category);
    getDataFromClicking(e.currentTarget.dataset.category);
  });
});

function getDataFromClicking(data) {
  theName.innerHTML = data;
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      document.getElementById("myAudio").play();

      let myData = JSON.parse(this.responseText);

      document.querySelector(".our-category").classList.add("remove");
      quizContainer.classList.add("active");

      let maxLength = myData.length;

      createBulltes(maxLength);

      // Shuffle Data
      shuffle(myData);

      // Function ShowDataToDom

      ShowDataToDom(myData[currentElement], maxLength);

      // countDown

      countDown(60, maxLength);

      // BTN
      theBtn.addEventListener("click", () => {
        checkRightAnswer(myData[currentElement].right_answer, maxLength);
        currentElement++;
        quizArea.innerHTML = "";
        quizAnswerArea.innerHTML = "";
        theShuffleOfAnswerDiv = [];
        ShowDataToDom(myData[currentElement], maxLength);
        handleActiveBulltes();
        // finalForm
        finalForm(maxLength);
        clearInterval(interVal);
        // countDown
        countDown(60, maxLength);
      });
    }
  };

  myRequest.open("GET", `JSON/${data}.json`, true);

  myRequest.send();
}

// http://localhost:3000/

// createBulltes
function createBulltes(length) {
  countQuestion.innerHTML = length;
  // Create Li

  for (let i = 0; i < length; i++) {
    let theSpan = document.createElement("span");

    if (i === 0) theSpan.classList.add("active");

    containerSpans.appendChild(theSpan);
  }
}

// Shuffle Array

function shuffle(array) {
  let current = array.length;
  let theStorage;
  let randomNumber;

  while (current > 0) {
    randomNumber = Math.floor(Math.random() * current);

    current--;

    theStorage = array[current];

    array[current] = array[randomNumber];

    array[randomNumber] = theStorage;
  }

  return array;
}

// ShowDataToDom

function ShowDataToDom(element, maxLength) {
  if (currentElement < maxLength) {
    let { title } = element;
    let theDiv = document.createElement("div");

    theDiv.className = "answer";

    let theHeading = document.createElement("h2");

    theHeading.appendChild(document.createTextNode(title));

    quizArea.appendChild(theHeading);

    // Create Input + label

    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let theInput = document.createElement("input");

      if (i === 1) theInput.checked = true;

      theInput.type = "radio";
      theInput.id = `answer_${i}`;
      theInput.name = `question`;

      theInput.dataset.answer = `${element[`answer_${i}`]}`;

      let theLabel = document.createElement("label");

      theLabel.htmlFor = `answer_${i}`;

      theLabel.textContent = `${element[`answer_${i}`]}`;

      answerDiv.appendChild(theInput);
      answerDiv.appendChild(theLabel);

      theShuffleOfAnswerDiv.push(answerDiv);

      shuffle(theShuffleOfAnswerDiv);
    }
    theShuffleOfAnswerDiv.forEach((el) => {
      quizAnswerArea.appendChild(el);
    });
  }
}

// checkRightAnswer

function checkRightAnswer(rAnswer, maxLength) {
  let allQuestion = document.getElementsByName("question");
  let chossenAnswer;

  for (let i = 0; i < allQuestion.length; i++) {
    if (allQuestion[i].checked) {
      chossenAnswer = allQuestion[i].dataset.answer;
    }
  }

  if (chossenAnswer == rAnswer) {
    rightAnswer++;
  }
}

function handleActiveBulltes() {
  let allSpans = document.querySelectorAll(".spans span");

  allSpans.forEach((el, indx) => {
    if (currentElement == indx) {
      el.classList.add("active");
    }
  });
}

function finalForm(count) {
  if (currentElement == count) {
    quizAnswerArea.remove();
    theBtn.remove();
    quizArea.remove();
    theBulltes.remove();

    let span = document.createElement("span");

    span.className =
      rightAnswer === count
        ? "perfect"
        : rightAnswer > count / 2 && rightAnswer < count
        ? "good"
        : "bad";

    span.textContent = `${
      rightAnswer === count
        ? `Perfect : You Got ${rightAnswer} From ${count}`
        : rightAnswer > count / 2 && rightAnswer < count
        ? `Good Well : You Got ${rightAnswer} From ${count}`
        : `Bad : You God ${rightAnswer} From ${count}`
    }`;
    myResult.appendChild(span);
  }
}

function countDown(duration, maxLength) {
  if (currentElement < maxLength) {
    let minute, second;

    interVal = setInterval(() => {
      minute = parseInt(duration / 60);
      second = parseInt(duration % 60);

      minute = minute < 10 ? `0${minute}` : minute;
      second = second < 10 ? `0${second}` : second;
      containerTimer.innerHTML = `${minute} : ${second}`;

      if (--duration === 0) {
        theBtn.click();
        clearInterval(interVal);
      }
    }, 1000);
  }
}
