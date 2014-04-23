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

	this.play = function()
	{
		//this.drawEffect();
		video.oncanplaythrough = video.play();
	}


	this.pause = function()
	{
		video.pause();
	}


	this.stop = function()
	{
		video.pause();
		video.currentTime = 0;
	}

	
	this.loop = function()
	{
		video.loop = true;
		video.oncanplaythrough = video.play();
	}
}