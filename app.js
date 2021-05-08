// ISSUES :
//gloomy music is not gloomy
//attribution functionality isn't implemented yet
//loading seems clunky

const container = document.getElementById("container");
const meditateButton = document.getElementById("meditate");
const counter = document.getElementsByClassName("counter");
const stopMeditationButton = document.getElementById("stop-meditation");

let counterMinutes = document.getElementsByClassName("minutes");
let counterSeconds = document.getElementsByClassName("seconds");

//minutesGiven = default number of minutes
//numberOfSeconds = how many seconds are in a minute; strict for debugging
//seconds = total amount of seconds depending on minutes
//oneMinute = seconds that will be decremented
//lastMinute = a save for the last number of minutes selected; minutesGiven will be altered in the startTimer function
//givenInterval = variable for setInterval function
let minutesGiven = 2, numberOfSeconds = 60, seconds = minutesGiven * numberOfSeconds;
let oneMinute = -1, lastMinute = minutesGiven, givenInterval;

const twoMinutesButton = document.getElementById("b-1");
const fiveMinutesButton = document.getElementById("b-2");
const tenMinutesButton = document.getElementById("b-3");

const rainyButton = document.getElementById("t-1");
const sunnyButton = document.getElementById("t-2");
const gloomyButton = document.getElementById("t-3");

const sunnyAttr = document.getElementById("sunny-attr");
const gloomyAttr = document.getElementById("gloomy-attr");

const audioRainy = new Audio("songs/rainy.mp3");
const audioSunny = new Audio("songs/sunny.mp3");
const audioGloomy = new Audio("songs/gloomy.mp3");

const progressBar = document.querySelector('.progress');
let lastProgressChecked;
progressBar.style.animationDuration = "120s";

//default settings
counterMinutes[0].innerHTML = '0' + minutesGiven;
counterSeconds[0].innerHTML = "00";
container.classList.add("rainy-background");

//used to reset the counter
function reset(){
    //Resetting the animation
    progressBar.style.display = "none";
    progressBar.offsetWidth;
    progressBar.style.display = "flex";
    progressBar.style.animationDuration = lastProgressChecked;
    progressBar.style.animationPlayState = "initial";
    //upon resetting we want our decremented seconds to be at -1 (see at StartTimer explanation)
    oneMinute = -1;
    //minutesGiven is altered; retriving the initial value selected by the user (or by default)
    minutesGiven = lastMinute;
    //same as minutesGiven
    seconds = minutesGiven * numberOfSeconds;
    //initial seconds upon reset should be '00'
    counterSeconds[0].innerHTML = '00';

    //instead of "07:00" it will display "07:00" except for numbers greater than 9
    if(lastMinute < 10){
        counterMinutes[0].innerHTML = '0' + minutesGiven;
    } else {
        counterMinutes[0].innerHTML = minutesGiven;
    }
}

//user selection of time
function howMuchTime(){
    twoMinutesButton.addEventListener("click", () => {
        //setting the duration for the progress bar
        progressBar.style.animationDuration = "120s";
        lastProgressChecked = "120s";
        //minutes selected stored in lastMinute since minutesGiven might be altered
        lastMinute = 2;
        //Making sure the music starts at the beginning since this is not paused
        stopMusic();
        //another time is picked, we reset the counter
        reset();
        //in case the Meditation button is active
        stopMyMeditation();
    })

    fiveMinutesButton.addEventListener("click", () => {
        progressBar.style.animationDuration = "300s";
        lastProgressChecked = "300s";
        lastMinute = 5;
        stopMusic();
        reset();
        stopMyMeditation();
    })

    tenMinutesButton.addEventListener("click", () => {
        progressBar.style.animationDuration = "600s";
        lastProgressChecked = "600s";
        lastMinute = 10;
        stopMusic();
        reset();
        stopMyMeditation();
    })
}

//Selecting the type of meditation
function whatMood(){
    rainyButton.addEventListener("click", () => {
        //making sure the other background are removed
        sunnyAttr.style.display = "none";
        gloomyAttr.style.display = "none";
        container.classList.remove("sunny-background");
        container.classList.remove("gloomy-background");
        container.classList.add("rainy-background");
        //identically, we want to reset everything if the type is changed
        stopMusic();
        reset();
        stopMyMeditation();
    })

    sunnyButton.addEventListener("click", () => {
        sunnyAttr.style.display = "flex";
        gloomyAttr.style.display = "none";
        container.classList.remove("rainy-background");
        container.classList.remove("gloomy-background");
        container.classList.add("sunny-background");
        stopMusic();
        reset();
        stopMyMeditation();
    })

    gloomyButton.addEventListener("click", () => {
        sunnyAttr.style.display = "none";
        gloomyAttr.style.display = "flex";
        container.classList.remove("rainy-background");
        container.classList.remove("sunny-background");
        container.classList.add("gloomy-background");
        stopMusic();
        reset();
        stopMyMeditation();
    })
}

function startTimer(){
    //More details for my zero-brain days
    // | |
    // | |
    //  V
    //oneMinute represents 60 seconds, obviously
    //each action requires one second so the total amount of seconds will be decremented everytime by 1
    //starting at -1 to enter the else statement: for 5:00 for example it must immediately drop to 4:59
    //when oneMinute is above 0 it means we still have seconds to show, thus when reaching 0 it will print it and then the next time the function is called the variable will go to the value of 59
    //after a while I will probably think to myself : why not 60?
    //because your 60 is 00. ===> 05:00 meaning 300seconds  ===> 4:59 meaning 299seconds
    //4:00 meaning 240seconds ===> 3:59 meaning 239seconds

    //if we still have seconds to be counted
    if(seconds > 0){
        //the seconds that will be decremented must be above 0
        if(oneMinute > 0){
            //59 58 57 56...
            oneMinute--;
            //also dropping the total amount of seconds for the first if
            seconds--;
        } else {
            //if we reached 00 seconds we drop one minute, plus one second
            minutesGiven--;
            seconds--;
            //I need to check this again
            //the seconds that will be decremented will start at 59 since 00:00 is the 60th second
            oneMinute = numberOfSeconds - 1;
        }
    } else {
        //if there are no seconds left to count it means the timer reached the end
        //resetting the timer and button functionality
        reset();
        stopMyMeditation();
        //making sure the code below is not executed
        return;
    }

    //dinamically displaying the timer (7:00 ---> 07:00)
    if(minutesGiven < 10){
        counterMinutes[0].innerHTML = '0' + minutesGiven;
    } else {
        counterMinutes[0].innerHTML = minutesGiven;
    }

    if(oneMinute < 10){
        counterSeconds[0].innerHTML = '0' + oneMinute;
    } else {
        counterSeconds[0].innerHTML = oneMinute;
    }

}

//first function for the meditate button
function startMeditation(){
    meditateButton.addEventListener('click', startMyMeditation);
}

//upon pressing the meditate button it will call this function
function startMyMeditation(){
    //run the progress bar
    progressBar.style.animationPlayState = "running";
    //setting our button to Pause
    meditateButton.innerHTML = "Pause";
    //every 1s the function will be called
    givenInterval = setInterval(startTimer, 1000);
    //music starts when pressing the button
    playMusic();
    //its no longer a start button
    meditateButton.removeEventListener('click', startMyMeditation);
    //if pressed again, it will call stopMyMeditation function
    meditateButton.addEventListener('click', stopMyMeditation);
}

//pressing Pause calls this function
function stopMyMeditation(){
    //stop the progress bar
    progressBar.style.animationPlayState = "paused";
    //resetting the button to start
    meditateButton.innerHTML = "Meditate";
    //this time we want to pause the music
    pauseMusic();
    //pausing the startTimer function
    clearInterval(givenInterval);
    //now the meditate button will have its initial functionality
    startMeditation();
}

//playing music according to the mood
function playMusic(){
    if(container.classList.contains("rainy-background")){
        audioRainy.play();
    } else if(container.classList.contains("sunny-background")){
        audioSunny.play();
    } else if(container.classList.contains("gloomy-background")){
        audioGloomy.play();
    }
}

function pauseMusic(){
    audioRainy.pause();
    audioSunny.pause();
    audioGloomy.pause();
}

function stopMusic(){
    audioRainy.currentTime = 0;
    audioSunny.currentTime = 0;
    audioGloomy.currentTime = 0;
}

const preload = document.getElementById("preloader");

//for the preload animation
function load(){
    window.addEventListener('load', () => {
        preload.classList.add("preloader-class");
    })
}

//main function
function meditationApp(){
    load();
    howMuchTime();
    whatMood();
    startMeditation();
}

meditationApp();