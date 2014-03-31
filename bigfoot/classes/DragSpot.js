window.DragSpot = function(xPos,yPos,w,h)
{
	//init code here
	this.position = getCorrectedPosition({x:xPos,y:yPos});
	this.size = getCorrectedSize({width:w,height:h});
	this.slottedBlock = undefined;

	console.log(this);
}