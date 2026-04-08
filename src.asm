# --- Inceptionut Bootstrapper & Echo ---

# Phase 1: Trampoline (Ignition)
9 1 9 1 2 1 1 1 1 1

# Phase 2: Dim 1 Space
# Padding: [0,1] and [1,1]
0 0

# Inst 1 at [2,1]: Temp([8,1]) = Temp - IN([9,9]). Jump to [0,2]
9 9 8 1 0 2

# Padding: [8,1] is Temp. [9,1] is unused.
0 0

# Inst 2 at [0,2]: OUT([9,9]) = OUT - Temp([8,1]). Does not jump.
8 1 9 9 6 2

# Inst 3 at [6,2]: Clear Temp([8,1]) = Temp - Temp. Jump to [2,1]
8 1 8 1 2 1
