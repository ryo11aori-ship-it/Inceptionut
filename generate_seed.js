const fs=require('fs');
class Dim2Builder{
constructor(){
this.u=new Array(10).fill(0).map(()=>new Array(10).fill(0).map(()=>new Array(10).fill(0)));
this.im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
e(z,y,ax,ay,az,bx,by,bz,cx,cy,cz){
this.u[z][y][0]=ax;this.u[z][y][1]=ay;this.u[z][y][2]=az;
this.u[z][y][3]=bx;this.u[z][y][4]=by;this.u[z][y][5]=bz;
this.u[z][y][6]=cx;this.u[z][y][7]=cy;this.u[z][y][8]=cz;
}
s(ic){
console.log("[Simulator] Starting Internal Verification...");
let p=[0,0,0];
let inps=ic.split('').map(c=>c.charCodeAt(0));
let ip=0;let cy=0;
while(cy++<10000){
let ax=this.u[p[2]][p[1]][0],ay=this.u[p[2]][p[1]][1],az=this.u[p[2]][p[1]][2];
let bx=this.u[p[2]][p[1]][3],by=this.u[p[2]][p[1]][4],bz=this.u[p[2]][p[1]][5];
let cx=this.u[p[2]][p[1]][6],cy_=this.u[p[2]][p[1]][7],cz=this.u[p[2]][p[1]][8];
let va=(ax===9&&ay===9&&az===9)?(ip<inps.length?inps[ip++]:-1):this.u[az][ay][ax];
let vb=(bx===9&&by===9&&bz===9)?0:this.u[bz][by][bx];
let r=vb-va;
if(bx===9&&by===9&&bz===9){console.log(`[Simulator] Output: ${r&255}`);}
else{this.u[bz][by][bx]=r;}
if(r<=0){
if(p[0]===cx&&p[1]===cy_&&p[2]===cz){console.log("[Simulator] SUCCESS: Expected Halt Reached.");return true;}
p=[cx,cy_,cz];
}else{
p=[0,(p[1]+1)%10,p[2]];
}
}
throw new Error("[Simulator] CRASH: Infinite Loop Timeout");
}
b(){
let o="";
for(let z=0;z<10;z++)for(let y=0;y<10;y++)for(let x=0;x<10;x++)o+=this.im[this.u[z][y][x]];
fs.writeFileSync('encoder.inc',o);
console.log("Binary forged and verified.");
}
}
function main(){
let b=new Dim2Builder();
b.e(0,0,1,0,1,1,0,1,0,1,0);
b.e(0,1,9,9,9,1,0,1,0,3,0);
b.e(0,2,0,0,1,0,0,1,0,2,0);
b.e(0,3,1,0,1,9,9,9,0,0,0);
b.e(0,4,0,0,1,0,0,1,0,0,0);
try{b.s("019");b.b();}catch(e){console.error(e.message);process.exit(1);}
}
main();
