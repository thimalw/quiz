// Open Trivia DB API endpoint
const quizAPI = 'https://opentdb.com/api.php?amount=1&type=multiple';

// load frequently used DOM elements
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const resultEl = document.getElementById('result');
const resultMessageEl = document.getElementById('message');
const continueBtnEl = document.getElementById('quiz-continue');
const difficultyEl = document.getElementById('quiz-difficulty');
const contentEl = document.getElementById('content');

var correctAnswer = ''; // correct answer to the question
var score = 0;          // user score

// initialize app after DOM is loaded
document.addEventListener('DOMContentLoaded', function(e) {
    init();
});

// initialize app
const init = async () => {
    continueBtnEl.addEventListener('click', function(e) {
        loadQuiz();
    })
    
    loadQuiz();
};

// loadQuiz loads a new quiz onto the app
const loadQuiz = async () => {
    contentEl.classList.add('loading');
    resultEl.classList.remove('show');

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
        var singleAnswerEl = document.createElement('div');
        singleAnswerEl.setAttribute('class', 'quiz-an-single');
        singleAnswerEl.textContent = he.decode(answer);
        singleAnswerEl.addEventListener('click', function(e) {
            checkAnswer(he.decode(this.innerText));
        });

        answersEl.appendChild(singleAnswerEl);
    }

    if (quizData.difficulty === 'easy') {
        difficultyEl.innerText = '😎';
    } else if (quizData.difficulty === 'medium') {
        difficultyEl.innerText = '🤔';
    } else if (quizData.difficulty === 'hard') {
        difficultyEl.innerText = '😰';
    }

    correctAnswer = he.decode(quizData.correct_answer);
    contentEl.classList.remove('loading');
};

const checkAnswer = answer => {
    // reset result element
    answersEl.innerHTML = '';
    resultEl.classList.remove('error');
    resultEl.classList.remove('success');
    
    let resultClass = 'error';
    let resultMessage = '';
    
    // check the answer
    if (answer === correctAnswer) {
        resultMessage = '"' + correctAnswer + '" is correct!';
        resultClass = 'success';
        score++;
    } else {
        resultMessage = 'Wrong. The correct answer is "' + correctAnswer + '"';
    }

    resultEl.classList.add(resultClass);
    resultMessageEl.textContent = resultMessage;
    
    // display the result element
    resultEl.classList.add('show');
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
