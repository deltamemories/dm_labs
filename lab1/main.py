M = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
# R <=> x = |y| + 2


def r(x: int, y: int) -> bool:
	return x == abs(y) + 2

print(' ' * 5, end='')
for x in M:
	print(f"{x:3}", end="")
print('\n' + ' ' * 4 + '-' * (len(M) * 3 + 1))

matrix = []
for y in M:
	l = []
	print(f'{y:3} |', end='')
	for x in M:
		result = r(x, y)
		val = 1 if result else 0
		l.append(result)
		print(f'{val:3}', end='')
	matrix.append(l)
	print()



def check_reflexivity(matrix_n_n: list[list[int | bool]]) -> bool:
	for i, ys in enumerate(matrix_n_n):
		if not bool(ys[i]):
			return False
	return True

def transpose_matrix(matrix_n_n: list[list[int]]) -> list[list[int]]:
	_n = len(matrix_n_n)
	print(_n)
	t_matrix = [[0 for i in range(_n)] for j in range(_n)]
	print('t:', t_matrix)

	for n in range(_n):
		for m in range(_n):
			val = matrix_n_n[m][n]
			print(val)
			t_matrix[n][m] = val

	return t_matrix

print("Reflexivity check passed?", check_reflexivity(matrix))
print(transpose_matrix(matrix)) # [[1, 2], [3, 4]]
print(matrix == matrix)