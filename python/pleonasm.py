import dict_tree
import time
import os

hexa = '0123456789abcdef'
trsl = 'ulkmhpvtwgnbcdyf'

class Encoder(object):

	def __init__(self, path_to_dicts):
		def dict_file(file_name): return os.path.join(path_to_dicts, file_name)
		root_adj = self.__build_tree(dict_file('adj.txt'))
		root_noun = self.__build_tree(dict_file('noun.txt'))
		root_verb = self.__build_tree(dict_file('verb.txt'))

		self.dicts = (root_verb, root_adj, root_noun)

	def encode(self, hex_str):

		tree_idx = 0

		result = []
		hex_str = self.__translate_hex(hex_str)

		while len(hex_str) > 0:

			depth, longest_word = self.dicts[tree_idx % len(self.dicts)].find_longest(hex_str)
			hex_str = hex_str[depth:]
			result.append(longest_word)
			tree_idx += 1

		return ' '.join(result)

	def __translate_hex(self, hex_str):
		translation = zip(hexa, trsl)
		for org, replacement in translation:
			hex_str = hex_str.replace(org, replacement)
		return hex_str

	def __build_tree(self, file_name):

		root = dict_tree.word_tree()

		with open(file_name, 'r') as f:

			words = (line.strip() for line in f)

			def filter_word(word): return (filter(lambda char: char in trsl, word), word)
			filtered = (filter_word(word) for word in words)

			for fw, word in filtered:	
				root.insert(fw, word)

		return root

def decode(words):
	# filter out redundant characters
	words = filter(lambda char: char in trsl, words)
	
	# translate to hex
	for replacement, org in zip(trsl, hexa):
		words = words.replace(replacement, org)
	return words

