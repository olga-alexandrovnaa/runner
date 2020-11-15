var physicManager = {
    jump: function () {
    if ( Player.move_y === 570) {
        audioManager.playEvent(audioManager.jumpSound);

        for (let i = 0; i < 2; i++) {
            setTimeout(() => {Player.move_y -= 3*8*1.5;}, i * (1000 / 50)); // 3*8*1.5*2 = + 72
        }
        for (let i = 2; i < 4; i++) {
            setTimeout(() => {Player.move_y -= 2*8*1.5;}, i * (1000 / 50)); // 2*8*1.5*2 = + 48
        }
        for (let i = 4; i < 11; i++) {
            setTimeout(() => {Player.move_y -= 1*8*1.5;}, i * (1000 / 50)); // 1*8*1.5*7 = + 84
        }
        for (let i = 16; i < 25; i++) {
            setTimeout(() => {Player.move_y += 1*8*1.5;}, i * (1000 / 50)); // 1*8*1.5*9 = - 108
        }
        for (let i = 25; i < 26; i++) {
            setTimeout(() => {Player.move_y += 2*8*1.5;}, i * (1000 / 50)); // 2*8*1.5*1 = - 24
        }
        for (let i = 26; i < 28; i++) {
            setTimeout(() => {Player.move_y += 3*8*1.5;}, i * (1000 / 50)); // 3*8*1.5*2 = 72
        }
        setTimeout(() =>  1000 / 60);
    }
}
}