const editor = document.getElementById('editor');//歡迎出題
const addOptionButton = document.getElementById('add-option');//新增選項按鈕
const optionsContainer = document.getElementById('options');//選項容器
const quizTitleInput = document.getElementById('question-input');//題目輸入框
const quizDescriptionInput = document.getElementById('slide-title');//題目輸入框
const singleChoice = document.getElementById('option1');//單選按鈕
const fillInAnswer = document.getElementById('option2');//填空按鈕
const singlechoicecontainer = document.getElementById('single-choice-container');//單選容器
const fillinanswercontainer = document.getElementById('fill-in-the-blank-container');//填空容器
const optiontext = document.getElementById('optiontext');//選項文字
//測試用
const username = sessionStorage.getItem('username');
editor.textContent += username;


function updateQuizType() {
    if (singleChoice.checked) {
        singlechoicecontainer.style.display = 'block';
        fillinanswercontainer.style.display = 'none';
        optiontext.style.display = 'block';
    } else if (fillInAnswer.checked) {
        singlechoicecontainer.style.display = 'none';
        fillinanswercontainer.style.display = 'block';
        optiontext.style.display = 'none';
    } 
}
singleChoice.addEventListener('change', updateQuizType);
fillInAnswer.addEventListener('change', updateQuizType);
// 獲取時間限制輸入框
const timeLimitInput = document.getElementById('timeLimit');

// 添加事件監聽器
timeLimitInput.addEventListener('input', function() {
    // 將值轉換為整數
    const value = parseInt(this.value, 10);

    // 檢查輸入的值是否超過 300
    if (value > 300) {
        this.value = 300; // 如果超過，設置為 300
    }
    else if (value < 0) {
        this.value = 0; // 如果小於 0，設置為 0
    }
});



// 初始化第一個選項
createInitialOption();

addOptionButton.addEventListener('click', createNewOption);                                    

function createInitialOption() {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option-container');
    optionDiv.id = 'option-container';

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = '選項';
    optionInput.className = 'option-input';
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '刪除';
    deleteButton.classList.add('delete-option');
    deleteButton.onclick = function() {
        deleteOption(deleteButton);
    };

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(deleteButton);
    optionsContainer.appendChild(optionDiv);
}

// 創建新的選項
function createNewOption() {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option-container');

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = '選項';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '刪除';
    deleteButton.classList.add('delete-option');
    deleteButton.onclick = function() {
        deleteOption(deleteButton);
    };

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(deleteButton);
    optionsContainer.appendChild(optionDiv);
}

// 刪除選項
function deleteOption(button) {
    const optionDiv = button.parentElement;
    const allOptions = optionsContainer.getElementsByClassName('option-container');
    console.log("optionDiv: ", optionDiv);
    // 確保至少有一個選項
    if (allOptions.length > 1) {
        optionsContainer.removeChild(optionDiv);
    } else {
        alert("至少需要一個選項！");
    }
}


//存檔 待修改
const saveButton = document.getElementById('savebtn');
        saveButton.addEventListener('click', function() {
        updateSlideById(this.currentSlideIndex, this.slides);
        });

//----------------畫布程式碼---------------------

class PPTEditor {
    constructor() {
        this.slides = [{
            id: 1,
            question_type: 'single',
            option_amount: 3,
            title: '',
            option: [],
            answer: '',
            limit_time: 0,
        }];
        this.currentSlideIndex = 0;
        
        

        this.init();
        this.setupInputListeners();
    }

    setupInputListeners() {
        const quizTitleInput = document.getElementById('question-input');
        const singleChoice = document.getElementById('option1'); // 單選按鈕      
        const fillInAnswer = document.getElementById('option2'); // 填空按鈕
        const addOptionButton = document.getElementById('add-option');
        const optionsContainer = document.getElementById('options');//選項的容器(包含選項和刪除按鈕)
        const slideElement = document.querySelector('.slide-thumbnail');//縮略圖

        // 更新標題
        quizTitleInput.addEventListener('input', () => {
        this.updateSlideQuestion(this.currentSlideIndex, quizTitleInput.value);
        });

        // 更新題目種類（綁定事件時只提供函數參考，不要執行）
        singleChoice.addEventListener('change', () => {
            this.updateSlideQuestionType(this.currentSlideIndex);
        });

        fillInAnswer.addEventListener('change', () => {
            this.updateSlideQuestionType(this.currentSlideIndex);
        });

        // 更新選項數量
        addOptionButton.addEventListener('click', () => {
            this.updateSlideOptionAmount(this.currentSlideIndex, this.slides[this.currentSlideIndex].option_amount + 1);
        });
        optionsContainer.addEventListener('click', (event) => {
            if(event.target.classList.contains('delete-option') && this.slides[this.currentSlideIndex].option_amount > 1) {
                console.log('刪除選項');
                this.updateSlideOptionAmount(this.currentSlideIndex, this.slides[this.currentSlideIndex].option_amount - 1);
            }
        });
        

    }
        
    updateSlideQuestion(id, newQuestion){
        const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);     
        update_slide.title = newQuestion;
    }
    
    updateSlideQuestionType(id) {
        const singleChoice = document.getElementById('option1');
        const fillInAnswer = document.getElementById('option2');

        let question_type = '';
        if (singleChoice.checked) {
            question_type = 'single';
        } else if (fillInAnswer.checked) {
            question_type = 'fill-in';
        }

        const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
        if (update_slide) {
            update_slide.question_type = question_type;
            console.log(`ID ${id} 的題目種類已更新為：${question_type}`, this.slides);
        } else {
            console.log(`找不到 ID ${id} 的資料！`);
        }
    }

    // 更新編輯器中的選項數量
    updateSlideOptionAmount(id, newOptionAmount) {
        const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
        
        if (update_slide) {
            update_slide.option_amount = newOptionAmount;
            console.log(`ID ${id} 的選項數量已更新！`, this.slides);
        } else {
            console.log(`找不到 ID ${id} 的資料！`);
        }
    }
    // 更新編輯器中的選項內容
    updateSlideOption(id, newOption) {
        const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
        
        if (update_slide) {
            update_slide.option = newOption;
            console.log(`ID ${id} 的選項已更新！`, this.slides);
        } else {
            console.log(`找不到 ID ${id} 的資料！`);
        }
    }
    // 更新編輯器中的答案
    updateSlideAnswer(id, newAnswer) {
        const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
        
        if (update_slide) {
            update_slide.answer = newAnswer;
            console.log(`ID ${id} 的答案已更新！`, this.slides);
        } else {
            console.log(`找不到 ID ${id} 的資料！`);
        }
    }
    // 更新編輯器中的時間限制
    updateSlideTimeLimit(id, newTimeLimit) {
        const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
        
        if (update_slide) {
            update_slide.limit_time = newTimeLimit;
            console.log(`ID ${id} 的時間限制已更新！`, this.slides);
        } else {
            console.log(`找不到 ID ${id} 的資料！`);
        }
    }
    // 更新編輯器中的選項版面
    // updateQuizType() {
    //     if (singleChoice.checked) {
    //         singlechoicecontainer.style.display = 'block';
    //         fillinanswercontainer.style.display = 'none';
    //         optiontext.style.display = 'block';
    //     } else if (fillInAnswer.checked) {
    //         singlechoicecontainer.style.display = 'none';
    //         fillinanswercontainer.style.display = 'block';
    //         optiontext.style.display = 'none';
    //     } 
    // }
    

    init() {
        console.log('init');
        console.log(this.slides);
        this.addSlideBtn = document.getElementById('addSlideBtn');
        this.slidesList = document.getElementById('slidesList');
        this.slideEditor = document.getElementById('slideEditor');
        this.quizTitleInput = document.getElementById('question-input');

        this.addSlideBtn.addEventListener('click', () => this.addSlide());

        this.quizTitleInput.addEventListener('input', (e) => {
            const currentSlide = this.slides[this.currentSlideIndex];
            currentSlide.title = e.target.value;
            
            // 更新編輯器中的標題
            const titleElement = this.slideEditor.querySelector('.slide-title');
            if (titleElement) {
                titleElement.innerText = e.target.value;
            }
            
            // 重新渲染預覽圖
            this.updateSlidePreview(this.currentSlideIndex);
        });

        this.renderSlides();
        this.renderCurrentSlide();
    }
    
    

    // 新增更新預覽圖的方法
    updateSlidePreview(index) {
        const slideElement = this.slidesList.children[index];
        if (slideElement) {
            const canvas = slideElement.querySelector('.preview-canvas');
            if (canvas) {
                this.generatePreview(this.slides[index], canvas);
            }
        }
    }

    generatePreview(slide, canvas) {
        console.log('generatePreview');
        const ctx = canvas.getContext('2d');
        const scale = canvas.width / 1100; // 假設編輯器寬度為1100px

        // 清空畫布
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 計算水平中心位置
        const centerX = canvas.width / 2;

        // 繪製標題
        ctx.fillStyle = 'black';
        ctx.textAlign = "center"; // 水平置中
        ctx.textBaseline = "middle"; // 垂直置中
        ctx.font = `${60 * scale}px Arial`;
        ctx.fillText(slide.title, centerX, 100 * scale);

    }

    addSlide() {
        console.log('addSlide');
        const newSlide = {
            id: this.slides.length + 1,
            question_type: 'single',
            option_amount: 3,
            title: '',
            option: [],
            answer: '',
            limit_time: 0,
        };
        this.slides.push(newSlide);
        // this.currentSlideIndex = this.slides.length - 1;
        this.renderSlides();
        this.renderCurrentSlide();
    }

    deleteSlide(index) {
        console.log('deleteSlide');
        if (this.slides.length > 1) {
            this.slides.splice(index, 1);
            if (this.currentSlideIndex >= this.slides.length) {
                this.currentSlideIndex = this.slides.length - 1;
            }
            this.renderSlides();
            this.renderCurrentSlide();
        }
    }

    moveSlide(index, direction) {
        console.log('moveSlide');
        if (direction === 'up' && index > 0) {
            [this.slides[index], this.slides[index - 1]] = [this.slides[index - 1], this.slides[index]];
            // this.currentSlideIndex = index - 1;
        } else if (direction === 'down' && index < this.slides.length - 1) {
            [this.slides[index], this.slides[index + 1]] = [this.slides[index + 1], this.slides[index]];
            // this.currentSlideIndex = index + 1;
        }
        this.renderSlides();
        // this.renderCurrentSlide();
    }
    // 生成縮略圖
    renderSlides() {
        console.log('renderSlides');    
        this.slidesList.innerHTML = '';
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `slide-thumbnail ${index === this.currentSlideIndex ? 'active' : ''}`;
            
            // 創建縮略圖容器結構
            slideElement.innerHTML = `
                <div class="thumbnail-header">
                    <span>${index+1}</span>
                    <div class="slide-controls">
                        <button class="control-btn" onclick="pptEditor.moveSlide(${index}, 'up')" 
                            ${index === 0 ? 'disabled' : ''}>↑</button>
                        <button class="control-btn" onclick="pptEditor.moveSlide(${index}, 'down')"
                            ${index === this.slides.length - 1 ? 'disabled' : ''}>↓</button>
                        <button class="control-btn delete-btn" onclick="pptEditor.deleteSlide(${index})">×</button>
                    </div>
                </div>
                <canvas class="preview-canvas" width="200" height="120"></canvas>
            `;

            // 生成預覽
            const canvas = slideElement.querySelector('.preview-canvas');
            this.generatePreview(slide, canvas);
            
            const singleChoice = document.getElementById('option1');//單選按鈕
            const fillInAnswer = document.getElementById('option2');//填空按鈕
            const currentSlide = this.slides[this.currentSlideIndex];

            // 綁定點擊預覽圖事件(換頁)
            slideElement.addEventListener('click', () => {
                this.currentSlideIndex = index;
                // 重置題目輸入框內容
                const update_slide = this.slides.find(update_slide => update_slide.id === this.currentSlideIndex + 1);
                if(update_slide.question_type === 'single') {
                    singleChoice.checked = true;
                    fillInAnswer.checked = false;
                } else if(update_slide.question_type === 'fill-in') {
                    fillInAnswer.checked = true;
                    singleChoice.checked = false;
                }
                quizTitleInput.value = update_slide.title;
                updateQuizType();    
                console.log('slide-click');
                // this.saveCurrentSlideData();
                this.renderSlides();
                this.renderCurrentSlide();
                console.log(this.currentSlideIndex, index, currentSlide.title, this.slides);
            });
            this.slidesList.appendChild(slideElement);
        });
    }
            
    renderCurrentSlide() {
        console.log('renderCurrentSlide');
        const currentSlide = this.slides[this.currentSlideIndex];
        if (!currentSlide) return;

        this.slideEditor.innerHTML = `
            <div class="slide-title" contenteditable="true">${currentSlide.title}</div>
        `;

        // 重置單選選項        
        const optionsContainer = document.getElementById('options');
        const allOptions = optionsContainer.querySelectorAll('.option-container');
        // 刪除多餘的選項
        for (let i = 1; i < allOptions.length; i++) {
            console.log("刪除節點：", allOptions[i]);
            optionsContainer.removeChild(allOptions[i]);    
        }
        // 新增不足的選項
        for (let i = 1; i < currentSlide.option_amount; i++) {
            createNewOption();
        }

        const titleElement = this.slideEditor.querySelector('.slide-title');
        //重置題目輸入框內容
        quizTitleInput.value = this.slides[this.currentSlideIndex].title;

        const updatePreview = () => {
            const thumbnails = document.querySelector('.slide-thumbnail active');
            const canvas = thumbnails[this.currentSlideIndex].querySelector('.preview-canvas');
            this.generatePreview(currentSlide, canvas);
        };

        // 為標題添加編輯事件
        titleElement.addEventListener('focus', () => {
            titleElement.classList.add('editing');
            console.log(this.currentSlideIndex);
        });

        titleElement.addEventListener('input', () => {
            // console.log('title-input');
            this.slides[this.currentSlideIndex].title = titleElement.innerText;
            quizTitleInput.value = titleElement.innerText;
            updateSlideQuestion(this.currentSlideIndex, titleElement.innerText);
            function updateSlideQuestion(id, newQuestion) {       
                const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
                
                if (update_slide) {
                    update_slide.title = newQuestion;
                    console.log(`ID ${id} 的題目已更新！`, slides);
                } else {
                    console.log(`找不到 ID ${id} 的資料！`);
                }
            }
            updatePreview();
        });
        titleElement.addEventListener('blur', () => {
            // updateSlideQuestion(this.currentSlideIndex, titleElement.innerText);
            console.log(this.slides);

            // function updateSlideQuestion(id, newQuestion) {       
            //     const update_slide = this.slides.find(update_slide => update_slide.id === id + 1);
                
            //     if (update_slide) {
            //         update_slide.title = newQuestion;
            //         console.log(`ID ${id} 的題目已更新！`, slides);
            //     } else {
            //         console.log(`找不到 ID ${id} 的資料！`);
            //     }
            // }
        });
        
        
        

        // 根據右邊輸入題目更改畫布題目
        quizTitleInput.addEventListener('blur', function() {
            // const update_slide = this.slides.find(slide => update_slide.id === index);
            // update_slide.title = titleElement.innerText;
            // updateSlideQuestion(2, "修改後的新題目內容");
            // console.log(this.slides);
            // titleElement.classList.add('editing');
            // titleElement.innerText = this.value;
            // currentSlide.title = this.value;
            // updatePreview();
        })
    }
    
}

// 初始化編輯器
const pptEditor = new PPTEditor();