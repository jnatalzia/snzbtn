window.Hand = function()
{
	this.size = {width:130,height:130};
	this.x = 0;
	this.y = 0;

	this.spriteSheet = new Image();
	this.spriteSheet.src = "img/hand_sprite.png";

	this.handX = 0,this.handTwoX=0;
	this.handY = 0,this.handTwoY=0;

	this.draw = function(frame,ctx)
	{
		var hand = frame.hands[0];
		var hand2 = frame.hands[1];
		var numFingers,sx,sy;
		var numFingers2,sx2,sy2;
		if(frame.hands.length == 1)
		{
			var fingers = hand.fingers.length;
			switch(fingers)
			{
				case 0:
					sx = 130;
					sy=260;
					break;
				case 1:
					sx = 260;
					sy=260;
					break;
				case 2:
					sx = 390;
					sy=260;
					break;
				case 3:
					sx = 520;
					sy=260;
					break;
				case 4:
					sx = 650;
					sy=260;		
					break;
				case 5:
					sx = 650;
					sy=130;
					break;
			}
			//console.log(numFingers);
			//console.log(handPosition);
			if (fingers != 1)
			{
				Hand.x = hand.palmPosition[0];
				Hand.y = hand.palmPosition[1];
			}
			else
			{
				Hand.x = hand.fingers[0].tipPosition[0];
				Hand.y = hand.fingers[0].tipPosition[1]-10;
			}
			this.handX = map(Hand.x,-150,150,0,browserWidth);
			this.handY = map(Hand.y,100,300,browserHeight,0);

			ctx.globalAlpha = 0.5;
			ctx.drawImage(this.spriteSheet,sx,sy,this.size.width,this.size.height,this.handX - this.size.width/2,this.handY - this.size.height/2,this.size.width,this.size.height);
			ctx.globalAlpha = 1.0;
		}
		else if (frame.hands.length == 2)
		{
			//find out which hand is more left
			var palm1 = hand.palmPosition[0];
			var palm2 = hand2.palmPosition[0];

			var lefthand = (palm1 > palm2) ? hand2 : hand;
			var righthand = (palm1 > palm2) ? hand : hand2;

			var fingersOne = righthand.fingers.length;
			var fingersTwo = lefthand.fingers.length;
			switch(fingersOne)
			{
				case 0:
					sx = 130;
					sy=260;
					break;
				case 1:
					sx = 260;
					sy=260;
					break;
				case 2:
					sx = 390;
					sy=260;
					break;
				case 3:
					sx = 520;
					sy=260;
					break;
				case 4:
					sx = 650;
					sy=260;		
					break;
				case 5:
					sx = 650;
					sy=130;
					break;
			}
			switch(fingersTwo)
			{
				case 0:
					sx2 = 130;
					sy2=780;
					break;
				case 1:
					sx2 = 260;
					sy2=780;
					break;
				case 2:
					sx2 = 390;
					sy2=780;
					break;
				case 3:
					sx2 = 520;
					sy2=780;
					break;
				case 4:
					sx2 = 650;
					sy2=780;		
					break;
				case 5:
					sx2 = 650;
					sy2 =650;
					break;
			}

			if (fingersOne != 1)
			{
				Hand.x = righthand.palmPosition[0];
				Hand.y = righthand.palmPosition[1];
			}
			else
			{
				Hand.x = righthand.fingers[0].tipPosition[0];
				Hand.y = righthand.fingers[0].tipPosition[1];
			}
			this.handX = map(Hand.x,-150,150,0,browserWidth);
			this.handY = map(Hand.y,100,300,browserHeight,0);

			if (fingersTwo != 1)
			{
				Hand.x = lefthand.palmPosition[0];
				Hand.y = lefthand.palmPosition[1];
			}
			else
			{
				Hand.x = lefthand.fingers[0].tipPosition[0];
				Hand.y = lefthand.fingers[0].tipPosition[1];
			}
			this.handTwoX = map(Hand.x,-150,150,0,browserWidth);
			this.handTwoY = map(Hand.y,100,300,browserHeight,0);

			ctx.globalAlpha = 0.5;
			ctx.drawImage(this.spriteSheet,sx,sy,this.size.width,this.size.height,this.handX - this.size.width/2,this.handY - this.size.height/2,this.size.width,this.size.height);
			ctx.drawImage(this.spriteSheet,sx2,sy2,this.size.width,this.size.height,this.handTwoX- this.size.width/2,this.handTwoY- this.size.height/2,this.size.width,this.size.height);
			ctx.globalAlpha = 1.0;
		}

		//draw current frame
	}
}

