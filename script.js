const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');
const mono = document.getElementById('mono');
const duo = document.getElementById('duo');
const tetra = document.getElementById('tetra');
const quadro = document.getElementById('quadro');

const me = document.getElementById('me');
const ready = document.getElementById('ready');

let readyCheck = false; //отвечает за начало партии (ждёт, пока ты расставишь свои кораблики)

const game = {
    ships: [],
    shipCount: 0,
    optionShip: {
        count: [1, 2, 3, 4],
        size: [4, 3, 2, 1],
    },
    collision: new Set,
    generateShip() {
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];
                const ship = this.generateOptionShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionShip(shipSize) {
        const ship = {
            hit: [],
            location: [],
        };

        const direction = Math.random() < 0.5;
        let x, y;

        if (direction) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * (10 - shipSize));
        } else {
            x = Math.floor(Math.random() * (10 - shipSize));
            y = Math.floor(Math.random() * 10);
        }

        for (let i = 0; i < shipSize; i++) {
            if (direction) {
                ship.location.push('' + x + (y + i));
            } else {
                ship.location.push('' + (x + i) + y);
            }
            ship.hit.push('');
        }

        if (this.checkCollision(ship.location)) {
            return this.generateOptionShip(shipSize);
        }

        this.addCollision(ship.location);

        return ship;
    },

    checkCollision(location) {
        for (const coord of location) {
            if (this.collision.has(coord)) {
                return true;
            }
        }
    },

    addCollision(location) {
        for (let i = 0; i < location.length; i++) {
            const startCoordX = location[i][0] - 1;
            for (let j = startCoordX; j < startCoordX + 3; j++) {
                const startCoordY = location[i][1] - 1;
                for (let k = startCoordY; k < startCoordY + 3; k++) {
                    if (j >= 0 && j < 10 && k >= 0 && k < 10) {
                        const coord = j + '' + k;
                        this.collision.add(coord);
                    }
                }
            }
        }
    }
}
const mygame = {
    ships: [],
    shipCount: 0,
    optionShip: {
        count: [1, 0, 0, 0],
        size: [1, 2, 3, 4],
    },


    collision: new Set,
    generateShip() {
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];
                const ship = this.generateOptionShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionShip(shipSize) {
        const ship = {
            hit: [],
            location: [],
        };

        const direction = Math.random() < 0.5;
        let x, y;

        if (direction) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * (10 - shipSize));
        } else {
            x = Math.floor(Math.random() * (10 - shipSize));
            y = Math.floor(Math.random() * 10);
        }

        for (let i = 0; i < shipSize; i++) {
            if (direction) {
                ship.location.push('m' + x + (y + i));
            } else {
                ship.location.push('m' + (x + i) + y);
            }
            ship.hit.push('');
        }

        if (this.checkCollision(ship.location)) {
            return this.generateOptionShip(shipSize);
        }

        this.addCollision(ship.location);

        return ship;
    },

    checkCollision(location) {
        for (const coord of location) {
            if (this.collision.has(coord)) {
                return true;
            }
        }
    },

    addCollision(location) {
        for (let i = 0; i < location.length; i++) {
            const startCoordX = location[i][1] - 1;
            for (let j = startCoordX; j < startCoordX + 3; j++) {
                const startCoordY = location[i][2] - 1;
                for (let k = startCoordY; k < startCoordY + 3; k++) {
                    if (j >= 0 && j < 10 && k >= 0 && k < 10) {
                        const coord = 'm' + j + '' + k;
                        this.collision.add(coord);
                    }
                }
            }
        }
    }
}

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
    shot: 0,
    hit: 0,
    dead: 0,
    mono: game.optionShip.count[3],
    duo: game.optionShip.count[2],
    tetra: game.optionShip.count[1],
    quadro: game.optionShip.count[0],

    set updateData(data) {
        this[data] += 1;
        this.render();
    },
    render() {
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
        mono.textContent = this.mono;
        duo.textContent = this.duo;
        tetra.textContent = this.tetra;
        quadro.textContent = this.quadro;
    }
};

const show = {
    hit(elem) {
        this.changeClass(elem, 'hit');
    },
    miss(elem) {
        this.changeClass(elem, 'miss')
    },
    dead(elem) {
        this.changeClass(elem, 'dead')
    },
    changeClass(elem, value) {
        elem.className = value;
    }
};

const paintItMiss = (id) => {
    const ordinat = div(parseInt(id, 10), 10);
    const abciss = mod(parseInt(id, 10), 10);
    for(let i = -1; i<=1; i++){
        if((ordinat + i) < 0 || (ordinat + i) > 9) continue;

        for(let j = -1; j<=1; j++){
            if((abciss + j) < 0 || (abciss + j) > 9) continue;
            if(i === j === 0) continue;
            show.miss(document.getElementById('' + (ordinat + i) + (abciss + j)))
        }
    }
}

const paintMyMiss = (id) => {
    const ordinat = div(parseInt(id.substring(1, 3), 10), 10);
    const abciss = mod(parseInt(id.substring(1, 3), 10), 10);
    for(let i = -1; i<=1; i++){
        if((ordinat + i) < 0 || (ordinat + i) > 9) continue;

        for(let j = -1; j<=1; j++){
            if((abciss + j) < 0 || (abciss + j) > 9) continue;
            if(i === j === 0) continue;

            show.miss(document.getElementById('m' + (ordinat + i) + (abciss + j)))
        }
    }
}

const fire = (event) => {
    const target = event.target;

    if (readyCheck == true) {
        if (target.classList.length > 0) return                     //отвечает за то, что эту клетку ещё не тыкали и в противном случае выкидывает из функции
        if (event.path[0].nodeName == 'TD' && game.shipCount > 0) { //штука которая проверяет на наличие статуса мисс и то что это клетка, а не ебучий столбец или строка
            show.miss(target);
            play.updateData = 'shot';
        }

        for (let i = 0; i < game.ships.length; i++) {
            const ship = game.ships[i];
            const index = ship.location.indexOf(target.id);

            if (index != -1 && game.shipCount > 0) {
                show.hit(target);

                play.updateData = 'hit';

                ship.hit[index] = 1;                            //поставить 1 типа мы попали но пока хз убили или нет
                const alive = ship.hit.indexOf('');

                if (alive == -1) {                              //проверяем, что мы попали по всем клеткам корабля

                    play.updateData = 'dead';                   //обновляем счётчик потопленных не странице
                    game.shipCount -= 1;                        //уменьшаем кол-во кораблей так как только что его убили

                    for (const id of ship.location) {
                        paintItMiss(id);                        //красим все клетки вокруг уничтоженного
                    }

                    for (const id of ship.location) {
                        show.dead(document.getElementById(id))  //меняем все иконки на смерть
                    }

                    if (ship.location.length == 1) { play.mono -= 1; play.render() }
                    if (ship.location.length == 2) { play.duo -= 1; play.render() }
                    if (ship.location.length == 3) { play.tetra -= 1; play.render() }
                    if (ship.location.length == 4) { play.quadro -= 1; play.render() }

                    if (!game.shipCount) {                      //когда победа
                        header.textContent = 'Фига ты крутой';
                        header.style.color = 'red';

                        if (play.shot < play.record || play.record === 0) {     //установка рекорда
                            localStorage.setItem('seaBattleRecord', play.shot);
                            play.record = play.shot;
                            play.render();
                        }
                    }
                    return 
                }return
            } 
        }
        generateFire();
    }
}

const myfire = (event) => {         //огонь по мне
    console.log(event + 'ebennet');
    console.log(mygame.ships);

    if (readyCheck == true) {
        if (mygame.shipCount > 0) { //штука которая проверяет на наличие статуса мисс и то что это клетка, а не ебучий столбец или строка
            show.miss(document.getElementById(event));
            play.updateData = 'shot';
        }


        for (let i = 0; i < mygame.ships.length; i++) {
            const ship = mygame.ships[i];
            console.log(ship + i);
            const index = ship.location.indexOf(event);

            if (index != -1 && game.shipCount > 0) {
                show.hit(document.getElementById(event));
                play.updateData = 'hit';

                ship.hit[index] = 1;                            //поставить 1 типа мы попали но пока хз убили или нет
                const alive = ship.hit.indexOf('');

                if (alive == -1) {                              //проверяем, что мы попали по всем клеткам корабля

                    play.updateData = 'dead';                   //обновляем счётчик потопленных не странице
                    mygame.shipCount -= 1;                        //уменьшаем кол-во кораблей так как только что его убили

                    for (const id of ship.location) {
                        paintMyMiss(id);                        //красим все клетки вокруг уничтоженного
                    }

                    for (const id of ship.location) {
                        show.dead(document.getElementById(id))  //меняем все иконки на смерть
                    }

                    if (!mygame.shipCount) {                      //когда победа
                        header.textContent = 'Лол, тебя компик обыграл';
                        header.style.color = 'red';

                        if (play.shot < play.record || play.record === 0) {     //установка рекорда
                            localStorage.setItem('seaBattleRecord', play.shot);
                            play.record = play.shot;
                            play.render();
                        }
                    }
                    generateFire();
                    return
                }
                generateFire();
                return
            }
        }
    }

}

const init = () => {

    enemy.addEventListener('click', fire);

    play.render();
    game.generateShip();
    mygame.generateShip();

    again.addEventListener('click', () => {
        location.reload();
    });

    ready.addEventListener('click', () => {
        readyCheck = true;
    });

    record.addEventListener('dblclick', () => {
        localStorage.clear();
        play.record = 0;
        play.render();
    })
};

function div (a, b) {
    return (a - a % b) / b;
};

function mod (a, b) {
    return a % b;
}

let generateFire = () => {

    let answerFire = 'm' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
    console.log(answerFire);

    console.log(document.getElementById(answerFire).classList.length > 0);
    if (document.getElementById(answerFire).classList.length > 0) {
        return generateFire()
    }
    myfire(answerFire);
}

init();