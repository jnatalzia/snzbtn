window.SpriteNode = function(src,numFrames,framesBetween,sizeV,posV,cols,rows)
{
	this.spriteSheet = new Image();
	this.spriteSheet.src = src;
	this.numFrames = numFrames;
	this.frameNumber = 0;
	this.frameCount = 0;
	this.framesBetween = framesBetween;
	this.isPlaying = true;
	//size is the size of each frame
	this.size = sizeV;
	this.pos = posV;

	this.numColumns = cols;
	this.numRows = rows;

	this.draw = function(ctx,frame)
	{
		if (this.isPlaying)
		{
			//move the frames
			//etc
			this.frameCount++;

			if (this.frameCount % this.framesBetween ==  0)
			{
				this.frameCount = 0;
				this.frameNumber++;
			}

			this.frameNumber = this.frameNumber%this.numFrames;
		}


		//draw current frame
		var sx = this.size.width * (this.frameNumber%this.numColumns);
		var sy = this.size.height * Math.floor(this.frameNumber/this.numColumns);

		//get row
		//var sy = this.spriteSheet.height/this.size.height * Math.floor(this.spriteSheet.height/this.size.height/this.frameNumber);

		//console.log(sx + ", "  +sy);

		ctx.drawImage(this.spriteSheet,sx,sy,this.size.width,this.size.height,this.pos.x,this.pos.y,this.size.width,this.size.height);
	}

	this.play = function(){
		this.isPlaying = true;
	}

	this.stop = function()
	{
		this.isPlaying = false;
	}
}