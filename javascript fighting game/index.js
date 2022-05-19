const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite ({
	position: {
		x:0,
		y:0
	},
	imageSrc: "./Fighting Game Assets/background.png"
})

const shop = new Sprite ({
	position: {
		x:600,
		y:128
	},
	imageSrc: "./Fighting Game Assets/shop.png",
	scale: 2.75,
	framesMax: 6
})

const player = new Fighter ({
 position: {
    x:0,
    y:0
},
 velocity: {
 	x:0,
 	y:0
  },
  offset: {
  	x: 0,
  	y: 0
  },
  imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset:{x:100,y:157},
  sprites: {
  	idle:{
  	imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Idle.png", 
  	framesMax: 8
    },
    run:{
  	imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Run.png", 
  	framesMax: 8
    },
    jump:{
  	imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Jump.png", 
  	framesMax: 2
    },
    fall: {
    imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Fall.png", 
  	framesMax: 2
    },
    attack1: {
    imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/attack1.png", 
  	framesMax: 6	
    },
    takeHit: {
    imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Take Hit - white silhouette.png", 
  	framesMax: 4	
    },
    death: {
    imageSrc: "./Fighting Game Assets/samuraiMack/samuraiMack/Death.png", 
    framesMax: 6
    }  
  },
  attackBox: {
  	offset: {
  		x:100,
  		y:50
  	},
  	width: 160,
  	height: 50
  }
});

const enemy = new Fighter ({
 position: {
 	x:400,
 	y:100
 },
 velocity: {
 	x:0,
 	y:0
 },
 color: 'blue',
 	offset: {
 		x: -50,
 		y: 0	
 	},
 imageSrc: "./Fighting Game Assets/kenji/kenji/Idle.png",
     framesMax: 4,
     scale: 2.5,
     offset:{x:100,y:170},

    sprites: {
  	idle:{
  	imageSrc: "./Fighting Game Assets/kenji/kenji/Idle.png", 
  	framesMax: 4
    },
    run:{
  	imageSrc: "./Fighting Game Assets/kenji/kenji/Run.png", 
  	framesMax: 8
    },
    jump:{
  	imageSrc: "./Fighting Game Assets/kenji/kenji/Jump.png", 
  	framesMax: 2
    },
    fall: {
    imageSrc: "./Fighting Game Assets/kenji/kenji/Fall.png", 
  	framesMax: 2
    },
    attack1: {
    imageSrc: "./Fighting Game Assets/kenji/kenji/attack1.png", 
  	framesMax: 4	
    },
    takeHit: {
    imageSrc: "./Fighting Game Assets/kenji/kenji/Take hit.png", 
  	framesMax: 3	
    },
    death: {
    imageSrc: "./Fighting Game Assets/kenji/kenji/Death.png", 
    framesMax: 7
    }    
  },
    attackBox: {
  	offset: {
  		x:-170,
  		y:50
  	},
  	width: 170,
  	height: 50
  }
});

const keys = {
	a: {
		pressed : false
	},
	d: {
		pressed : false
	},
	w: {
		pressed : false
	},
	ArrowLeft: {
		pressed : false
	},
	ArrowRight: {
		pressed : false
	},
	ArrowUp: {
		pressed : false
	}
}

decreaseTimer();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	c.fillStyle = "rgba(255,255,255,0.15)";
	c.fillRect(0,0,canvas.width,canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5; 
		player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.switchSprite('run');
		} else {
		player.switchSprite('idle');
	}

	//juming/falling
		if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	//enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5; 
		enemy.switchSprite('run');
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.switchSprite('run');
	} else {
		enemy.switchSprite('idle');
	}

	   if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	  } else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}


	//detect for collision & enemy gets hit
	if(
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		player.isAttacking && player.framesCurrent === 4
		){
		enemy.takeHit();
	console.log('enemy.takeHit')
		player.isAttacking = false;
		//document.querySelector('#enemyHealth').style.width = enemy.health + "%";
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
	}

	//if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	//if player gets hit
	if(
		rectangularCollision({ 
			rectangle1: enemy,
			rectangle2: player
		}) &&
		enemy.isAttacking  && enemy.framesCurrent === 2
		){
		player.takeHit();
	console.log('player.takeHit')
		enemy.isAttacking = false;
		//document.querySelector('#playerHealth').style.width = player.health + "%";
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
	}
	//if enemy misses, sets it back to isAttacking = false
		if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}


	//end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId});
	}
  }

animate();

// read up on switch statments
window.addEventListener ('keydown', (event) => {
	if(!player.dead) {
switch (event.key) {
	case 'd':
	keys.d.pressed = true;
	player.lastKey = 'd';
	break;
	case 'a':
	keys.a.pressed = true;
	player.lastKey = 'a';
	break;
	case 'w':
	player.velocity.y = -20;
	break;
	case ' ':
	player.attack();
	break;
  }
}

	//if (!enemy.dead) {
 switch (event.key) {
  	case 'ArrowRight':
	keys.ArrowRight.pressed = true;
	enemy.lastKey = 'ArrowRight';
	break;
	case 'ArrowLeft':
	keys.ArrowLeft.pressed = true;
	enemy.lastKey = 'ArrowLeft';
	break;
	case 'ArrowUp':
	//keys.ArrowUp.pressed = true;
	enemy.velocity.y = -20;
	break;
	case 'ArrowDown':
	enemy.attack();
	break;
  }
 //}
})

window.addEventListener ('keyup', (event) => {
switch (event.key) {
	case 'd':
	keys.d.pressed = false;
	break;
	case 'a':
	keys.a.pressed = false;
	break;
	//case 'w':
	//key.w.pressed = false;
	//break;
  }
switch (event.key) {	
	case 'ArrowRight':
	keys.ArrowRight.pressed = false;
	break;
	case 'ArrowLeft':
	keys.ArrowLeft.pressed = false;
	break;
	//case 'ArrowUp':
	//keys.w.pressed = false;
	//break;
  }
});