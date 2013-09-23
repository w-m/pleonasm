
function loadTest(testFileName, dataCallBack) {
	var client = new XMLHttpRequest();
	client.open('GET', 'tests/' + testFileName);
	client.onreadystatechange = function() {
		if (client.readyState == 4) {
			var plainText = client.responseText;
			var lines = plainText.split('\n');
			document.body.innerHTML += ("<p>Loaded " + testFileName + "</p");
			dataCallBack(lines);
		}
	}
	client.send();
}

function check(source, code) {
	encoded = pleonasm.encode(source, " ", " ").code;
	decoded = pleonasm.decode(encoded).hex;
	return ((encoded === code) && (decoded === source))
}

function check_file(data) {
	
	var tests = 0;
	for (var i = 0; i < data.length; i++) {
		line = data[i];
		if (!line) {
			continue;
		}
		split = line.split('\t');
		var success = check(split[0], split[1]);
		if (!success) {
			alert("Test failed at " + split[0] + " / " + split[1]);
			return;
		}
		tests += 1;
	}
	document.body.innerHTML += ("<p>" + tests + " test cases successful!" + "</p");
}

pleonasm.onload(function() {
	loadTest('test_complete_dict.txt', check_file);
	loadTest('test_hex_4.txt', check_file);
	loadTest('test_random.txt', check_file);
});

