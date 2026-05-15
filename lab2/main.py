def task_1():
	from itertools import permutations

	word = "АБРАКАДАБРА"
	unique_combinations = set()

	for p in permutations(word, 6):
		unique_combinations.add("".join(p))

	return len(unique_combinations)


def task_5():
	w, h = 21, 18

	dp1 = [[0] * (h + 1) for _ in range(w + 1)]
	dp1[0][0] = 1

	for i in range(w + 1):
		for j in range(h + 1):
			if i > 0:
				dp1[i][j] += dp1[i - 1][j]
			if j > 0:
				dp1[i][j] += dp1[i][j - 1]

	ans_total = dp1[w][h]

	dp2 = [[[0, 0] for _ in range(h + 1)] for _ in range(w + 1)]
	dp2[0][0][0] = 1

	for i in range(w + 1):
		for j in range(h + 1):
			if i > 0:
				dp2[i][j][0] += dp2[i - 1][j][0] + dp2[i - 1][j][1]
			if j > 0:
				dp2[i][j][1] += dp2[i][j - 1][0]

	ans_restricted = dp2[w][h][0] + dp2[w][h][1]

	return ans_total, ans_restricted


if __name__ == "__main__":
	print(task_1())
	print(task_5())