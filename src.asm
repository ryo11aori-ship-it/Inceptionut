# --- Inceptionut Ultimate Echo (Double Fallthrough) ---

# [Bootloader Ignition]
# Jumps safely to [0,1]
9 1 9 1 0 1 1 1 1 1

# [Block 1: IN] at [0,1]
# Temp([8,8]) = Temp - IN([9,9]). Jumps to OUT([4,3])
9 9 8 8 4 3 0 0 0 0

# [Block 2: CLEAR] at [0,2]
# Temp = Temp - Temp. Jumps to IN([0,1])
8 8 8 8 0 1 0 0 0 0

# [Block 3: DUMMY & OUT] at [0,3]
# Inst 1 at [4,3]: OUT. Falls through to [0,3].
# Inst 2 at [0,3]: Dummy(1 - 0 > 0). Falls through to [6,3].
# Inst 3 at [6,3]: Wrapped Jump. Jumps to [6,4]!
6 4 5 4 8 8 9 9 9 8

# [Block 4: TRAMPOLINE] at [0,4]
# Inst 1 at [6,4]: Jump to CLEAR([0,2])
0 2 0 0 0 1 0 0 0 0