const GAME_STATUSES = {
    RUNNING: 'running',
    PAUSED: 'paused',
    NOT_RUNNING: 'not running',
    RESETED: 'reset'
};

const state = {
    moles: [],
    score: 0,
    time: 59,
    currentMoleIndex: -1,
    status: GAME_STATUSES.NOT_RUNNING,

    setState: function (newState) {

        for (let prop in newState) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = newState[prop];
            }
        }

    },
    resetState: function () {

        this.score = 0;
        this.time = 59;
        this.currentMoleIndex = -1;
        this.status = GAME_STATUSES.NOT_RUNNING

        processMoles(this.moles, function (mole) {
            mole.classList.remove('activeMole');
        });

    }
};

function processMoles(moles, fn) {
    for (let i = 0; i < moles.length; i++) {
        fn(moles[i]);
    }
}

document.addEventListener("DOMContentLoaded", function init() {

    //get moles
    const molesList = document.getElementsByClassName("mole");
    state.setState({ moles: molesList });

    //set events
    processMoles(molesList, function (mole) {
        mole.addEventListener("click", moleClicked);
    });

});

function startGame() {

    if (state.status !== GAME_STATUSES.RUNNING) {

        state.setState({ status: GAME_STATUSES.RUNNING });
        initTimerCountDown();
        play();

    }

    function initTimerCountDown() {

        //get time indicator
        const timeElement = document.querySelector(".time");
        startTimerCountDown(state.time, timeElement);

    }

}

function play() {

    let playTimer = null;

    if (state.status !== GAME_STATUSES.RUNNING) {
        clearTimeout(playTimer);
    } else {
        playTimer = setTimeout(play, Math.floor(Math.random() * 1000) + 500);
        showRandomMole();
    }

}

function startTimerCountDown(gameTime, timeIndicator) {

    const timer = setInterval(function () {
        timeIndicator.innerHTML = '00:' + gameTime;

        //update state
        state.setState({ time: --gameTime });

        //time out or reset
        if (gameTime < 0 || state.status === GAME_STATUSES.RESETED) {
            //reset the game, timer
            stopTimerCountDown();
            state.resetState();
            resetIndicators();
        }

        //if stopped
        if (state.status === GAME_STATUSES.PAUSED) {
            stopTimerCountDown(); //stop time, game
        }

    }, 1000);

    function stopTimerCountDown() {
        clearInterval(timer);
    }

}

function showRandomMole() {
    let newRandomMoleIndex = Math.floor(Math.random() * 9);

    //check not same mole is the next mole 
    while (newRandomMoleIndex === state.currentMoleIndex) {
        newRandomMoleIndex = Math.floor(Math.random() * 9);
    }

    if (state.currentMoleIndex !== -1) {
        state.moles[state.currentMoleIndex].classList.toggle("activeMole");
    }

    state.moles[newRandomMoleIndex].classList.toggle("activeMole");
    state.setState({ currentMoleIndex: newRandomMoleIndex });
}

function resetGame() {

    if (state.status === GAME_STATUSES.PAUSED) {
        state.resetState();
        resetIndicators();
    }

    if (state.status === GAME_STATUSES.RUNNING) {
        state.setState({ status: GAME_STATUSES.RESETED });
    }

}

function resetIndicators() {

    document.querySelector(".score").innerHTML = state.score;
    document.querySelector(".time").innerHTML = state.time;

}

function stopGame() {

    if (state.status === GAME_STATUSES.RUNNING) {
        state.setState({ status: GAME_STATUSES.PAUSED });
    }

}

function moleClicked(e) {

    if (e.target.classList.contains('activeMole')) {
        state.setState({ score: ++state.score });
        document.querySelector(".score").innerHTML = state.score;
    }

}