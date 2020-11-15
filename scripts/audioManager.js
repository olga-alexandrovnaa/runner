var audioManager= {
    jumpSound: null,
    endSound: null,
    volume: 1,

    init: function () {
        this.jumpSound = new Audio("audio/coin.wav");
        this.endSound = new Audio("audio/defeat.mp3");
    },

    playEvent: function (sound){
        if (!gameManager.isGameStop){
            sound.volume = 0.5;
            sound.play();
        }
    },
};