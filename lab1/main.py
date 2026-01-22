M = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
# R <=> x = |y| + 2

def r(x: int, y: int) -> bool:
	return x == abs(y) + 2

print(*M)
for x in M:
	l = []
	print(x, '', end='')
	for y in M:
		result = r(x, y)
		l.append(1 if result else 0)
	print(l)
