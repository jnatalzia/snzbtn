window.Audio = function(soundId)
{

	var sound = document.createElement("Audio");
	sound.setAttribute("id",soundID);
	sound.src = "sound/"+soundID+".mp3";
	sound.preload = "auto";
	sound.autoplay = false;

	this.play = function()
	{
		sound.oncanplaythrough = sound.play();
		console.log("playing: "+soundID);
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
}