window.Hand = function()
{

	this.draw = function(frame,ctx)
	{
			var hand = frame.hands[0];
			var numFingers;
		if(frame.hands[0])
		{
			var fingers = hand.fingers.length;
			switch(fingers)
			{
				case 0:
					numFingers = 0;
					Hand.x = hand.palmPosition[0];
					Hand.y = hand.palmPosition[1];
					this.handPosition(Hand.x,Hand.y,numFingers);
					break;
				case 1:
					numFingers = 1;
					var f1 = hand.fingers[0];
					f1.x = f1.tipPosition[0];
					f1.y = f1.tipPosition[1];
					this.handPosition(f1.x,f1.y,numFingers);
					break;
				case 2:
					numFingers = 2;
					Hand.x = hand.palmPosition[0];
					Hand.y = hand.palmPosition[1];
					this.handPosition(Hand.x,Hand.y,numFingers);
					break;
				case 3:
					numFingers = 3;
					Hand.x = hand.palmPosition[0];
					Hand.y = hand.palmPosition[1];
					this.handPosition(Hand.x,Hand.y,numFingers);
					break;
				case 4:
					numFingers = 4;
					Hand.x = hand.palmPosition[0];
					Hand.y = hand.palmPosition[1];
					this.handPosition(Hand.x,Hand.y,numFingers);			
					break;
				case 5:
					numFingers = 5;
					Hand.x = hand.palmPosition[0];
					Hand.y = hand.palmPosition[1];
					this.handPosition(Hand.x,Hand.y,numFingers);
					break;
			}
			//console.log(numFingers);
			//console.log(handPosition);
		}
	}
	this.handPosition = function(x,y,numFingers)
	{
		var handX = map(Hand.x,-150,150,0,browserWidth);
		var handY = map(Hand.y,100,300,browserHeight,0);
		console.log("Hand x = "+handX+", Hand y = "+handY+", Fingers = "+numFingers);
	}
}

