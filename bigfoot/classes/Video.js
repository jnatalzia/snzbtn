window.Video = function(canvas,ctx,videoID)
{
	var Video = function()
	{
		var video = document.createElement("Video");
		video.setAttribute("id",videoID);
		video.src = "video/"+videoID+".mp4";
		w = video.clientWidth;
		h = video.clientHeight;
		canvas.width = w; 
		canvas.height = h;
	}
	this.update = function()
	{
		//drawEffect();
	}
	this.drawEffect = function()
	{ 
		var invert = document.querySelector('#invert').checked;
		var desaturate = document.querySelector('#desaturate').checked;
		var sepia = document.querySelector('#sepia').checked;
		var tint = document.querySelector('#tint').checked;
		var tintcolor = +document.querySelector('#tintcolor').value; 
		var noise = document.querySelector('#noise').checked;
		var shiftrgb = document.querySelector('#shiftrgb').checked;
		var emboss = document.querySelector('#emboss').checked;
		
	
		
		ctx.drawImage(video, 0, 0, w, h);
		var imageData = ctx.getImageData(0, 0, w, h);
		
		var data = imageData.data;
		var length = data.length;
		var width = imageData.width;
		
		
		// emboss
		if (emboss){
			// Loop through the subpixels, convoluting each using an edge-detection matrix.
			for(var i = 0; i < length; i++) {
				if( i%4 == 3 ) continue;
				data[i] = 127 + 2*data[i] - data[i + 4] - data[i + width*4];
			}
		}
			
		
		// Iterate through each pixel, inverting it
		for (var i = 0; i < length; i +=4) 
		{
			
			// invert
			if(invert)
			{
				var red = data[i], green = data[i+1], blue = data[i+2];
				data[i] = 255 - red; 
				data[i+1] = 255 - green; 
				data[i+2] = 255 - blue;
			}
			
			
			// desaturate
			if(desaturate)
			{
				var red = data[i], green = data[i+1], blue = data[i+2];
				// var v = (red + green + blue)/3;
				// weighted average
				var v = red*0.21 + green*0.71 + blue*0.07;  
				data[i]   = v; 
				data[i+1] = v; 
				data[i+2] = v; 
			}
			
			if(sepia)
			{
				var red = data[i], green = data[i+1], blue = data[i+2];
				data[i]  = (red * .393) + (green *.769) + (blue * .189)
				data[i + 1] = (red * .349) + (green *.686) + (blue * .168)
				data[i + 2] = (red * .272) + (green *.534) + (blue * .131)
			}
			
			
			// shift red/green/blue
			if(shiftrgb)
			{
				var red = data[i], green = data[i+1], blue = data[i+2];
				data[i] = green 
				data[i+1] = blue; 
				data[i+2] = red;
			}
			
			// noise
			if(noise && Math.random() < .1)
			{
				data[i] = data[i +1] = data[i+2] = 0;
			}
			
			// tint
			if(tint)
			{
				data[i + tintcolor] = data[i + tintcolor] + 30;  
			}
		}
		ctx.putImageData(imageData, 0, 0);
		requestAnimationFrame(drawEffect);
	}


	this.play = function()
	{
		video.oncanplaythrough = video.play()
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