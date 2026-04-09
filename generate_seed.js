const fs = require('fs');

class Dim2MasterBuilder {
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

    emitOffsetInst(z, y, offset, ax,ay,az, bx,by,bz, cx,cy,cz) {
        this.universe[z][y][(offset+0)%10] = ax; this.universe[z][y][(offset+1)%10] = ay; this.universe[z][y][(offset+2)%10] = az;
        this.universe[z][y][(offset+3)%10] = bx; this.universe[z][y][(offset+4)%10] = by; this.universe[z][y][(offset+5)%10] = bz;
        this.universe[z][y][(offset+6)%10] = cx; this.universe[z][y][(offset+7)%10] = cy; this.universe[z][y][(offset+8)%10] = cz;
        this.universe[z][y][(offset+9)%10] = 0;
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
    console.log("Inceptionut Compiler - The Ultimate Magic Cascade");
    let b = new Dim2MasterBuilder();

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
    // Z=9: Constants
    // ==========================================
    b.universe[9][9][0] = 9999; // V_HUGE
    b.universe[9][9][2] = -48;  // V_CONST_NEG48
    b.universe[9][9][3] = 224;  // V_SPACE (-224 & 255 = 32)
    b.universe[9][9][4] = 247;  // V_TAB (-247 & 255 = 9)
    let V_TEMP = [9,9,8];
    let V_JUMPY = [7,0,2];

    // ==========================================
    // Halt Trap
    // ==========================================
    b.emitSyncInst(8, 0,  0,0,0, 0,0,0,  0,0,8);

    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Relay from Header ([1,1,1]) -> Jumps to Y=2
    b.universe[1][1][1] = 0; b.universe[1][1][2] = 0; b.universe[1][1][3] = 0;
    b.universe[1][1][4] = 0; b.universe[1][1][5] = 0; b.universe[1][1][6] = 0;
    b.universe[1][1][7] = 0; b.universe[1][1][8] = 2; b.universe[1][1][9] = 1;

    // Y=2: Clear Temp [9,9,8]
    b.emitSyncInst(1, 2,  ...V_TEMP, ...V_TEMP,  0,3,1);

    // Y=3: IN to Temp. (EOF falls to X=9 -> Mangled jumps to Halt[8,0,8])
    b.emitSyncInst(1, 3,  9,9,9, ...V_TEMP,  0,8,1);

    // Y=8: Temp -= (-48). Result is 0 to -9. Always jumps.
    b.emitSyncInst(1, 8,  2,9,9, ...V_TEMP,  0,4,1);

    // Y=4: V_JUMPY -= Temp. (Temp is 0 to -9, so result is 0 to 9).
    // If 0, jumps to [5,1,2]. If >0, falls to X=9 -> Mangled jumps to [2,5,1].
    b.emitSyncInst(1, 4,  ...V_TEMP, ...V_JUMPY,  5,1,2);

    // Relays to the Dynamic Execute block [0,0,2]
    // Relay 1 (For Temp=0) at Z=2, Y=1, X=5
    b.universe[2][1][5] = 0; b.universe[2][1][6] = 0; b.universe[2][1][7] = 0;
    b.universe[2][1][8] = 0; b.universe[2][1][9] = 0; b.universe[2][1][0] = 0;
    b.universe[2][1][1] = 0; b.universe[2][1][2] = 0; b.universe[2][1][3] = 2;
    
    // Relay 2 (For Temp>0) at Z=1, Y=5, X=2
    b.universe[1][5][2] = 0; b.universe[1][5][3] = 0; b.universe[1][5][4] = 0;
    b.universe[1][5][5] = 0; b.universe[1][5][6] = 0; b.universe[1][5][7] = 0;
    b.universe[1][5][8] = 0; b.universe[1][5][9] = 0; b.universe[1][5][0] = 2;

    // ==========================================
    // Z=2: Dynamic Execute!
    // ==========================================
    b.emitSyncInst(2, 0,  0,0,0, 0,0,0,  0,0,3); // C_y is overwritten

    // ==========================================
    // Z=3, 4, 5, 6: Output Cascade
    // ==========================================
    for(let c=0; c<10; c++) {
        let Y = c;
        let chars = b.invisibleMap[c];
        
        // Output 1 (Z=3, starts at X=0) -> Falls to X=9, mangled jumps to Z=4, X=9
        let cZ1 = (chars[0] === ' ') ? 3 : 4;
        b.emitSyncInst(3, Y,  cZ1,9,9, 9,9,9,  Y,4,0);

        // Output 2 (Z=4, starts at X=9) -> Falls to X=8, mangled jumps to Z=5, X=9
        let cZ2 = (chars[1] === ' ') ? 3 : 4;
        b.emitOffsetInst(4, Y, 9,  cZ2,9,9, 9,9,9,  Y,5,0);

        // Output 3 (Z=5, starts at X=9) -> Falls to X=8, mangled jumps to Z=6, X=9
        let cZ3 = (chars[2] === ' ') ? 3 : 4;
        b.emitOffsetInst(5, Y, 9,  cZ3,9,9, 9,9,9,  Y,6,0);

        // Output 4 (Z=6, starts at X=9) -> Falls to X=8, mangled jumps to Loop Restart Relay!
        let cZ4 = (chars[3] === ' ') ? 3 : 4;
        b.emitOffsetInst(6, Y, 9,  cZ4,9,9, 9,9,9,  0,1,0);
    }

    // Loop Restart Relay at Z=1, Y=0, X=9 -> Jumps to [0,2,1]
    b.universe[1][0][9] = 0; b.universe[1][0][0] = 0; b.universe[1][0][1] = 0;
    b.universe[1][0][2] = 0; b.universe[1][0][3] = 0; b.universe[1][0][4] = 0;
    b.universe[1][0][5] = 0; b.universe[1][0][6] = 2; b.universe[1][0][7] = 1;

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Ultimate DIM 2 Compiler forged.");
}
main();
