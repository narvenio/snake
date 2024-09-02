// Definir los elemenos HTML
const board = document.getElementById(`game-board`);
const instructionText = document.getElementById(`instruction-text`);
const logo = document.getElementById(`logo`);
const highScoreText = document.getElementById(`highScore`);
const score = document.getElementById(`score`);


// definir variables del juego
const gridSize = 20;
let snake = [
    { x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = `up`;
let GameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;



// dibujar mapa, snake y comida
function draw() {
    board.innerHTML = ``; // resetear el mapa
    drawSnake();
    drawFood();
    updateScore();
    updateScoreHighScore()
}

// draw snake
function drawSnake () {
    snake.forEach((segment) => {
        const snakeElement = createGameElement(`div`,
             `snake`); // esto crea una "funcion" que hara un div con un class llamado "snake"
             setPosition(snakeElement, segment);
             board.appendChild(snakeElement); // agrega en "board" el snakeElement 
             //                                    osea el "snake"
    })
}

// crear la serpiente o la comida/div
function createGameElement(tag, className) { // funcion que hace el "snake"
    const element = document.createElement(tag); // aqui "element" crea un tag (div)
    element.className = className;              // aqui crea un classname (clase) 
    return element  // como se relaciona con "snakeElement" el "tag" y "classname" 
    //                 que usaran es "div" y "snake"    
}

// colocar la posicion de snake o comida
function setPosition(element, position) { 
    
    element.style.gridColumn = position.x;
    element.style.gridRow  = position.y;
    
    // el element crea en position x un estilo css
}   //                                      de un grid column
// y position.x esta con "element" que a la vez se relaciona con "drawSnake" poque esta
// en el forEach... que a su vez esta en la posicion x del "snake"

// testing draw function
//draw();

function drawFood(){ // aqui "dibuja" la comida
    if(gameStarted){
        const foodElement = createGameElement(`div`, `food`);
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
    
}

function generateFood(){ // Generar la comida
    const x = Math.floor(Math.random() * gridSize) + 1;// crea un numero random para la posicion x
    const y = Math.floor(Math.random() * gridSize) + 1;// crea un numero random para la posicion y
    return {x, y};
}

// movimiento de snake
function move() {
    const head= {...snake[0] };
    switch (direction){
        case `up`:
            head.y--;
            break;

        case `down`:
            head.y++;
            break; 

        case `left`:
            head.x--;
            break;

        case `right`:
            head.x++
            break;        
                
    }
    snake.unshift(head) // el "unshift" agrega el objeto al principio del array
                        // en este caso la "cabeza" se agrega al principio del
                        // array de la "snake"

//    snake.pop();        // el "pop" elimina el ultimo elemento de un array y lo devuelve  

    if(head.x === food.x && head.y === food.y){ // si la cabeza de la serpiente toca la comida:
        food = generateFood(); // se genera una nueva comida
        increaseSpeed();
        clearInterval(GameInterval);
        GameInterval = setInterval(() =>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay); // cuando sucesa se añade un delay cada vez que lo haga
    }else { // sino 
        snake.pop(); // puede moverse normalmente 
    }
}   

// comenzar juego
function startGame() { // funcion "comenzar juego"
    gameStarted = true;// si queremos comenzar, pausar o detener el juego
    instructionText.style.display = `none`; // usamos el DOM para añadir un estilo css y
    logo.style.display = `none`; // decimos que ya no se muestren (display = `none`)
    GameInterval = setInterval(() => { // cuando iniciemos
        move(); // llamamos al "movimiento"
        checkCollision(); // llamamos a las collisiones
        draw(); // llamamos a que se dibujen los objetos en pantalla
    }, gameSpeedDelay);
}

// eventos con los botones
function handleKeyPress(event) {
    if (
    (!gameStarted && event.code === `Space`) ||
    (!gameStarted && event.key === ` `)) // si el juego no ha iniciado(! = no) y
    {                                   // si presionamos "barra espaciadora" entonces:
                                           
        startGame();
    }else {
        switch (event.key){
            case `ArrowUp`:
                direction = `up`;
                break;

            case `ArrowDown`:
                direction = `down`;
                break;

            case `ArrowLeft`:
                direction = `left`;
                break;

            case `ArrowRight`:
                direction = `right`;
                break;   
        }
    }
} 

document.addEventListener(`keydown`, handleKeyPress);

function increaseSpeed(){
    console.log(gameSpeedDelay); // mostrar el delay del juego
    if (gameSpeedDelay > 150) { // esto es para aumentar la velocidad del juego
        gameSpeedDelay -=5;     // a medida de que comas mas "food"
           
    } else if (gameSpeedDelay > 100){
        gameSpeedDelay -=3;

    } else if (gameSpeedDelay > 50){
        gameSpeedDelay -=2;
    }    
      else if (gameSpeedDelay > 25){
        gameSpeedDelay -=1;
    }
              
}

function checkCollision() {
    const head = snake[0];

    if( head.x < 1 || head.x > gridSize || head.y < 1 ||
        head.y > gridSize) { // si la cabeza choca con la pared o es mas grande que los muros:
            resetGame();
        }
 
    for (let i = 1; i < snake.length; i++ ) { // si el cuerpo de la serpiente es menor a 1:
        if (head.x === snake[i].x && head.y === snake[i].y){
            resetGame();                      // reiniciar juego
        }
    }   
     
}

function resetGame(){
    //updateHighScore();
    //stopGame();
    snake = [{x: 10, y: 10 }]
    food = generateFood();
    direction = `right`;
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, `0`); // se cambia el text "score"
}                                           // por la puntuacion actual pero como es un numero
                                            // se convierte a string y con "padStart" se añaden
                                            // 3 "0".


function stopGame(){
    clearInterval(GameInterval);
   gameStarted = false;
   instructionText.style.display = `block`;
   logo.style.display = `block`;

}
function updateScoreHighScore(){
    const currentScore = snake.length -1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, `0`);
    }
    highScoreText.style.display = `block`;
}
// test moving
//setInterval(() =>{
//    move(); // asi se movera
//    draw(); // dibuja una nueva posicion, esto si o si se debe colocar para funcionar
//}, 200);

