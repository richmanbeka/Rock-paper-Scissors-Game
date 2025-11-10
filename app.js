let userScore = 0;
let computerScore = 0;
let rounds = 5;
let currentRound = 0;
let playerName = "You";
let choiceTimer;
const TIMER_SECONDS = 5;

const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const result_div = document.querySelector(".result p");
const restart_btn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start-btn");

const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");
const roundButtons = document.querySelectorAll(".round-btn");
const playerInput = document.getElementById("player-name");
const actionMessage = document.getElementById("action-message");
const leaderboardDiv = document.getElementById("leaderboard");

const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");
const drawSound = new Audio("sounds/draw.mp3");

function getComputerChoice() {
    const choices = ['r','p','s'];
    return choices[Math.floor(Math.random()*3)];
}

function convert(letter) {
    if(letter==='r') return "Rock";
    if(letter==='p') return "Paper";
    return "Scissors";
}

function win(user, comp){
    winSound.play();
    userScore++;
    userScore_span.textContent = userScore;
    result_div.textContent = `${playerName} beats ${convert(comp)}. You win! 🎉`;
    document.getElementById(user).classList.add("win-glow");
    setTimeout(()=>document.getElementById(user).classList.remove("win-glow"),400);
}

function lose(user, comp){
    loseSound.play();
    computerScore++;
    computerScore_span.textContent = computerScore;
    result_div.textContent = `${convert(comp)} beats ${playerName}. You lose! ❌`;
    document.getElementById(user).classList.add("lose-glow");
    setTimeout(()=>document.getElementById(user).classList.remove("lose-glow"),400);
}

function draw(user, comp){
    drawSound.play();
    result_div.textContent = `${convert(user)} equals ${convert(comp)}. It's a draw. ⚖️`;
    document.getElementById(user).classList.add("draw-glow");
    setTimeout(()=>document.getElementById(user).classList.remove("draw-glow"),400);
}

function game(userChoice){
    clearInterval(choiceTimer); 
    if(currentRound >= rounds) return;

    currentRound++;
    const computerChoice = getComputerChoice();

    switch(userChoice + computerChoice){
        case "rs": case "pr": case "sp": win(userChoice, computerChoice); break;
        case "rp": case "ps": case "sr": lose(userChoice, computerChoice); break;
        default: draw(userChoice, computerChoice);
    }

    if(currentRound === rounds) endGame();
    else startTimer(); 
}

function endGame(){
    let finalMessage = '';
    if(userScore>computerScore) finalMessage="🎊 You won the match!";
    else if(userScore<computerScore) finalMessage="💻 Computer wins the match!";
    else finalMessage="🤝 It's a tie!";
    result_div.textContent = finalMessage;
    restart_btn.style.display = "inline-block";
    saveScore();
    displayLeaderboard();
}

function restartGame(){
    userScore = 0;
    computerScore = 0;
    currentRound = 0;
    userScore_span.textContent = 0;
    computerScore_span.textContent = 0;
    result_div.textContent = "Make your move.";
    restart_btn.style.display = "none";
    actionMessage.textContent = "";
    leaderboardDiv.innerHTML = "";
    document.querySelector(".round-selector").style.display = "block";
    document.querySelector(".start-container").style.display = "block"; 
}

function startGame(){
    document.querySelector(".round-selector").style.display = "none";
    document.querySelector(".start-container").style.display = "none";
    startTimer();
}

function startTimer(){
    let timeLeft = TIMER_SECONDS;
    actionMessage.textContent = `You have ${timeLeft} seconds...`;
    clearInterval(choiceTimer);

    choiceTimer = setInterval(()=>{
        timeLeft--;
        actionMessage.textContent = `You have ${timeLeft} seconds...`;
        if(timeLeft <= 0){
            clearInterval(choiceTimer);
            autoChoose();
        }
    }, 1000);
}

function autoChoose(){
    const choices = ['r','p','s'];
    const userChoice = choices[Math.floor(Math.random()*3)];
    game(userChoice);
}

if(playerInput){
    playerInput.addEventListener("change", ()=>{
        playerName = playerInput.value || "You";
    });
}

function saveScore(){
    const scores = JSON.parse(localStorage.getItem("rps-leaderboard")) || [];
    scores.push({ player: playerName, score: userScore });
    scores.sort((a,b)=>b.score - a.score);
    localStorage.setItem("rps-leaderboard", JSON.stringify(scores.slice(0,5)));
}

function displayLeaderboard(){
    const scores = JSON.parse(localStorage.getItem("rps-leaderboard")) || [];
    if(!leaderboardDiv) return;
    leaderboardDiv.innerHTML = "<h3>Leaderboard</h3>" + scores.map(s=>`<p>${s.player}: ${s.score}</p>`).join("");
}

function main(){
    rock_div.addEventListener("click",()=>game("r"));
    paper_div.addEventListener("click",()=>game("p"));
    scissors_div.addEventListener("click",()=>game("s"));

    startBtn.addEventListener("click", startGame);
    restart_btn.addEventListener("click", restartGame);

    roundButtons.forEach(btn=>{
        btn.addEventListener("click",()=>{
            rounds = parseInt(btn.dataset.rounds);
            restartGame();
        });
    });
}

main();



