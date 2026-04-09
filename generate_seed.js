const fs = require('fs');

class Dim2CompilerBuilder {
    constructor() {
        this.universe = new Array(10).fill(null).map(()=>
            new Array(10).fill(null).map(()=>
                new Array(10).fill(0)
            )
        );
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitInst(z, y, A, B, C) {
        this.universe[z][y][0] = A[0]; this.universe[z][y][1] = A[1]; this.universe[z][y][2] = A[2];
        this.universe[z][y][3] = B[0]; this.universe[z][y][4] = B[1]; this.universe[z][y][5] = B[2];
        this.universe[z][y][6] = C[0]; this.universe[z][y][7] = C[1]; this.universe[z][y][8] = C[2];
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
    console.log("Inceptionut Compiler - The Ultimate Big Bang Encoder");
    let b = new Dim2CompilerBuilder();

    // ==========================================
    // Z=0: Big Bang Header (0を含んではならない起爆装置)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.universe[0][y][x] = 9;
    }
    b.universe[0][0][0] = 10; b.universe[0][0][1] = 10; b.universe[0][0][2] = 10; 
    b.universe[0][0][3] = 10; b.universe[0][0][4] = 10; b.universe[0][0][5] = 10; 
    b.universe[0][0][6] = 10; b.universe[0][0][7] = 10; b.universe[0][0][8] = 1;  
    
    b.universe[0][1][0] = 15; 
    b.universe[0][1][1] = 1;  
    b.universe[0][1][2] = 7;  
    b.universe[0][1][3] = 3;  
    b.universe[0][2][4] = 8;  

    let V15 = [0, 1, 0], V1 = [1, 1, 0], V7 = [2, 1, 0], V3 = [3, 1, 0], V8 = [4, 2, 0];
    let V_NEG15 = [4, 1, 0], V_NEG1 = [5, 1, 0], V_NEG7 = [6, 1, 0], V_NEG3 = [7, 1, 0];
    let SPACE = [8, 1, 0], TAB_NEG = [9, 1, 0], TAB = [0, 2, 0];
    let ASCII_0 = [1, 2, 0], TEMP = [2, 2, 0], ZERO = [3, 2, 0];
    let I_O = [9, 9, 9];

    // ==========================================
    // Z=1 to Z=4: Constant Builder (定数の動的生成)
    // ==========================================
    let instCount = 0;
    function emitSetup(A, B) {
        let z = 1 + Math.floor(instCount / 10);
        let y = instCount % 10;
        instCount++;
        let nextZ = 1 + Math.floor(instCount / 10);
        let nextY = instCount % 10;
        b.emitInst(z, y, A, B, [0, nextY, nextZ]);
    }

    [V_NEG15, V_NEG1, V_NEG7, V_NEG3, SPACE, TAB_NEG, TAB, ASCII_0, ZERO].forEach(v => emitSetup(v, v));

    emitSetup(V15, V_NEG15); emitSetup(V1, V_NEG1); emitSetup(V7, V_NEG7); emitSetup(V3, V_NEG3);

    for(let i=0; i<15; i++) emitSetup(V_NEG15, SPACE);
    emitSetup(V1, SPACE);

    emitSetup(SPACE, TAB_NEG); emitSetup(V15, TAB_NEG); emitSetup(V8, TAB_NEG);
    emitSetup(TAB_NEG, TAB);

    for(let i=0; i<3; i++) emitSetup(V_NEG15, ASCII_0);
    emitSetup(V_NEG3, ASCII_0);

    // ==========================================
    // Z=4 & 5: Main Loop (入力と動的ジャンプ)
    // ==========================================
    let C_Y_ADDR = [7, 1, 5]; 

    b.emitInst(4, 7, TEMP, TEMP, [0, 8, 4]);           
    b.emitInst(4, 8, C_Y_ADDR, C_Y_ADDR, [0, 9, 4]);   
    b.emitInst(4, 9, I_O, TEMP, [0, 1, 5]);            
    b.emitInst(5, 0, ZERO, ZERO, [0, 0, 5]);           
    b.emitInst(5, 1, TEMP, C_Y_ADDR, [0, 2, 5]);       
    b.emitInst(5, 2, ASCII_0, C_Y_ADDR, [0, 3, 5]);    
    b.emitInst(5, 3, ZERO, ZERO, [0, 0, 6]);           

    // ==========================================
    // Z=6, 7, 8, 9: Output Cascade (次元貫通出力)
    // ==========================================
    for(let d=0; d<10; d++) {
        let chars = b.invisibleMap[d];
        b.emitInst(6, d, chars[0] === ' ' ? SPACE : TAB, I_O, [0, d, 7]);
        b.emitInst(7, d, chars[1] === ' ' ? SPACE : TAB, I_O, [0, d, 8]);
        b.emitInst(8, d, chars[2] === ' ' ? SPACE : TAB, I_O, [0, d, 9]);
        
        // 【修正箇所】引数 I_O を追加しました
        b.emitInst(9, d, chars[3] === ' ' ? SPACE : TAB, I_O, [0, 7, 4]); 
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("The Ultimate Big Bang Encoder forged.");
}
main();
