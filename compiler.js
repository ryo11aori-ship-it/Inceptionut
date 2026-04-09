const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (Absolute Void Proof)");
    let code;
    try { code = fs.readFileSync('echo.imac', 'utf8'); } catch(e) { return; }

    let lines = code.split('\n');
    let instructions = [];
    let labels = {};

    // Dim 1の空間(100要素)に完璧に収めるため、変数の座標を固定
    // ※Trampolineの数学的証明により、zeroのX座標は必ず0である必要があります
    let vars = {
        "zero": [0, 9],
        "temp": [2, 9]
    };

    let blockIndex = 2; // Block 0=Boot, 1=Slingshot

    for (let i=0; i<lines.length; i++) {
        let l = lines[i].split('#')[0].trim();
        if(!l || l.startsWith('.var ')) continue;
        if(l.endsWith(':')) {
            labels[l.slice(0, -1)] = blockIndex;
        } else {
            instructions.push(l.split(/\s+/));
            blockIndex++;
        }
    }

    function toDim(addr) {
        return [0, addr]; // 命令は常にドーナツの先頭 [0, Y] から開始する
    }

    const IO_PORT = [9, 9];
    const BOOT_ONE = [9, 0]; // Bootloaderが残した "1"

    let outputBinary = [];

    // Block 0: Bootloader (0を排除してBig Bangを着火し、[1,1]へ飛ぶ)
    outputBinary.push(9, 1, 9, 1, 1, 1, 1, 1, 1, 1);

    // Block 1: Orbital Slingshot ([1,1]で受け止め、安全な[0,2]へ射出)
    outputBinary.push(0, 9, 1, 9, 1, 0, 2, 0, 0, 0);

    for (let i=0; i<instructions.length; i++) {
        let toks = instructions[i];
        let A = toks[0];
        let B = toks[1];
        let fallthrough = i + 2 + 1;
        let C = toks[2] || fallthrough.toString();

        function resolve(op) {
            if (op === "IN" || op === "OUT") return IO_PORT;
            if (vars[op] !== undefined) return vars[op];
            if (labels[op] !== undefined) return toDim(labels[op]);
            if (!isNaN(parseInt(op))) return toDim(parseInt(op));
            console.log("Compiler Error: Unknown token " + op);
            process.exit(1);
        }

        if (B === "OUT") {
            // The Double-Fallthrough Trampoline (OUT専用の特殊幾何学ブロック)
            outputBinary.push(...resolve(A));
            outputBinary.push(...IO_PORT);
            outputBinary.push(...vars["zero"]);
            outputBinary.push(...resolve(C));
            outputBinary.push(...BOOT_ONE);
        } else {
            // Standard Block
            outputBinary.push(...resolve(A));
            outputBinary.push(...resolve(B));
            outputBinary.push(...resolve(C));
            outputBinary.push(0, 0, 0, 0); // 到達不能な余白(パディング)
        }
    }

    // Block 9: Variables Area (初期値0で埋める)
    outputBinary.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    let finalOut = "";

    for (let i=0; i<outputBinary.length; i++) {
        let val = outputBinary[i];
        if (val >= 0 && val <= 9) {
            finalOut += invisibleMap[val];
        } else {
            console.log("CRITICAL: Out of bounds value: " + val);
        }
    }

    fs.writeFileSync('out.inut', finalOut);
    console.log("Compilation successful. Binary Elements: " + outputBinary.length + ", Bits: " + finalOut.length);
}
main();
