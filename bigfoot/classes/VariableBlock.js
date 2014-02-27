window.VariableBlock = function(pos,size)
{
	this.pos = pos;
	this.size = size;
	this.displayOptions = false;
	this.optionTimer = undefined;

	this.optionBlockWidth = 150;
	this.optionBlockHeight = 40;
	this.optionBlockPadding = 20;


	this.selectedOption=undefined;

	this.startAngles = [];

	this.pointIsInside = function(pt)
	{
		return (pt.x > this.pos.x && pt.x < this.pos.x + this.size.width && pt.y > this.pos.y && pt.y < this.pos.y + this.size.height);
	}
	//test options
	this.options = [
		{
			title:"Play",
			fillColor:"#000",
			isHighlighted: false
		},
		{
			title:"Ready",
			fillColor:"#000",
			isHighlighted: false
		},
		{
			title:"Cancel",
			fillColor:"#000",
			isHighlighted: false
		},
		{
			title:"Ready",
			fillColor:"#000",
			isHighlighted: false
		},
		{
			title:"Cancel",
			fillColor:"#000",
			isHighlighted: false
		}
	];
	this.getCenterPos = function(){
		return {x:this.pos.x + (this.size.width/2),y:this.pos.y + (this.size.height/2)};
	}
	//test function
	this.sayHi = function()
	 {
	 	console.log('hi');
	 }

	 this.blockHoverTest = function (frame,ctx){
		//
		var block = this;
		//draw block
		//fix this stuff
		var wheelRadius = block.size.width+100;
		if (frame.hands.length == 1 && frame.hands[0].fingers.length == 1)
		{

			var finger = frame.hands[0].fingers[0];
			var pos = finger.stabilizedTipPosition;

			var fx = pos[0];
			var fy = pos[1];
			var fz = pos[2];
					
					
				//draw the finger on screen
			fx = map(fx,-150,150,0,browserWidth);
			fy = map(fy,100,300,0,browserHeight);

			fy = browserHeight - fy;

			if (this.pointIsInside({x:fx,y:fy}))
			{
				//console.log('works');
				setTimeout(function()
				{
					block.displayOptions = true;
				},2000);

			}


			//check to see if the person's finger is on an display option
			if (block.displayOptions)
			{
				var fAngle = angleFromPointToPoint(block.getCenterPos(),{x:fx,y:fy});

				//console.log(fAngle);

				for (var i = 0; i < block.startAngles.length; i++)
				{
					var a = block.startAngles[i];
					var na = block.startAngles[(i+1)%block.startAngles.length];
					if (na == 0 && i == block.startAngles.length - 1)
						na = Math.PI*2;

					if (fAngle > a && fAngle < na)
					{
						//highlight it!
						block.options[i].isHighlighted  = true;
					}
					else
						block.options[i].isHighlighted  = false;
				}

				//get distance from center of finger to cetner of block
				var fingVec = getSubtractedVector(block.getCenterPos(),{x:fx,y:fy});
				var fVecLen = getMagnitude(fingVec);

				if (fVecLen > wheelRadius)
				{
					var selected;
					//the person has selected an option!
					for (var i in block.options)
					{
						if (block.options[i].isHighlighted)
						{
							selected = block.options[i];
							block.displayOptions = false;
							break;
						}
					}

					//console.log(selected);
				}
			}
		}

		if (block.displayOptions)
		{
			//console.log('running');
			

			var linePoints = [];
			//log where each options' angle starts
			block.startAngles = [];
			//draw lines to options
			for (var i = 0; i < block.options.length;i++)
			{
				//get points along the circle
				var division = i/block.options.length;

				var xPos = Math.cos(Math.PI*2*division) * wheelRadius;
				var yPos = Math.sin(Math.PI*2*division) * wheelRadius;

				xPos += block.getCenterPos().x;
				yPos += block.getCenterPos().y;

				linePoints.push({x:xPos,y:yPos});
			}
			for (var i = 0; i < linePoints.length;i++)
			{
				var p = linePoints[i];
				var np = linePoints[(i+1)%linePoints.length];

				//get the size of each angle in radians
				var angleSize = Math.PI*2/linePoints.length;

				//get start and end
				var sAngle = angleSize*i;
				var eAngle = sAngle+angleSize;

				block.startAngles.push(sAngle);

				//draw arc
				ctx.strokeStyle = "#000000";
				ctx.beginPath();
				ctx.moveTo(block.pos.x + block.size.width/2,block.pos.y+ block.size.height/2);
				ctx.lineTo(p.x,p.y);
				ctx.arc(block.pos.x + block.size.width/2,block.pos.y + block.size.height/2,wheelRadius,sAngle,eAngle);
				ctx.lineTo(np.x,np.y);
				ctx.lineTo(block.pos.x + block.size.width/2,block.pos.y+ block.size.height/2);
				ctx.closePath();

				ctx.stroke();
				if (block.options[i].isHighlighted)
				{
					ctx.fillStyle = "#FF0000";
					ctx.fill();
				}

				//draw text for debugging
				ctx.fillStyle = "#000";
				ctx.font = "24pt Arial";
				ctx.textAlign = "center";

				ctx.fillText(i,p.x,p.y);

			}

			//console.log(block.startAngles);
		}
		ctx.fillStyle = "#000";
		ctx.fillRect(this.pos.x,this.pos.y,this.size.width,this.size.height);
	}


}