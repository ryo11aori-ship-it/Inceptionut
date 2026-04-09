const fs=require('fs');
class FlatVMEncoderBuilder{
constructor(){
this.u=new Array(10).fill(0).map(()=>new Array(10).fill(0).map(()=>new Array(10).fill(0)));
this.im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
}
e(z,y,ax,ay,az,bx,by,bz,cx,cy,cz){
this.u[z][y][0]=ax;this.u[z][y][1]=ay;this.u[z][y][2]=az;
this.u[z][y][3]=bx;this.u[z][y][4]=by;this.u[z][y][5]=bz;
this.u[z][y][6]=cx;this.u[z][y][7]=cy;this.u[z][y][8]=cz;
this.u[z][y][9]=0;
}
build(){
let o="";
for(let z=0;z<10;z++)for(let y=0;y<10;y++)for(let x=0;x<10;x++)o+=this.im[this.u[z][y][x]];
fs.writeFileSync('encoder.inc',o);
console.log("The Pure Flat-VM Encoder forged.");
}
}
function main(){
let b=new FlatVMEncoderBuilder();
b.u[9][0][0]=8;b.u[9][0][1]=9;
let C8=[0,0,9],C9=[1,0,9],V_NEG32=[2,0,9],V_NEG9=[3,0,9];
let V_POS48=[4,0,9],TEMP=[5,0,9],TARGET=[6,0,9],ZERO=[7,0,9],I_O=[9,9,9];
let line=0;
function emit(A,B,C){
let z=Math.floor(line/10);let y=line%10;
let cx=C?C[0]:0;let cy=C?C[1]:(line+1)%10;let cz=C?C[2]:Math.floor((line+1)/10);
b.e(z,y,A[0],A[1],A[2],B[0],B[1],B[2],cx,cy,cz);
line++;
}
for(let i=0;i<4;i++)emit(C8,V_NEG32);
emit(C9,V_NEG9);
for(let i=0;i<6;i++)emit(C8,TEMP);
emit(TEMP,V_POS48);
emit(TEMP,TEMP);
let L13=[0,3,1],L14=[0,4,1],L15=[0,5,1];
emit(I_O,TEMP,L15);
emit(ZERO,ZERO,L14);
emit(TARGET,TARGET);
emit(TEMP,TARGET);
emit(V_POS48,TARGET);
emit(TEMP,TEMP);
let CY_ADDR=[7,2,2];
emit(CY_ADDR,CY_ADDR);
emit(TARGET,TEMP);
emit(TEMP,CY_ADDR);
emit(ZERO,ZERO,[0,0,3]);
line=30;
for(let d=0;d<10;d++){
let targetLine=40+d*5;
emit(ZERO,ZERO,[0,targetLine%10,Math.floor(targetLine/10)]);
}
line=40;
for(let d=0;d<10;d++){
let chars=b.im[d];
for(let i=0;i<4;i++)emit(chars[i]===' '?V_NEG32:V_NEG9,I_O);
emit(ZERO,ZERO,L13);
}
b.build();
}
main();
