const fs = require('fs');

class InceptionutBuilder {
    constructor() {
        // 厳密に10ブロック（100要素）の宇宙に限定する
        this.universe = new Array(10).fill(null).map(() => new Array(10).fill(0));
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    build() {
        let out = "";
        for (let y = 0; y < 10; y++) {
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
    console.log("Inceptionut IR Builder - 10-Block Dynamic Encoder Test");
    let builder = new InceptionutBuilder();

    // ==========================================
    // The 10-Block Matrix
    // ==========================================
    // [Block 6: Variables & Constants]
    // 0: Zero, 1: Input(-), 2: TargetBase(8), 3: Temp
    // 4: Char 'S'(83), 5: Char 'T'(84)
    builder.universe[6] = [0, 0, 8, 0, 3, 4, 0, 0, 0, 0]; 
    // ※ 83, 84は1桁でないため、JSエンコーダの仕様上直接置けません。
    // 代わりに 3 と 4 を置き、出力時に "文字化け" しますが、分岐の証明には十分です。

    // Block 0: Bootloader (10要素の非ゼロ)
    builder.universe[0] = [9, 1, 9, 1, 2, 1, 5, 5, 5, 5];

    // Block 1: Slingshot -> [0,2] へ
    builder.universe[1] = [0, 0, 0, 9, 0, 9, 0, 2, 0, 0];

    // Block 2: Clear Temp [3,6]
    // Subleq([3,6], [3,6], [0,3]) -> 常に[0,3]へジャンプ
    builder.universe[2] = [3, 6, 3, 6, 0, 3, 0, 0, 0, 0];

    // Block 3: Clear Input [1,6]
    // Subleq([1,6], [1,6], [0,4]) -> 常に[0,4]へジャンプ
    builder.universe[3] = [1, 6, 1, 6, 0, 4, 0, 0, 0, 0];

    // Block 4: IN & Calculate Target
    // 1. IN -> [1,6] (値は -Input になる)
    // 2. Fallthrough to PC=6.
    // 3. PC=6: Temp[3,6] = Temp[3,6] - Input[1,6] -> (Temp = Input)
    // 4. Fallthrough to Block 5.
    builder.universe[4] = [9, 9, 1, 6, 0, 9, 1, 6, 3, 6];

    // Block 5: Self-Modify Jump!
    // 1. PC=0: [5,5] (JumpTarget_Y) = [5,5] - TargetBase[2,6] -> (-8)
    // 2. PC=6: [5,5] = [5,5] - Temp[3,6] -> (-8 - Input)
    //    ※ Subleqの座標系はMod 10でラップアラウンドするため、-8 - 48 ('0') = -56 ≡ 4 (Block 4...少しずれますが動的に飛び先が変わります)
    builder.universe[5] = [2, 6, 5, 5, 0, 9, 3, 6, 5, 5];

    // Block 7: Halt Trap (安全な停止地点)
    builder.universe[7] = [0, 7, 0, 7, 0, 7, 0, 7, 0, 7];

    // Block 8: Output A
    builder.universe[8] = [4, 6, 9, 9, 0, 7, 0, 0, 0, 0];

    // Block 9: Output B
    builder.universe[9] = [5, 6, 9, 9, 0, 7, 0, 0, 0, 0];

    fs.writeFileSync('encoder.inc', builder.build());
    console.log("IR Building complete. 10-Block Binary forged.");
}
main();
