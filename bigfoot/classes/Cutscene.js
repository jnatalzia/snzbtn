window.Cutscene = function(timestamp, movements)
{
	this.timestamp = timestamp;

	this.lastTime = 0;
	//will eventually be made up of spritenode objects
	//this.sprites = sprites;
	this.movements = movements;

	this.started = false;
	this.ended = false;

	/*[
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
	];*/

	this.init = function(timestamp)
	{
		for (var i in this.movements)
		{
			var m = this.movements[i];

			m.startingPos = getCorrectedPosition(m.startingPos);
			m.endingPos = getCorrectedPosition(m.endingPos);

			m.sprite.pos = m.startingPos;
		}

		this.timestamp = timestamp;
		this.started = true;
		this.ended = false;

	}
	this.update = function(frame,ctx)
	{
		var ts = frame.timestamp;
		var currentTime = ts - this.timestamp;

		//currentTime/=10;
		currentTime*= .001;

		var deltaTime = currentTime - this.lastTime;

		if (this.started && !this.ended)
		{

			var cutsceneOver = true;

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

					cm.sprite.draw(ctx);
				}
				else if (cm.isPlaying && currentTime >= cm.endTime){
					console.log('endmovement');
					cm.isPlaying = false;
					cm.isOver = true;
				}
				else if (cm.isPlaying && !cm.isOver)
				{
					//move the movement
					//get destination vector and scale by block speed
					var idealVec = getSubtractedVector(cm.sprite.pos,cm.endingPos);
					var totalLength = getMagnitude(idealVec);
					var totalTime = cm.endTime - currentTime;
					var newMag = (deltaTime*totalLength)/totalTime;
					//arbitrary block speed
					idealVec = getNormalizedVector(idealVec);
					idealVec = getScaledVector(idealVec,newMag);

					cm.sprite.pos.x += idealVec.x;
					cm.sprite.pos.y += idealVec.y;

					console.log(deltaTime);

					cm.sprite.draw(ctx);


				}

				if (!cm.isOver)
				{
					cutsceneOver = false;
				}

			}

			this.lastTime = currentTime;

			if (cutsceneOver)
			{
				this.ended = true;
				console.log('hit');
			}

			return cutsceneOver;
		}
	}
};