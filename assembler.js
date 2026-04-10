const fs=require('fs');
function main(){
console.log("Inceptionut Bootstrap Assembler");
let code=fs.readFileSync('src.asm','utf8');
let lines=code.split('\n');
let out="";
let map=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
for(let i=0;i<lines.length;i++){
let l=lines[i].trim();
if(l===""||l.startsWith("#"))continue;
let tokens=l.split(/\s+/);
for(let j=0;j<tokens.length;j++){
let v=parseInt(tokens[j],10);
if(v>=0&&v<=9)out+=map[v];
}
}
fs.writeFileSync('out.inut',out);
console.log("Assembly Complete. Binary written to out.inut");
console.log("Binary Size: "+out.length+" bytes.");
}
main();