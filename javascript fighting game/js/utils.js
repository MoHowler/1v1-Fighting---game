function rectangularCollision({rectangle1, rectangle2}) {
	  return(
	  	rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
		rectangle1.attackBox.position.x <= rectangle2.position.x + enemy.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}

function determineWinner({player, enemy, timerId}) {
	clearTimeout(timerId)
	document.querySelector('#displayText').style.display = 'flex';
	if(player.health === enemy.health) {
		document.querySelector('#displayText').innerHTML = "DRAW";
	} else if (player.health > enemy.health) {
		document.querySelector('#displayText').innerHTML = "YOU WIN";
	} else if (player.health < enemy.health) {
		document.querySelector('#displayText').innerHTML = " YOU LOSE"
	}
}

let timer = 60;
let timerId;
function decreaseTimer(){
	timerId = setTimeout(decreaseTimer, 1000)
	if (timer > 0) {
		timer --;
		document.querySelector('#timer').innerHTML = timer;
	}
	if (timer === 0){
		determineWinner({player, enemy, timerId});
  }
}