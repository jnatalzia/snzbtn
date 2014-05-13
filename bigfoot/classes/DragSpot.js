/**
	* @class DragSpot
	* @classdesc Creates a spot on the screen that the user will drag an object to for interaction.
	* @constructor
	* @param {string} xPos - 'X' Position of the spot.
	* @param {string} yPos - 'Y' Position of the spot.
	* @param {string} w - Width of the spot.
	* @param {string} h - Height of the spot.
*/
window.DragSpot = function(xPos,yPos,w,h)
{
	//init code here
	this.position = getCorrectedPosition({x:xPos,y:yPos});
	this.size = getCorrectedSize({width:w,height:h});
	this.slottedBlock = undefined;

	//console.log(this);
}