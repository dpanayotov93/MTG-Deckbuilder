function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function mover(img1) {
	//Define out dimensions
	W = "200px";
	H = "270px";

	//Create our new container <DIV> and its attributes
	div = document.createElement('div');
	div.setAttribute("id", "grow");
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

	[].map.call(main.children, Object).sort(function(a, b) {
		return +a.id.match(/\d+/) - +b.id.match(/\d+/);
	}).forEach(function(elem) {
		main.appendChild(elem);
	});
}

function listMarket() {
	document.getElementById('marketCards').innerHTML = '';
	for (var i = 0; i < set.length; i++) {
		var id = set[i];
		document.getElementById('marketCards').innerHTML += '<img " onclick="add(' + id + ')" id="' + id + '" src="http://api.mtgdb.info/content/hi_res_card_images/' + id + '.jpg">';
	}
	sortDivs();
	show('loading', false);
}

function updateMarket(id) {
	var img = "#" + id;
	if ($("#marketCards").find(img).length === 0) {
		set.push(id);
		document.getElementById('marketCards').innerHTML += '<img " onclick="add(' + id + ')" id="' + id + '" src="http://api.mtgdb.info/content/hi_res_card_images/' + id + '.jpg">';
		sortDivs();
	}
}

function listDeck() {
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
	$.prompt('<label>Name: <input type="text" name="name" value=""></label><br />', {
				title: "SAVE DECK",
				buttons: {"Save": true, "Back": false},
				submit:function(e,v,m,f){
					if (v === true) {
						link.setAttribute("download", f.name + ".csv");
						link.click();
					} else {
						$.prompt.close();
					}
				}
			});

}

function changeSet(name) {
	show('loading', true);
	console.log(name);
	set = getSet(name);
	setTimeout(function() {
		listMarket();
	}, 3000);
}

function loadDeck() {
	document.getElementById('fileInput').click();
}

function handleFiles(files) {
	var file = files[0];
	var reader = new FileReader();
	reader.onload = onFileReadComplete;
	reader.readAsText(file);
}

function onFileReadComplete(event) {
	deck = event.target.result.split(',');
	listDeck();
}

function testUI() {
	set = getSet('frf');
	// listMarket();
	listDeck();
	sortDivs();

	// console.log(httpGet('http://api.mtgdb.info/cards/' + cardName));
	// $('#debug').append(httpGet('http://api.mtgdb.info/cards/' + cardName));
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
	var checked = [],
		unchecked = [];

function onReady(callback) {
	var intervalID = window.setInterval(checkReady, 1000);

	function checkReady() {
		if (document.getElementsByTagName('body')[0] !== undefined) {
			window.clearInterval(intervalID);
			callback.call(this);
		}
	}
}

function show(id, value) {
	document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function() {
	// show('page', true);
	show('loading', false);
});