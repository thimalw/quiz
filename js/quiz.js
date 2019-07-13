// Open Trivia DB API endpoint
const quizAPI = 'https://opentdb.com/api.php?amount=1&category=18&type=multiple';
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
var correctAnswer = '';

document.addEventListener('DOMContentLoaded', async function(e) {
    init();
});

// initialize app
const init = async () => {
    await loadQuiz();
};

// loadQuiz loads a new quiz onto the app
const loadQuiz = async () => {
    const quizData = await getNewQuiz();
    if (!quizData) {
        return false;
    }
    
    // decode any html entities and display the question
    questionEl.innerText = he.decode(quizData.question);

    // combine the answers to a single array and shuffle
    var answers = quizData.incorrect_answers;
    await answers.push(quizData.correct_answer);
    await answers.shuffle();
    
    // display the answers
    answersEl.innerHTML = '';
    for (answer of answers) {
        var answerDiv = document.createElement('div');
        answerDiv.setAttribute('class', 'quiz-an-single');
        answerDiv.textContent = he.decode(answer);
        answerDiv.addEventListener('click', function(e) {
            checkAnswer(this.innerText);
        });

        answersEl.appendChild(answerDiv);
    }

    correctAnswer = he.decode(quizData.correct_answer);
};

const checkAnswer = (answer) => {
    if (answer === correctAnswer) {
        console.log('Correct!');
    } else {
        console.log('Wrong!');
    }
};

// getNewQuiz returns new quiz data from the API
const getNewQuiz = async () => {
    const res = await fetch(quizAPI);
    const data = await res.json();

    // return the data if no response code is 0 (no error)
    return data.response_code ? false : data.results[0];
};

// Knuth-Fisher-Yates shuffle algorithm
Array.prototype.shuffle = function () {
    var i, temp, j, len = this.length;
    for (i = 0; i < len; i++) {
        j = ~~(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};
