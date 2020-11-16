var canvas = document.getElementById("canvasId");
var ctx = canvas.getContext("2d");

var gameManager = {
    factory: {},
    entities: [],
    player: null,
    bonus: null,
    level: 1.2,
    players_steps: 0,
    isGameStop: 0,
    initPlayer: function (obj) {
        this.player = obj;
    },

    draw: function (ctx) {
        for (let e = 0; e < this.entities.length; e++){
                ctx.drawImage(this.entities.e)

        }

    },

    renderRecordsTable: function () {
        const container = document.getElementById('table');
        container.childNodes.forEach((o) => container.removeChild(o));

        const playerName = localStorage.getItem('gamer_name');
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const currentPlayer = players.find((p) => p.name === playerName);
        if (currentPlayer) {
            if (gameManager.players_steps > currentPlayer.score) currentPlayer.score = gameManager.players_steps;
        } else {
            players.push({
                name: localStorage.getItem('gamer_name'),
                score: gameManager.players_steps,
            });
        }
        players.sort((a, b) => a.score < b.score);
        localStorage.setItem('players', JSON.stringify(players));

        const table = document.createElement('table');
        table.classList.add('table');

        players.forEach((player) => {
            const row = document.createElement('tr');
            Object.entries(player).forEach((entry) => {
                const column = document.createElement('td');
                column.textContent = entry[1];
                row.append(column);
            });
            table.append(row);
        });

        container.append(table);
    },

    gameStop: function (){
        audioManager.playEvent(audioManager.endSound);
        gameManager.isGameStop = 1;
        ctx.fillStyle = 'teal';
        ctx.globalAlpha = 0.7; //прозрачность
        ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 70);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = '50px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Конец Игры!', canvas.width / 2, canvas.height / 2);
        gameManager.renderRecordsTable();
    },

    gameloop: function (){
        if(!gameManager.isGameStop) {
            mapManager.view.x += 1;
            mapManager.draw(ctx);
            Player.draw(ctx);
            for (const Bad of gameManager.entities) {
                Bad.move_x -= 12 + gameManager.level;
                Bad.draw(ctx);
            }
            gameManager.bonus.move_x -= 12 + gameManager.level;
            gameManager.bonus.draw(ctx);
            if (gameManager.entities[0].move_x < -400) {
                let delBad = gameManager.entities[0];
                gameManager.entities.splice(0, 1);
                delBad.move_x = 800;
                delBad.symb = delBad.getBad();
                gameManager.entities.push(delBad);
                if (gameManager.players_steps === 0) {
                    gameManager.players_steps = 4;
                } else {
                    gameManager.players_steps += 1;
                }
                gameManager.level += 0.3;
                document.getElementById("speed").innerHTML = "Текущая скорость: " + Math.ceil(gameManager.level);
                document.getElementById("level").innerHTML = "Текущий уровень: " + gameManager.players_steps;
            }

            if (gameManager.bonus.move_x < -400) {
                gameManager.bonus.move_x = 2000;
            }

            if ((Player.move_y) > gameManager.bonus.move_y - 50) {
                if (Math.abs(Player.move_x - gameManager.bonus.move_x) < 64 ) {
                    Player.protection = true;
                }
            }

            if ((Player.move_y) > gameManager.entities[0].move_y - 50) {
                if (Math.abs(Player.move_x - gameManager.entities[0].move_x) < 32 ) {
                    if(Player.protection){
                        Player.protection = false;
                    }else{
                        gameManager.gameStop();
                    }
                }
            }
            if ((Player.move_y) > gameManager.entities[1].move_y - 50) {
                if (Math.abs(Player.move_x - gameManager.entities[1].move_x) < 32 ) {
                    if(Player.protection){
                        Player.protection = false;
                    }else{
                        gameManager.gameStop();
                    }
                }
            }
            if ((Player.move_y) > gameManager.entities[2].move_y - 50) {
                if (Math.abs(Player.move_x - gameManager.entities[2].move_x) < 32 ) {
                    if(Player.protection){
                        Player.protection = false;
                    }else{
                        gameManager.gameStop();
                    }
                }
            }
            setInterval(this.gameloop, 50);
        }
    },

    loadAll: function () {
        mapManager.loadMap("maps/map.json");
        spriteManager.loadAtlas("sprites/bad.json", "sprites/bad.png");
        gameManager.factory['hero']= Player;
        gameManager.factory['Bad'] = Bad;
        gameManager.factory['Bonus'] = Bonus;
        Player.protection = false;
        let Bad1 = Object.create(gameManager.factory["Bad"]);
        Bad1.move_x = 800;
        Bad1.move_y = 570;
        Bad1.symb = "122";
        gameManager.entities.push(Bad1);
        let Bad2 = Object.create(gameManager.factory["Bad"]);
        Bad2.move_x = 1200;
        Bad2.move_y = 570;
        Bad2.symb = "122";
        gameManager.entities.push(Bad2);
        let Bad3 = Object.create(gameManager.factory["Bad"]);
        Bad3.move_x = 1600;
        Bad3.move_y = 570;
        Bad3.symb = "122";
        gameManager.entities.push(Bad3);
        gameManager.bonus = Object.create(gameManager.factory["Bonus"]);
        gameManager.bonus.move_x = 2000;
        gameManager.bonus.move_y = 570;
        mapManager.parseEntities();
        eventsManager.setup(ctx);
        audioManager.init()

    },
};

var name = localStorage.getItem("gamer_name");
gameManager.loadAll();
gameManager.gameloop();
