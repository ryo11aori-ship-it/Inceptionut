# --- Inceptionut Bootstrapper & Echo ---

# Phase 1: Dimensional Trampoline (Ignition)
# Dim 0を埋め尽くしてBig Bangを意図的に誘発する。
# Dim 1拡張後、PC=[0,0]がこれを読むと
# Subleq([9,1], [9,1], [2,1]) として解釈され、[2,1]へ安全にジャンプする。
9 1 9 1 2 1 1 1 1 1

# Phase 2: Dim 1 Echo Program
# [0,1]と[1,1]はジャンプで飛び越えるためのパディング
0 0

# Addr [2,1]: IN(9,9) -> Temp(7,1). Jump to [5,1]
9 9 7 1 5 1

# Addr [5,1]: Temp(7,1) -> OUT(9,9). Jump to [8,1]
7 1 9 9 8 1

# Addr [8,1]: Halt (Infinite Loop in [8,1])
8 1 8 1 8 1
