window.Cutscene = function(timestamp)
{
	this.timestamp = timestamp;

	this.lastTime = 0;
	//will eventually be made up of spritenode objects
	this.sprites = {
		man:{
			image:"man.png",
			pos:{x:100,y:100},
			isOnScreen:true
		},
		duck:{
			image:'duck.png',
			pos:{x:1000,y:100},
			isOnScreen:false
		}
	};
	this.movements = [
		{
			sprite:this.sprites.man,
			startingPos:{x:100,y:100},
			endingPos:{x:1000,y:500},
			startTime:1000,
			endTime:4000,
			isPlaying:false,
			isAnimated:false,
			isOver:false,
			movementIsOver:function()
			{

			}
		}
	];
	this.init = function()
	{

	}
	this.update = function(frame,ctx)
	{
		var ts = frame.timestamp;
		var currentTime = ts - this.timestamp;

		//currentTime/=10;
		currentTime*= .001;

		deltaTime = currentTime - this.lastTime;

		for(var i in this.movements)
		{
			var cm = this.movements[i];

			if (!cm.isPlaying && currentTime >= cm.startTime)
			{
				console.log('startMovement');
				cm.isPlaying = true;
				if (cm.isAnimated)
				{
					cm.sprite.play();
				}

			}
			else if (cm.isPlaying && currentTime >= cm.endTime){
				console.log('endmovement');
				cm.isPlaying = false;
			}
			else if (cm.isPlaying && !cm.isOver)
			{
				//move the movement
				//get destination vector and scale by block speed
				var idealVec = getSubtractedVector(cm.startingPos,cm.endingPos);
				var totalLength = getMagnitude(idealVec);
				var totalTime = cm.endTime - cm.startTime;
				var newMag = (deltaTime*totalLength)/totalTime;
				//arbitrary block speed
				idealVec = getNormalizedVector(idealVec);
				idealVec = getScaledVector(idealVec,newMag);

				cm.sprite.pos.x += idealVec.x;
				cm.sprite.pos.y += idealVec.y;
			}

		}

		//draw sprites
		for (var key in this.sprites) {
		  if (this.sprites.hasOwnProperty(key)) {
		    //set starting position if necessary
		    var s = this.sprites[key];
		    if (s.isOnScreen)
		    {
		    	//draw the thing
		    	ctx.fillStyle="#000";
		    	//temp draw
		    	ctx.fillRect(s.pos.x,s.pos.y,50,50);

		    	//will be replaced by s.draw
		    }
		  }
		}

		this.lastTime = currentTime;
		}
};