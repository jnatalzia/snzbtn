/**
	* @class SpriteNode
	* @classdesc Reads in a sprite sheet and plays the animation.
	* @constructor
	* @param {string} src- Source of the sprite sheet
	* @param {string} numFrames - Number of frames in the sprite sheet
	* @param {string} framesBetween - this is the number of frames between when the next frame is played. for instance if the number is 1, there is one frame played every timestep, if it's two there is 1 frame played every two timesteps
	* @param {string} sizeV - This is the size of each individual frames of the image. so if the image has 3 images per row and is 300 wide, the size vector would have a width of 100 in the form of: {width:WIDTH,height:HEIGHT}
	* @param {string} posV - This is the position of the sprite intially in the format: {x:xPos,y:yPos}
	* @param {string} cols - Number of columns in the sheet
	* @param {string} rows - Number of rows in the sheet
	* @param {string} isOnScreen - this boolean is used to determine whether the sprite should be drawn in the draw function
	* @param {string} destSize - this is the size that the image should be displayed on the screen
*/
window.SpriteNode = function(src,numFrames,framesBetween,sizeV,posV,cols,rows,isOnScreen,destSize)
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
	this.isPlaying = true;
	//size is the size of each frame
	this.size = getCorrectedSize(sizeV);
	this.originalSize = sizeV;
	this.pos = getCorrectedPosition(posV);
	this.initialPos = {x:this.pos.x,y:this.pos.y};
	if (destSize != undefined) this.destSize = getCorrectedSize(destSize);

	this.numColumns = cols;
	this.numRows = rows;
	this.isOnScreen = isOnScreen;

	this.reversed = false;

	this.alpha = 1;

	/**
		* draws the sprite sheet to the canvas
	*/
	this.draw = function(ctx)
	{
		if (this.isOnScreen)
		{
			if (this.isPlaying)
			{
				//move the frames
				//etc

				if (this.reversed)
				{
					this.frameCount++;

					if (this.frameCount % this.framesBetween ==  0)
					{
						this.frameCount = 0;
						this.frameNumber--;
					}
					if (this.frameNumber < 0) this.frameNumber = this.numFrames-1;
				}
				else
				{
					this.frameCount++;

					if (this.frameCount % this.framesBetween ==  0)
					{
						this.frameCount = 0;
						this.frameNumber++;
					}

					this.frameNumber = this.frameNumber%this.numFrames;
				}
				
			}


			//draw current frame
			var sx = this.originalSize.width * (this.frameNumber%this.numColumns);
			var sy = this.originalSize.height * Math.floor(this.frameNumber/this.numColumns);


			if (this.spriteSheet != undefined)
			{
				ctx.globalAlpha = (this.alpha<0)?0:this.alpha;
				if (this.destSize == undefined) ctx.drawImage(this.spriteSheet,sx,sy,this.originalSize.width,this.originalSize.height,this.pos.x,this.pos.y,this.size.width,this.size.height);
				else ctx.drawImage(this.spriteSheet,sx,sy,this.originalSize.width,this.originalSize.height,this.pos.x,this.pos.y,this.destSize.width,this.destSize.height);
				ctx.globalAlpha = 1;
			}
			else
			{

			}
		}
	}

	/**
		* Plays the sprite animation
	*/
	this.play = function(){
		this.isPlaying = true;
	}

	/**
		* Stops the sprite animations
	*/
	this.stop = function()
	{
		this.isPlaying = false;
	}
}