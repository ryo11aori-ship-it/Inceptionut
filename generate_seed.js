const fs = require('fs');

class InceptionutBuilder {
    constructor() {
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
    console.log("Inceptionut IR Builder - The Perfect Intra-Block Bounce");
    let builder = new InceptionutBuilder();

    const BOOT = 0;
    const SLINGSHOT = 1;
    const LOOP_START = 2;
    const IN_BLOCK = 3;
    const OUT_BLOCK = 4;
    const HALT_BLOCK = 9;

    // 変数 t1 は安全な Block 8 に配置
    
    // 0. Bootloader (起動して [2,1] へジャンプ)
    builder.universe[BOOT] = [9, 1, 9, 1, 2, 1, 5, 5, 5, 5];

    // 1. Slingshot (PC=[2,1] から読み始め、安全に [0,2] へ射出する)
    builder.universe[SLINGSHOT] = [0, 0, 0, 0, 0, 7, 0, 2, 0, 0];

    // 2. Clear Variable (変数を0に初期化して [0,3] へ)
    builder.universe[LOOP_START] = [0, 8, 0, 8, 0, 3, 0, 0, 0, 0];

    // 3. IN_BLOCK (PC=0: 文字なら[0,4]へ / EOFなら内部バウンドして[0,9]へ脱出)
    builder.universe[IN_BLOCK] = [9, 9, 0, 8, 0, 4, 0, 9, 0, 0];

    // 4. OUT_BLOCK (PC=0: 出力後、内部バウンドして[0,2]へ脱出)
    builder.universe[OUT_BLOCK] = [0, 8, 9, 9, 0, 8, 0, 2, 0, 0];

    // 9. Halt Trap (無限ループによる安全な停止)
    builder.universe[HALT_BLOCK] = [0, 9, 0, 9, 0, 9, 0, 9, 0, 9];

    fs.writeFileSync('echo.inc', builder.build());
    console.log("Native binary forged.");
}

main();
