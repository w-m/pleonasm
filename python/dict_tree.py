class word_tree(object):

	def __init__(self):
		self.d = {}

	def insert(self, path, word):
		
		for i in xrange(1, len(path)):
			sub_path = path[:i]
			if sub_path not in self.d:
				self.d[sub_path] = None

		self.d[path] = word
	
	def find_longest(self, word):

		depth = 0
		longest_match = None

		for i in xrange(1, len(word) + 1):
			sub_path = word[:i]

			if sub_path in self.d:

				match = self.d[sub_path]
				if match:
					depth = i
					longest_match = match

			else:
				break

		return depth, longest_match

