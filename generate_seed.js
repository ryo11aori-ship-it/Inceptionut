const fs = require('fs');

class InceptionutBuilder {
    constructor() {
        // Dim 1 (100ブロック x 10要素) の宇宙を初期化
        this.universe = new Array(100).fill(null).map(() => new Array(10).fill(0));
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    // ブロックに命令(A, B, C)を配置し、未使用領域を0で埋める
    emitInstruction(blockIndex, ax, ay, bx, by, cx, cy) {
        if (blockIndex >= 100) throw new Error("Out of universe bounds");
        this.universe[blockIndex] = [
            ax, ay, bx, by, cx, cy, 0, 0, 0, 0
        ];
    }

    // 定数や変数を配置する（0パディング）
    emitData(blockIndex, value) {
        this.universe[blockIndex] = [
            value, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
    }

    build() {
        let out = "";
        for (let y = 0; y < this.universe.length; y++) {
            for (let x = 0; x < 10; x++) {
                let val = this.universe[y][x];
                if (val < 0 || val > 9) val = 0; // 安全対策
                out += this.invisibleMap[val];
            }
        }
        return out;
    }
}

function main() {
    console.log("Inceptionut IR Builder - Constructing encoder.inc");
    let builder = new InceptionutBuilder();

    // ==========================================
    // Memory Map (IR Specification)
    // ==========================================
    const BOOT_BLOCK = 0;
    const START_BLOCK = 1;
    const HALT_BLOCK = 99;

    // 変数領域 (Block 10〜19をデータ領域として予約)
    const VAR_CHAR = 10;
    const CONST_48 = 11;
    builder.emitData(CONST_48, 48); // ASCII '0'

    // ==========================================
    // Logic Execution
    // ==========================================
    
    // 0. Bootloader
    // (ここではIRテストのため、単純にSTART_BLOCKへジャンプ)
    builder.emitInstruction(BOOT_BLOCK, 0, 0, 0, 0, 0, START_BLOCK);

    // 1. Read IN
    // Subleq(IO, VAR_CHAR, Next) -> INから読み込み
    builder.emitInstruction(START_BLOCK, 9, 9, 0, VAR_CHAR, 0, 2);

    // 2. T = char - 48 の計算（この先のロジックをここに構築していく）
    builder.emitInstruction(2, 0, CONST_48, 0, VAR_CHAR, 0, HALT_BLOCK);

    // 99. Halt Trap
    builder.emitInstruction(HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK);

    // バイナリ出力
    let binaryOut = builder.build();
    fs.writeFileSync('encoder.inc', binaryOut);
    console.log("IR Building complete. Native binary 'encoder.inc' generated.");
}

main();
