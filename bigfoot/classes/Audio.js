window.Audio = function(soundID)
{

	var sound = document.createElement("Audio");
	sound.setAttribute("id",soundID);
	sound.src = "sound/"+soundID+".mp3";
	sound.preload = "auto";
	sound.autoplay = false;
	sound.loop = false;

	this.play = function()
	{
		sound.oncanplaythrough = sound.play();
		console.log("playing: "+soundID);
		console.log(sound.parentNode);
		//sound.onended = sound.parentNode.removeChild(sound);
		//console.log("removed: "+soundID);
	}
	this.pause = function()
	{
		sound.pause();
		console.log(soundID+"is paused");
	}
	this.stop = function()
	{
		sound.pause();
		sound.currentTime = 0;
		console.log(soundID+"has been stopped");
	}
	this.loop = function()
	{
		sound.loop = true;
		sound.oncanplaythrough = sound.play();
	}
}