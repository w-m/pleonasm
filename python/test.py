from pleonasm import Encoder, decode, trsl, hexa
import time
import binascii
import os

# Perform the tests, then print out random strings forever

def translate_word(word):
	for org, replacement in zip(hexa, trsl):
		word = word.replace(replacement, org)
	return word

def trace_str(words):
	res = ''.join((s if s in trsl else " ") for s in words)
	return res

def test(encoder, test_file):
	
	start = time.time()

	with open(test_file, 'r') as test_file:

		lines = (line.strip().split('\t') for line in test_file)
		test_count = 0

		for source, code in lines:
			encoded = encoder.encode(source)
			assert(code == encoded)
			decoded = decode(encoded)
			assert(decoded == source)
			test_count += 1

	duration = time.time() - start
	print 'Yay, {count} tests passed in {time:.2f} seconds!'.format(count= test_count, time = duration)

if __name__ == '__main__':

	encoder = Encoder('../dictionaries/')

	test(encoder, '../tests/test_complete_dict.txt')
	test(encoder, '../tests/test_hex_4.txt')
	test(encoder, '../tests/test_random.txt')

	while(True):
		random_hex = binascii.b2a_hex(os.urandom(10))
		phrase = encoder.encode(random_hex)
		trace = trace_str(phrase)
		conv_trace = translate_word(trace)
		decoded = decode(phrase)
		assert(decoded == random_hex)
		print random_hex
		print conv_trace
		print trace
		print phrase
		print '-'*15
		time.sleep(1)
