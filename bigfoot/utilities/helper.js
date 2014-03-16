function getCorrectedPosition(pos)
{
	var newpos = {x:0,y:0};

	var ratio = {width:window.innerWidth/1920,height:window.innerHeight/1080};

	newpos.x = pos.x * ratio.width;
	newpos.y = pos.y * ratio.height;

	return newpos;
}
function getCorrectedSize(size)
{
	var newsize = {width:0,height:0};

	var ratio = {width:window.innerWidth/1920,height:window.innerHeight/1080};

	newpos.width = size.width * ratio.width;
	newpos.height = size.height * ratio.height;

	return newsize;
}