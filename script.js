let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;
let timeLeft = 900;

let quizStarted = false; // Biến để kiểm tra xem bài thi đã bắt đầu hay chưa
let timerStarted = false;
let pass = document.getElementById('name');



setInterval(removeLocal, 30 * 60 * 1000);

function removeLocal() {
    localStorage.clear();
}

function startQuiz() {
    if (!quizStarted) {

        if (pass.value === 'minhquan' || pass.value === 'thuky' || pass.value === 'minhquan11' || pass.value === 'minhquan99' || pass.value === 'thuky22' || pass.value === 'thuky88') {
            const value = localStorage.getItem(pass.value);
            if (value != null) {
                alert('Bạn đã hoàn thành bài thi này rồi !!!')
                return
            }
            pass.classList.add('hidden')
            quizStarted = true;
            document.getElementById('start-button').classList.add('hidden'); // Ẩn nút "Bắt đầu"

            startTimer(); // Bắt đầu thời gian chạy nếu chưa bắt đầu
            timerStarted = true;

            displayQuestion(); // Hiển thị câu hỏi đầu tiên
        } else {
            alert('Mật khẩu nhập sai rồi !!!')
        }

    }
}

function shuffleArrayOriginal(array) {
     for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, 10);
}
function shuffleArray(array) {
    // for (let i = array.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    // }
    return array.slice(0, 10);
}
function shuffleArray1(array) {
    // for (let i = array.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    // }
    return array.slice(11, 21);
}
function shuffleArray2(array) {
    // for (let i = array.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    // }
    return array.slice(21, 32);
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('start-button').addEventListener('click', () => {
        let typeToan = document.getElementById('type-toan');
        const selectedType = typeToan.options[typeToan.selectedIndex].value;
        let pass1 = document.getElementById('name');
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                if (selectedType == 'toanso') {
                    questions = shuffleArray(data.filter(item => !item.img || item.img.trim() === ''));
                   
                } else if (selectedType == 'toanhinh') {
                    questions = shuffleArray(data.filter(item => item.img && item.img.trim() !== '')); // Xáo trộn mảng câu hỏi
                } else {
                     if(pass1 == 'minhquan') {
                         questions = shuffleArray(data); // Xáo trộn mảng câu hỏi
                    }else if(pass1 == 'minhquan11') {
                         questions = shuffleArray1(data); // Xáo trộn mảng câu hỏi
                    }else if(pass1 == 'minhquan99'){
                         questions = shuffleArray2(data); // Xáo trộn mảng câu hỏi
                    }else{
                     questions = shuffleArrayOriginal(data); 
                     }
                   
                }

                displayQuestion();
                startTimer();
            })
            .catch(error => {
                console.error('Error loading the questions:', error);
            });
    });

});

function displayQuestion() {
    if (!quizStarted) {
        return; // Nếu bài thi chưa bắt đầu, không hiển thị câu hỏi
    }
    const questionContainer = document.getElementById('question-container');
    const imgContainer = document.getElementById('img-container');
    questionContainer.innerHTML = '';

    imgContainer.innerHTML = '';
    const questionObj = questions[currentQuestionIndex];
    const questionImg = questionObj.img;
    console.log(questionImg)
    if (questionImg == "") {
        imgContainer.style.display = 'none';
    } else {
        imgContainer.style.display = 'inline';
    }
    const img = document.createElement('img');
    img.src = questionObj.img;
    img.alt = 'Beautiful Landscape';
    img.width = 500;
    img.height = 350;
    //<img src="image.jpg" alt="Example Image" width="300" height="200">

    const questionElement = document.createElement('div');
    questionElement.textContent = questionObj.question;
    questionContainer.appendChild(questionElement);
    imgContainer.appendChild(img);

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
    localStorage.setItem(pass.value, pass.value);
    let timeQuiz = 900 - timeLeft;
    console.log(timeQuiz)
    console.log(timeLeft)
    let diemTG = 50
    if (timeQuiz > 600 && timeQuiz <= 650) {
        diemTG = 45
    } else if (timeQuiz > 650 && timeQuiz <= 700) {
        diemTG = 40
    } else if (timeQuiz > 700 && timeQuiz <= 750) {
        diemTG = 35
    } else if (timeQuiz > 750 && timeQuiz <= 800) {
        diemTG = 30
    } else if (timeQuiz > 800) {
        diemTG = 25
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

    const now = new Date();
    var ten = 'Su';
    if (pass.value === 'minhquan' || pass.value === 'minhquan11' || pass.value === 'minhquan99') {
        ten = 'Bắp'
    }


    (function () {
        emailjs.init("GPE50WaijWrm35Nfj");
    })();

    var templateParams = {
        sendername: 'Khoi Tran',
        to: 'khoitn1129@gmail.com',
        subject: `Kết Quả bài thi của ${ten}`,
        replyto: 'noreply@gmail.com',
        message: `KẾT QUẢ BÀI THI CỦA ${ten} NHƯ SAU: 
        
        `,
        tg: `Thời gian làm bài lúc: ${now}`,
        diem: `Điểm của ${ten} là:  ${diem}`,
        score: `Số câu trả lời đúng là: ${score} `

    };
    var service_id = 'service_pwl8wtg'
    var template_id = 'template_742s3dt'

    emailjs.send(service_id, template_id, templateParams)
        .then(function (response) {
            alert('Email đã được gửi thành công!', response.status, response.text);
        }, function (error) {
            alert('Gửi email thất bại...', error);
        });

}
