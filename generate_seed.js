const fs = require('fs');

class Dim2MagicBuilder {
    constructor() {
        this.universe = new Array(10).fill(null).map(()=>
            new Array(10).fill(null).map(()=>
                new Array(10).fill(0)
            )
        );
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitSyncInst(z, y, ax,ay,az, bx,by,bz, cx,cy,cz) {
        this.universe[z][y][0] = ax; this.universe[z][y][1] = ay; this.universe[z][y][2] = az;
        this.universe[z][y][3] = bx; this.universe[z][y][4] = by; this.universe[z][y][5] = bz;
        this.universe[z][y][6] = cx; this.universe[z][y][7] = cy; this.universe[z][y][8] = cz;
        this.universe[z][y][9] = 0;
    }

    build() {
        let out = "";
        for (let z = 0; z < 10; z++) {
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    out += this.invisibleMap[this.universe[z][y][x]];
                }
            }
        }
        return out;
    }
}

function main() {
    console.log("Inceptionut Compiler - The Perfect Magic Ring Encoder");
    let b = new Dim2MagicBuilder();

    // ==========================================
    // Z=0: Big Bang Header (起爆装置)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.universe[0][y][x] = 9;
    }
    b.universe[0][0][0] = 1; b.universe[0][0][1] = 1; b.universe[0][0][2] = 1;
    b.universe[0][0][3] = 1; b.universe[0][0][4] = 1; b.universe[0][0][5] = 1;
    b.universe[0][0][6] = 1; b.universe[0][0][7] = 1; b.universe[0][0][8] = 1;

    // ==========================================
    // Z=9: Constants & Variables
    // ==========================================
    b.universe[9][9][0] = 9999; // V_HUGE1
    b.universe[9][3][0] = 9999; // V_HUGE2
    b.universe[9][2][0] = 9999; // V_HUGE3
    b.universe[9][9][2] = 48;   // V_CONST_48
    b.universe[9][9][3] = 224;  // V_SPACE (-224 & 255 = 32)
    b.universe[9][9][4] = 247;  // V_TAB (-247 & 255 = 9)
    b.universe[9][9][5] = 0;    // V_ZERO

    let V_ZERO = [5,9,9];

    // ==========================================
    // Halt Block & Trampolines (スライドキャッチ)
    // ==========================================
    // Halt Trap at Z=4, Y=0, X=8
    b.universe[4][0][8] = 5; b.universe[4][0][9] = 9; b.universe[4][0][0] = 9;
    b.universe[4][0][1] = 5; b.universe[4][0][2] = 9; b.universe[4][0][3] = 9;
    b.universe[4][0][4] = 8; b.universe[4][0][5] = 0; b.universe[4][0][6] = 4;

    // Trampoline 1 at Z=5, Y=0, X=1 (Jumps to Z=1, Y=5, X=0)
    b.universe[5][0][1] = 5; b.universe[5][0][2] = 9; b.universe[5][0][3] = 9;
    b.universe[5][0][4] = 5; b.universe[5][0][5] = 9; b.universe[5][0][6] = 9;
    b.universe[5][0][7] = 0; b.universe[5][0][8] = 5; b.universe[5][0][9] = 1;

    // Trampoline 2 at Z=8, Y=0, X=2 (Jumps to Z=2, Y=8, X=0)
    b.universe[8][0][2] = 5; b.universe[8][0][3] = 9; b.universe[8][0][4] = 9;
    b.universe[8][0][5] = 5; b.universe[8][0][6] = 9; b.universe[8][0][7] = 9;
    b.universe[8][0][8] = 0; b.universe[8][0][9] = 8; b.universe[8][0][0] = 2;

    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Y=1: Clear Temp[3,9,8]. Jumps to Y=2
    b.emitSyncInst(1, 1,  3,9,8, 3,9,8, 0,2,1);

    // Y=2: Magic Ring 1 (IN & EOF Branch)
    // X=0: IN to Temp. If char, jumps to Y=4. If EOF, falls to X=9.
    // X=9: Subleq([0,9,9], [9,3,9], [8,0,4]). Jumps to Halt!
    b.universe[1][2] = [9, 9, 9, 3, 9, 8, 0, 4, 1, 0];

    // Y=4: Magic Ring 3 (V_JUMPY[7,0,2] -= Temp)
    // X=0: Subtracts Temp. Result is positive, falls to X=9.
    // X=9: Subleq([0,3,9], [8,7,0], [1,0,5]). Jumps to Trampoline 1!
    b.universe[1][4] = [3, 9, 8, 7, 0, 2, 0, 5, 1, 0];

    // Y=5: Magic Ring 4 (V_JUMPY[7,0,2] -= 48)
    // X=0: Subtracts 48. Result is >= 0, falls to X=9.
    // X=9: Subleq([0,2,9], [9,7,0], [2,0,8]). Jumps to Trampoline 2!
    b.universe[1][5] = [2, 9, 9, 7, 0, 2, 0, 8, 2, 0];

    // ==========================================
    // Z=2: Dynamic Jump Relay & Execution
    // ==========================================
    // Y=8: Relay from Trampoline 2 -> Jumps to Dynamic Jump Engine
    b.emitSyncInst(2, 8,  ...V_ZERO, ...V_ZERO,  0,0,2);

    // Y=0: Dynamic Jump Execution! (C_y at X=7 is modified by Z=1, Y=4 & 5)
    b.emitSyncInst(2, 0,  ...V_ZERO, ...V_ZERO,  0,0,3);

    // ==========================================
    // Z=3, 4, 5, 6: Output Dictionary
    // ==========================================
    for(let c=0; c<10; c++) {
        let Y = c;
        let chars = b.invisibleMap[c];
        for(let i=0; i<4; i++) {
            let Z = 3 + i;
            let V_CHAR = (chars[i] === ' ') ? [3,9,9] : [4,9,9];
            let nextC = (i === 3) ? [0,1,1] : [0, Y, Z+1];
            // 常にマイナス値(V_CHAR)が引かれるため、必ず出力と同時にジャンプする！
            b.emitSyncInst(Z, Y,  ...V_CHAR, 9,9,9,  ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("DIM 2 Magic Ring Encoder forged.");
}
main();
