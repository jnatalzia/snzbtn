window.SpriteNode = function(src,numFrames,framesBetween,sizeV,posV,cols,rows,isOnScreen)
{
	if (src.length > 0)
	{
		this.spriteSheet = new Image();
		this.spriteSheet.src = src;
	}
	else
		this.spriteSheet = undefined;

	this.numFrames = numFrames;
	this.frameNumber = 0;
	this.frameCount = 0;
	this.framesBetween = framesBetween;
	this.isPlaying = false;
	//size is the size of each frame
	this.size = getCorrectedSize(sizeV);
	this.originalSize = sizeV;
	this.pos = getCorrectedPosition(posV);

	this.numColumns = cols;
	this.numRows = rows;
	this.isOnScreen = isOnScreen;

	this.draw = function(ctx)
	{
		if (this.isOnScreen)
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
			var sx = this.originalSize.width * (this.frameNumber%this.numColumns);
			var sy = this.originalSize.height * Math.floor(this.frameNumber/this.numColumns);


			if (this.spriteSheet != undefined)
				ctx.drawImage(this.spriteSheet,sx,sy,this.originalSize.width,this.originalSize.height,this.pos.x,this.pos.y,this.size.width,this.size.height);
			else
			{

			}
		}
	}

	this.play = function(){
		this.isPlaying = true;
	}

	this.stop = function()
	{
		this.isPlaying = false;
	}
}