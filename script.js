let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;
let timeLeft = 900;

let quizStarted = false; // Biến để kiểm tra xem bài thi đã bắt đầu hay chưa
let timerStarted = false;


function startQuiz() {
    if (!quizStarted) {
        quizStarted = true;
        document.getElementById('start-button').classList.add('hidden'); // Ẩn nút "Bắt đầu"

        startTimer(); // Bắt đầu thời gian chạy nếu chưa bắt đầu
        timerStarted = true;

        displayQuestion(); // Hiển thị câu hỏi đầu tiên
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data); // Xáo trộn mảng câu hỏi
            displayQuestion();
            startTimer();
        })
        .catch(error => {
            console.error('Error loading the questions:', error);
        });
});

function displayQuestion() {
    if (!quizStarted) {
        return; // Nếu bài thi chưa bắt đầu, không hiển thị câu hỏi
    }
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const questionObj = questions[currentQuestionIndex];
    const questionElement = document.createElement('div');
    questionElement.textContent = questionObj.question;
    questionContainer.appendChild(questionElement);

    questionObj.choices.forEach(choice => {
        const choiceElement = document.createElement('button');
        choiceElement.textContent = choice;
        choiceElement.classList.add('choice');
        choiceElement.addEventListener('click', () => selectAnswer(choiceElement, choice));
        questionContainer.appendChild(choiceElement);
    });

    updateProgress();

    if (currentQuestionIndex === 0) {
        document.getElementById('prev-button').classList.add('hidden');
    } else {
        document.getElementById('prev-button').classList.remove('hidden');
    }

    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('next-button').classList.add('hidden');
        document.getElementById('submit-button').classList.remove('hidden');
    } else {
        document.getElementById('next-button').classList.remove('hidden');
        document.getElementById('submit-button').classList.add('hidden');
    }
}

function selectAnswer(choiceElement, choice) {
    // Bỏ chọn tất cả các đáp án
    const allChoices = document.querySelectorAll('.choice');
    allChoices.forEach(choice => {
        choice.classList.remove('selected');
    });
    // Chọn đáp án được click và tô màu
    choiceElement.classList.add('selected');
    const questionObj = questions[currentQuestionIndex];
    if (choice === questionObj.answer) {
        score++;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function prevQuestion() {
    currentQuestionIndex--;
    displayQuestion();
}

function startTimer() {
    if (quizStarted && !timerStarted) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById('time').textContent = timeLeft;
            } else {
                clearInterval(timerInterval);
                submitQuiz();
            }
        }, 1000);
        timerStarted = true; // Đánh dấu rằng thời gian đã bắt đầu chạy
    }
}

function updateProgress() {
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = questions.length;
}

function submitQuiz() {
   
    let timeQuiz= 900 - timeLeft;
    console.log(timeQuiz)
    console.log(timeLeft)
    let diemTG = 50
    if(timeQuiz >  600 && timeQuiz <= 650){
        diemTG= 40
    }else if(timeQuiz >  650 && timeQuiz <= 700){
        diemTG= 30
    }else if(timeQuiz >  700 && timeQuiz <= 750){
        diemTG= 20
    }else if(timeQuiz >  750 && timeQuiz <= 800){
        diemTG= 10
    }else if(timeQuiz > 800){
        diemTG = 5
    }
    console.log(diemTG)
    let diem = score * 5 + diemTG;
    clearInterval(timerInterval);
    const questionContainer = document.getElementById('question-container');
    // điểm = 50% thời gian + 50% câu trả lời   -  900
    questionContainer.innerHTML = `<h2>Hoàn thành bài thi</h2><p>Số câu đúng: ${score}/${questions.length}</p><p>Số điểm: ${diem}/100 </p>`;
    document.getElementById('prev-button').classList.add('hidden');
    document.getElementById('next-button').classList.add('hidden');
    document.getElementById('submit-button').classList.add('hidden');
}
