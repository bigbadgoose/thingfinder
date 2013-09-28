var angleMemory = -1,
	rotation = 0;

function onDeviceOrientation(dataEvent) {
	if (dataEvent.alpha !== angleMemory) {
		var angle = dataEvent.alpha,
			deltaAngle,
			text = '';

		if (angle < 68 || angle > 292) {
			text += 'NORTH';
		} else if (angle > 112 && angle < 248) {
			text += 'SOUTH';
		}
		if (angle > 22 && angle < 158) {
			text += 'EAST';
		} else if (angle > 202 && angle < 338) {
			text += 'WEST';
		}

		deltaAngle = angleMemory - angle;
		
		if (Math.abs(deltaAngle) > 180) {
			if (deltaAngle > 0) {
				rotation -= ((360 - angleMemory) + angle);
			} else {
				rotation += (angleMemory + (360 - angle));
			}
		} else {
			rotation += deltaAngle;
		}

		angleMemory = angle;

		$('#direction').text(text);
		$("#angle").html(Math.round(angle) + "<sup>o</sup>");
		$('#rotation').css('-webkit-transform', 'rotate(' + rotation + 'deg)');
	}
}

function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  console.log('dLat: ', dLat);
  console.log('dLon: ', dLon);
  
  var d = R * c; // Distance in km
  return d;
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function heartbeat() {
	return setInterval(function() {
		window.navigator.geolocation.getCurrentPosition(function(pos) {
		  var km = distance(pos.coords.longitude, pos.coords.latitude, -122.08, 37.43);
		  km = Math.round(km * 100) / 100;
		  $('#distance').html(km + ' km');	 
		});
	}, 1000);
}

function startSensor() {
	window.addEventListener("deviceorientation", onDeviceOrientation, false);
}

function stopSensor() {
	window.removeEventListener("deviceorientation");
}


//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
};

$(document).ready(function() {
	var heartbeatId = null;
	
	$('#two').bind('pageshow', function() {
		heartbeatId = heartbeat();
		startSensor();
	});
	
	$('#two').bind('pagehide', function() {
		clearInterval(heartbeatId);
		stopSensor();
		$('#distance').html('Loading...');
		$('#direction').html('Loading...');
		$('#angle').html('Loading...');
	});	
});


$(document).bind('pageinit', init);