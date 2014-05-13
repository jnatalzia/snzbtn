/**
	* @class Video
	* @classdesc Creates an Video Element with the specified source.
	* @constructor
	* @param {string} videoID - The filename of the audio source. Currently must be an mp4 file.
*/
window.Video = function(canvas,ctx,videoID)
{
		var video = document.createElement("Video");
		video.setAttribute("id",videoID);
		video.src = "video/"+videoID+".mp4";


		var cw = Math.floor(canvas.clientWidth);  
   		var ch = Math.floor(canvas.clientHeight);  
   		canvas.width = cw;  
   		canvas.height = ch;  
   		video.addEventListener('play', function(){  
    		draw(this,ctx,cw,ch);  
   			},false);  

  	function draw(v,c,w,h) 
  	{  
   		if(video.paused || video.ended) return false;  
   		c.drawImage(v,0,0,w,h);  
   		setTimeout(draw,20,v,c,w,h);  
	}

	/**
		* Plays the video when the browser knows it can play through without stopping
	*/
	this.play = function()
	{
		//this.drawEffect();
		video.oncanplaythrough = video.play();
	}

	/**
		* Pauses the video at the current frame
	*/
	this.pause = function()
	{
		video.pause();
	}

	/**
		* Stops the video
	*/
	this.stop = function()
	{
		video.pause();
		video.currentTime = 0;
	}

	/**
		* Loops the video when the browser knows it can play through without stopping
	*/
	this.loop = function()
	{
		video.loop = true;
		video.oncanplaythrough = video.play();
	}
}