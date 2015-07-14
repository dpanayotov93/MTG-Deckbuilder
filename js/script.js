function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function mover(img1){
	//Define out dimensions
	W = "200px";
	H = "270px";
	
	//Create our new container <DIV> and its attributes
	div = document.createElement('div');
	div.setAttribute("id","grow");
	div.style.position = "absolute";
	div.style.width = W;
	div.style.height = H;
	div.style.margin = "30px 70px";
	div.style.boxShadow = "0px 0px 30px #9bebff"; 
	
	//Create out new magnified <IMG> and its attributes
	img = document.createElement("img");	
	img.src = img1.src;
	img.style.width = W;
	img.style.height = H;
	
	//Append the <IMG> to the <DIV>
	div.appendChild(img);	
	
	//Append the <DIV> to the document
	document.body.appendChild(div);
}

function removeLands(){
	var i, id, type, cardName, result;
	for (i = 0; i < set.length; i+=1) {
		id = set[i];
		cardName = httpGet('http://api.mtgdb.info/cards/' + id);
		result = cardName.match("type\":\"(.*)\",\"subType");                   
		type = result[1];
		if (type === 'Land' || type === 'Basic Land') {
			console.log('Land');
			set.splice(i, 1);
		}
	}
}

function getSet(name) {
	var x = httpGet('http://api.mtgdb.info/sets/' + name);
	x = x.match("cardIds\":(.*)]");
	x = x[1].substring(1);
	var y = x.split(",");
	return y;
}

function countInArray(array, value) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            count++;
        }
    }
    console.log(count);
    return count;
}

function sortDivs() {
	var main = document.getElementById('marketCards');

	[].map.call( main.children, Object ).sort( function ( a, b ) {
	    return +a.id.match( /\d+/ ) - +b.id.match( /\d+/ );
	}).forEach( function ( elem ) {
	    main.appendChild( elem );
	});
}

function listMarket(){
 	removeLands();
	document.getElementById('marketCards').innerHTML = ''; 
	for (var i = 0; i < set.length; i++) {
		var id = set[i];
		document.getElementById('marketCards').innerHTML += '<img " onclick="add(' + id + ')" id="' + id + '" src="http://api.mtgdb.info/content/hi_res_card_images/' + id + '.jpg">';
	}
	sortDivs();
}

function updateMarket(id){
	var img = "#" + id;
	if ($("#marketCards").find(img).length === 0) {
		set.push(id);
		document.getElementById('marketCards').innerHTML += '<img " onclick="add(' + id + ')" id="' + id + '" src="http://api.mtgdb.info/content/hi_res_card_images/' + id + '.jpg">';
		sortDivs();
	}
}

function listDeck(){
	document.getElementById('libraryCards').innerHTML = '';
	for (var i = 0; i < deck.length; i++) {
		document.getElementById('libraryCards').innerHTML += '<img " onclick="del(' + deck[i] + ')" id="' + deck[i] + '" src="http://api.mtgdb.info/content/hi_res_card_images/' + deck[i] + '.jpg">';
	}
}

var set = [];
var deck = [];

function del(id) {
	var index = deck.indexOf(id);
	deck.splice(index, 1);
	listDeck();
	updateMarket(id);
}

function add(id) {
	var count = countInArray(deck, id);
	if (count < 3) {
		deck.push(id);
		listDeck();
	} else if (count === 3) {
		deck.push(id);
		var index = set.indexOf(id);
		set.splice(index, 1);		
		document.getElementById(id).remove();
		listDeck();
	}
}

function saveDeck() {
	var csvContent = "data:text/csv;charset=utf-8,";
	var dataString = deck.join(",");
	csvContent += dataString;

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_deck.csv");

	link.click();
}

function loadDeck() {
	var newDeck = [];
	var name = 'my_data.csv';
	loadCSV(name);
	console.log(arr);
}

function loadCSV(file) {
    var request;
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari
        request = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // load
    request.open('GET', file, false);
    request.send();
    return request.responseText;
}


function testUI() {
	set = getSet('frf');
	listMarket();
	listDeck();
	sortDivs();


	var cardName = 'phalanx leader';
	// $('#name').append(objects.card.name);
	// $('#mana').append(objects.card.id);
	// $('#oracle').append(objects.card.oracle);
	$('#name').append(getName(cardName));
	$('#mana').append(getMana(cardName));
	$('#oracle').append(getOracle(cardName));
	// $('#test').append(card.mana);

	// console.log(httpGet('http://api.mtgdb.info/cards/' + cardName));
	$('#debug').append(httpGet('http://api.mtgdb.info/cards/' + cardName));
}

function getName(cardName) {
	var name = httpGet('http://api.mtgdb.info/cards/' + cardName);
	var result = name.match("name\":\"(.*)\",\"searchName\"");
	return result[1];
}

function getMana(cardName) {
	var name = httpGet('http://api.mtgdb.info/cards/' + cardName);
	var result = name.match("manaCost\":\"(.*)\",\"convertedManaCost\"");
	return result[1];
}

function getOracle(cardName) {
	var name = httpGet('http://api.mtgdb.info/cards/' + cardName);
	var result = name.match("description\":\"(.*)\",\"flavor\"");
	return result.toString().substring(14);
}