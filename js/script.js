/* Author: Rochester Oliveira

*/
$(function(){
	if (Modernizr.localstorage) {
		// window.localStorage is available, so we can play a game
		box0 = $("#box-0");
		box1 = $("#box-1");
		box2 = $("#box-2");
		box3 = $("#box-3");
		clickbox0 = $("#box-click-0");
		clickbox1 = $("#box-click-1");
		clickbox2 = $("#box-click-2");
		clickbox3 = $("#box-click-3");
		clickbox0.click(
			function(event){
				event.preventDefault();
				clicked(0);
			}
		);
		clickbox1.click(
			function(event){
				event.preventDefault();
				clicked(1);
			}
		);
		clickbox2.click(
			function(event){
				event.preventDefault();
				clicked(2);
			}
		);
		clickbox3.click(
			function(event){
				event.preventDefault();
				clicked(3);
			}
		);
		var minHover = 0.7;
		var maxHover = 1;
		var timeHover = 500;
		clickbox0.hover(
			function(){
				box0.stop().animate({opacity: minHover}, timeHover);
			}, function() {
				box0.stop().animate({opacity: maxHover}, timeHover);
			}
		);
		clickbox1.hover(
			function(){
				box1.stop().animate({opacity: minHover}, timeHover);
			}, function() {
				box1.stop().animate({opacity: maxHover}, timeHover);
			}
		);
		clickbox2.hover(
			function(){
				box2.stop().animate({opacity: minHover}, timeHover);
			}, function() {
				box2.stop().animate({opacity: maxHover}, timeHover);
			}
		);
		clickbox3.hover(
			function(){
				box3.stop().animate({opacity: minHover}, timeHover);
			}, function() {
				box3.stop().animate({opacity: maxHover}, timeHover);
			}
		);
		
		$(".alert").hide();
		
		levelCount = $("#levelCount");
		levelCount.text(localStorage["level"]);
		$("#hs").text(localStorage["hs"]);
		
		//do we have any saved game?
		if ( localStorage["level"] == undefined) {
			current = 0;
			newGame();
		}
	} else {
	  // no native support for HTML5 storage, that's bad :(
	  alert("Sorry, you can't play that... Yet.. You'll need a real browser!");
	}
	// if someone actually tries to search for something
	$("#search").submit( function(event) { event.preventDefault(); googleRedirect(); } );
});
// just like starting over!
function newGame() {
	current = 0;
	levelCount.text(1);
	//let's call our sequence and memorize it
	localStorage["sequence"] = randomSequence();
	//wow, we haven't got anything right until now :)
	localStorage["level"] = 0;
	//clicks binding
	localStorage["clicks"] = 0;
	//let's make things slow for now
	localStorage["speed"] = 1500;
	//let's show our welcome warning
	showBox("#letsRock", 2000);
	//and let's show the first color
	rightPath();
}
// yeah, someone is playing it!
function clicked( color ) {
	// refresh my memory, how long have you gone so far?
	var level = localStorage["level"];
	var clicks = localStorage["clicks"];
	var speed = localStorage["speed"];
	// blink it!
	window['box' + color].stop().animate({ opacity: 0.3 }, (speed * 0.5) ).animate({ "opacity": "1" }, (speed * 0.3) ); //variable variables in js via window[varname] :)
	// well, this time you've got it right?
	if ( localStorage["sequence"][clicks] == color) {
		//oh, yeah!
		localStorage["clicks"]++;
		//have you finished this level?
		if ( level == clicks) {
			nextLevel();
		}
	} else {
		//oh, noes!
		endGame();
	}
}
function nextLevel() {
	//Oh, Yes
	showBox("#ohYes", 1000);
	// you deserve it, let's move on
	localStorage["level"]++;
	levelCount.text(localStorage["level"]);
	
	localStorage["clicks"] = 0;
	//let's show you how it'll be
	current = 0; //since it's used just for animation, let's leave it as global var
	if ( localStorage["speed"] > 300 && (localStorage["level"] / 5) == 0 ) { //our maximum speed, and we'll only acelerate it each 5 levels
		localStorage["speed"] = localStorage["speed"] * 0.8;
	}
	setTimeout( function() { rightPath(); } , localStorage["speed"] );
}
function rightPath() {
	if ( current <= localStorage["level"] ) {
		var sel = localStorage["sequence"][current];
		window['box' + sel].stop().animate({ "opacity": "0.5" }, (localStorage["speed"] * 0.5) ).animate({ "opacity": "1" }, (localStorage["speed"] * 0.3) );
		setTimeout(
			function() {
				rightPath();
			},
			(localStorage["speed"] * (1.5) )
		);
		current++;
	}
	for (var i=0; i <= localStorage["level"] ; i++) {
		var time = 1000 * (i + 1);
	}
	i = 0;
}
function endGame() {
	//let's see if you have a high score, and save it
	if ( localStorage["hs"] == undefined || localStorage["level"] > localStorage["hs"] ) {
		localStorage["hs"] = localStorage["level"];
		$("#hs").text(localStorage["hs"]);
	}
	
	localStorage.removeItem( "level" );
	// Oh, noes!
	showBox("#ohNoes", 2000);
}

//creates our right sequence
function randomSequence() {
	var chars = "0123"; // four colors!
	var string_length = 50; //pretty hard, isn't it?
	var sequence = "";
	for (var i=0; i < string_length; i++) { //we'll have from sequence[0] to sequence[49]
		var rnum = Math.floor(Math.random() * chars.length);
		sequence += chars.substring(rnum,rnum+1);
	}
	return sequence;
}
//makes our fake search form work
function googleRedirect() {
	var query = $("#query").attr('value');
	var url = "http://www.google.com/#q=" + query + "&fp=1";
	window.location = url;
}
function showBox(id, hideTime) {
	$(id).fadeIn(400);
	setTimeout( function() { hideBoxes(); } , hideTime );
}
function hideBoxes() {
	$(".alert").fadeOut(400);
}