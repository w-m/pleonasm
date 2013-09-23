
function sourceChanged(box) {
	var result = pleonasm.encode(box.value);
	document.getElementById("mnemonic").value = result.code;
	document.getElementById("translated").value = result.translation;
	document.getElementById("spaced").value = result.spaced;
	document.getElementById('color-progress').style.backgroundColor = '#' + box.value.substring(0, 6);

}

function codeChanged(box) {

	var decoded = pleonasm.decode(box.value);
	var source = document.getElementById('source').value;

	if (source != decoded.hex) { 
		document.getElementById('source').value	= decoded.hex;
		document.getElementById('translated').value	= decoded.translation;
		document.getElementById('spaced').value	= decoded.spaced;
		document.getElementById('color-progress').style.backgroundColor = '#' + decoded.hex.substring(0, 6);
	}
}

function randomHexChar() {
	return Math.floor(Math.random() * 16).toString(16);
}

function randomHex(length) {
	var result = '';
	for (var i = 0; i < length; i++) {
		result += randomHexChar();
	}
	return result;
}

function createHash(button) {
	document.getElementById('source').value = randomHex(20);
	document.getElementById('source').onchange();
}

function createColor(button) {
	document.getElementById('source').value = randomHex(6);
	document.getElementById('source').onchange();
}

if (window.addEventListener) {
	window.addEventListener("load", createColor, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", createColor);
} else {
	window.onload = createColor;
}

pleonasm.onload(function(){
	var box = document.getElementById('source');
	document.getElementById('source').onchange();
});
