/**
	* @class Audio
	* @classdesc Creates an Audio Element with the specified source.
	* @constructor
	* @param {string} soundID - The filename of the audio source. Currently must be an mp3 file.
*/
window.Audio = function(soundID)
{

	var sound = document.createElement("Audio");
	sound.setAttribute("id",soundID);
	sound.src = "sound/"+soundID+".mp3";
	sound.preload = "auto";
	sound.autoplay = false;
	sound.loop = false;

	/**
		* Plays the sound when the browser knows it can play through without stopping
	*/
	this.play = function()
	{
		sound.oncanplaythrough = sound.play();
	}

	/**
		* Pauses the sound at the current frame
	*/
	this.pause = function()
	{
		sound.pause();
	}

	/**
		* Stops the sound
	*/
	this.stop = function()
	{
		sound.pause();
		sound.currentTime = 0;
	}

	/**
		* Loops the sound when the browser knows it can play through without stopping
	*/
	this.loop = function()
	{
		sound.loop = true;
		sound.oncanplaythrough = sound.play();
	}

	/**
		* Loops the sound at a random interval when the browser knows it can play through without stopping
	*/
	this.randomLoop = function()
	{
		sound.oncanplaythrough = sound.play();
		sound.addEventListener('ended',function(){
			if (this.resetTimeout == undefined) this.resetTimeout = setTimeout(function()
			{
				sound.oncanplaythrough = sound.play();
				console.log("restarted: " +soundID);
			},Math.random()*1500);
		});		
	}
}