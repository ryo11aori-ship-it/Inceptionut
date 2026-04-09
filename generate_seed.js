const fs = require('fs');

class InceptionutBuilder {
    constructor() {
        // 宇宙を拡張 (50ブロック x 10要素)
        this.universe = new Array(50).fill(null).map(() => new Array(10).fill(0));
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitBootloader() {
        this.universe[0] = [9, 1, 9, 1, 2, 1, 5, 5, 5, 5];
    }
    emitSlingshot(targetBlock) {
        this.universe[1] = [0, 0, 0, 9, 0, 9, 0, targetBlock, 0, 0];
    }
    emitInstruction(block, ax, ay, bx, by, cx, cy) {
        this.universe[block] = [ax, ay, bx, by, cx, cy, 0, 9, 0, 9];
    }
    emitFallthroughPad(block, jumpX, jumpY) {
        this.universe[block] = [jumpX, jumpY, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    emitData(block, values) {
        let arr = new Array(10).fill(0);
        for(let i=0; i<values.length && i<10; i++) arr[i] = values[i];
        this.universe[block] = arr;
    }

    build() {
        let out = "";
        for (let y = 0; y < this.universe.length; y++) {
            for (let x = 0; x < 10; x++) {
                let val = this.universe[y][x];
                if (val < 0 || val > 9) val = 0;
                out += this.invisibleMap[val];
            }
        }
        return out;
    }
}

function main() {
    console.log("Inceptionut IR Builder - Encoder (Dynamic Jump Test)");
    let builder = new InceptionutBuilder();

    const LOOP_START = 2;
    const IN_BLOCK = 3;
    const IN_PAD = 4;
    const JUMP_EXEC = 5;
    const HALT_BLOCK = 9;

    const DATA_BLOCK = 10;
    // [0] = 0 (ゼロクリア用)
    // [1] = 48 (ASCII '0' オフセット)
    // [2] = 20 (出力ブロックのベースインデックス)
    // [3] = input_var (入力された文字)
    builder.emitData(DATA_BLOCK, [0, 48, 20, 0]);

    const VAR_ZERO   = [0, DATA_BLOCK];
    const VAR_OFFSET = [1, DATA_BLOCK];
    const VAR_BASE   = [2, DATA_BLOCK];
    const VAR_INPUT  = [3, DATA_BLOCK];

    builder.emitBootloader();
    builder.emitSlingshot(LOOP_START);

    // 2. Clear VAR_INPUT -> IN_BLOCKへ
    builder.emitInstruction(LOOP_START, ...VAR_INPUT, ...VAR_INPUT, 0, IN_BLOCK);

    // 3. IN_BLOCK (入力 -> VAR_INPUT) EOFならHalt
    builder.emitInstruction(IN_BLOCK, 9, 9, ...VAR_INPUT, 0, JUMP_EXEC);
    builder.emitFallthroughPad(IN_PAD, 0, HALT_BLOCK);

    // 5. JUMP_EXEC_PREP (自己書き換え: Target = Base + (Input - 48))
    // ※今回は検証のため、入力文字が '0' か '1' 前提で直接JUMP_EXECの[5]に書き込みます。
    // まず JumpTarget を VAR_BASE で初期化 (JumpTarget = JumpTarget - JumpTarget; JumpTarget = JumpTarget - (-VAR_BASE))
    builder.emitInstruction(JUMP_EXEC, 5, JUMP_EXEC, 5, JUMP_EXEC, 0, JUMP_EXEC+1);
    builder.emitInstruction(JUMP_EXEC+1, ...VAR_BASE, VAR_ZERO[0], VAR_ZERO[1], 0, JUMP_EXEC+2); // Zero = -Base
    builder.emitInstruction(JUMP_EXEC+2, VAR_ZERO[0], VAR_ZERO[1], 5, JUMP_EXEC, 0, JUMP_EXEC+3); // Target = Base; Zero=0

    // Target = Target - 48 + Input
    builder.emitInstruction(JUMP_EXEC+3, ...VAR_OFFSET, 5, JUMP_EXEC, 0, JUMP_EXEC+4); // Target -= 48
    builder.emitInstruction(JUMP_EXEC+4, ...VAR_INPUT, VAR_ZERO[0], VAR_ZERO[1], 0, JUMP_EXEC+5);  // Zero = -Input
    builder.emitInstruction(JUMP_EXEC+5, VAR_ZERO[0], VAR_ZERO[1], 5, JUMP_EXEC, 0, JUMP_EXEC+6);  // Target += Input; Zero=0

    // 6. Dynamic Jump Execution (A=0, B=0, C=Target(書き換え済み))
    builder.universe[JUMP_EXEC+6] = [0, DATA_BLOCK, 0, DATA_BLOCK, 0, 0 /* この0がTargetに書き換わる */, 0, 9, 0, 9];

    // 9. Halt
    builder.emitInstruction(HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK);

    // ----------------------------------------------------
    // Output Blocks (Jump Targets)
    // ----------------------------------------------------
    // Block 20: '0' が入力された場合の処理 (デバッグ用に 'S' を出力してループへ)
    builder.emitData(20+8, [83]); // 'S' (ASCII 83)
    builder.emitInstruction(20, 0, 20+8, 9, 9, 0, LOOP_START);

    // Block 21: '1' が入力された場合の処理 (デバッグ用に 'T' を出力してループへ)
    builder.emitData(21+8, [84]); // 'T' (ASCII 84)
    builder.emitInstruction(21, 0, 21+8, 9, 9, 0, LOOP_START);


    fs.writeFileSync('encoder.inc', builder.build());
    console.log("IR Building complete. Dynamic Jump testing binary forged.");
}

main();
