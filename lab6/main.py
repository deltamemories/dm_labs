import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
from itertools import permutations

g1_edges = [(0, 1), (0, 5), (0, 7), (0, 8), (1, 2), (1, 9), (2, 3), (2, 7), (2, 8), (2, 9), (3, 4), (3, 9), (4, 5), (4, 6), (4, 7), (4, 8), (5, 6), (5, 9), (6, 7), (6, 8), (6, 9), (7, 8), (7, 9), (8, 9)]
g2_edges = [(0, 1), (0, 4), (0, 5), (0, 7), (0, 8), (0, 9), (1, 3), (1, 4), (1, 6), (1, 7), (2, 5), (2, 8), (2, 9), (3, 8), (3, 9), (4, 6), (4, 7), (4, 9), (5, 6), (5, 7), (6, 9), (7, 8), (7, 9), (8, 9)]

G1 = nx.Graph()
G1.add_nodes_from(range(10))
G1.add_edges_from(g1_edges)

G2 = nx.Graph()
G2.add_nodes_from(range(10))
G2.add_edges_from(g2_edges)

print("--- 1. Изоморфизм графов G1 и G2 (перебор биекций) ---")
def check_isomorphism(g1, g2):
    nodes1 = list(g1.nodes())
    nodes2 = list(g2.nodes())
    
    if len(nodes1) != len(nodes2) or len(g1.edges()) != len(g2.edges()):
        return False, None
    
    degrees1 = sorted([d for n, d in g1.degree()])
    degrees2 = sorted([d for n, d in g2.degree()])
    if degrees1 != degrees2:
        return False, None
        
    edges1 = set([tuple(sorted((u, v))) for u, v in g1.edges()])
    
    for p in permutations(nodes2):
        mapping = dict(zip(nodes1, p))
        is_iso = True
        for u, v in edges1:
            mapped_edge = tuple(sorted((mapping[u], mapping[v])))
            if not g2.has_edge(*mapped_edge):
                is_iso = False
                break
        if is_iso:
            return True, mapping
    return False, None

is_iso, mapping = check_isomorphism(G1, G2)
if is_iso:
    print(f"Графы изоморфны. Изоморфизм: {mapping}")
else:
    print("Графы не изоморфны.")

print("\n--- 2. Характеристики графа G1 ---")
adj_list = nx.to_dict_of_lists(G1)
print("Список смежности:")
for node, neighbors in sorted(adj_list.items()):
    print(f"{node}: {neighbors}")

adj_matrix = nx.to_numpy_array(G1, dtype=int)
print("\nМатрица смежности:")
print(adj_matrix)

inc_matrix = nx.incidence_matrix(G1).toarray().astype(int)
print("\nМатрица инцидентности:")
print(inc_matrix)

degrees = [d for n, d in G1.degree()]
print(f"\nВектор степеней вершин: {degrees}")

print("\n--- 3. Дополнение графа и циклы ---")
G1_comp = nx.complement(G1)
print(f"Список ребер дополнения графа G1:\n{list(G1_comp.edges())}")

cycles = nx.cycle_basis(G1)
long_cycles = sorted(cycles, key=len, reverse=True)[:2]
print(f"\nДва длинных цикла: {long_cycles}")

print("\n--- 4. Подграф K4 в G1 ---")
cliques = list(nx.find_cliques(G1))
k4_subgraphs = [c for c in cliques if len(c) >= 4]
if k4_subgraphs:
    print(f"Подграф(ы) K4 найден(ы) на вершинах: {k4_subgraphs}")
else:
    print("Подграф K4 не найден.")

print("\n--- 5. Построение чертежей ---")
plt.figure(figsize=(15, 10))

plt.subplot(2, 2, 1)
nx.draw_circular(G1, with_labels=True, node_color='lightblue', font_weight='bold')
plt.title("Граф G1")

plt.subplot(2, 2, 2)
nx.draw_circular(G2, with_labels=True, node_color='lightgreen', font_weight='bold')
plt.title("Граф G2")

plt.subplot(2, 2, 3)
nx.draw_circular(G1_comp, with_labels=True, node_color='lightcoral', font_weight='bold')
plt.title("Дополнение графа G1")

plt.subplot(2, 2, 4)
L_G1 = nx.line_graph(G1)
nx.draw(L_G1, with_labels=True, node_color='lightgoldenrodyellow', font_size=8, node_size=500)
plt.title("Реберный граф для G1")

plt.tight_layout()
plt.show()

