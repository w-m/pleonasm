from pleonasm import Encoder, decode

enc = Encoder('../dictionaries')
encoded = enc.encode('601a9f')
print encoded

decoded = decode('rule_veterinarian_move')
print decoded