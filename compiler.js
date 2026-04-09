const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (The Sacred 100)");
    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    
    // The Sacred 100
    // 次元ラップとOUTの絶対法則を、完全な幾何学バウンド(Triple Trampoline)で制圧した奇跡の配列
    let binary = [
        // Block 0: Bootloader (0を排除してBig Bangを着火し、[2,1]へ飛ぶ)
        // 最後に残る「5」は、PCを無限にバウンドさせるための重要な永久機関になります。
        9, 1, 9, 1, 2, 1, 5, 5, 5, 5,
        
        // Block 1: Orbital Slingshot ([2,1]で受け止め、安全な[0,2]へ射出)
        0, 0, 0, 9, 0, 9, 0, 2, 0, 0,
        
        // Block 2: Clear t1 (変数t1を0に初期化し、[0,4]へ飛ぶ)
        1, 9, 1, 9, 0, 4, 0, 0, 0, 0,
        
        // Block 3: 余白
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 4: IN & EOF Triple Bouncer
        // 文字なら[0,5]へ。EOFなら暴走し、バウンド計算の末に安全な[8,9](Halt Trap)へ落ちる
        9, 9, 1, 9, 0, 5, 8, 9, 1, 9,
        
        // Block 5: OUT & Loop Triple Bouncer
        // Aを出力。直後にPCが暴走するが、クッション「5」に当たって跳ね返り、[0,6]へ戻される
        1, 9, 9, 9, 3, 9, 0, 6, 9, 0,
        
        // Block 6: Relay (暴走から帰還したPCを[0,2]へ無事に送り返す)
        0, 9, 0, 9, 0, 2, 0, 0, 0, 0,
        
        // Block 7, 8: 真の虚無 (絶対にPCが到達しない安全な真空地帯)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 9: Variable Area & Black Hole
        // [0,9]はzero, [1,9]はt1, [3,9]はdummy。
        // [8,9]には「0 - 0 = 0 <= 0 -> Jump [8,9]」という完璧なブラックホールが仕掛けられています。
        0, 0, 8, 9, 0, 0, 0, 0, 0, 0
    ];

    let finalOut = "";
    for (let i = 0; i < binary.length; i++) {
        finalOut += invisibleMap[binary[i]];
    }
    
    fs.writeFileSync('out.inut', finalOut);
    console.log("Compilation successful. The Absolute Void has been reached.");
}
main();
