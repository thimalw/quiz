// Open Trivia DB API endpoint
const quizAPI = 'https://opentdb.com/api.php?amount=1&category=18&type=multiple';
const questionEl = document.getElementById('question');

document.addEventListener('DOMContentLoaded', async (e) => {
    // loadQuiz();
});

// loadQuiz loads a new quiz onto the app
const loadQuiz = async () => {
    const quizData = await getNewQuiz();

    // decode any html entities and display the question
    questionEl.innerText = he.decode(quizData.results[0].question);
};

// getNewQuiz returns new quiz data from the API
const getNewQuiz = async () => {
    const res = await fetch(quizAPI);
    return res.json();
};

// Knuth-Fisher-Yates shuffle algorithm
Array.prototype.shuffle = function () {
    var i, temp, j, len = arr.length;
    for (i = 0; i < len; i++) {
        j = ~~(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};
