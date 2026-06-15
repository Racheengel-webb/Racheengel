import { useState, useCallback, useRef, useEffect } from "react";

const PIECES = {
  wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',
  bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'
};

const initBoard = () => {
  const b = Array(8).fill(null).map(()=>Array(8).fill(null));
  ['R','N','B','Q','K','B','N','R'].forEach((p,i)=>{ b[0][i]='b'+p; b[7][i]='w'+p; });
  for(let i=0;i<8;i++){ b[1][i]='bP'; b[6][i]='wP'; }
  return b;
};

const color = p => p?p[0]:null;
const opp = c => c==='w'?'b':'w';
const inBounds = (r,c) => r>=0&&r<8&&c>=0&&c<8;

function pawnMoves(board,r,c,p,ep){
  const moves=[],col=color(p),dir=col==='w'?-1:1,startRow=col==='w'?6:1;
  if(inBounds(r+dir,c)&&!board[r+dir][c]){
    moves.push([r+dir,c]);
    if(r===startRow&&!board[r+2*dir][c]) moves.push([r+2*dir,c]);
  }
  for(const dc of[-1,1]) if(inBounds(r+dir,c+dc)){
    if(color(board[r+dir][c+dc])===opp(col)) moves.push([r+dir,c+dc]);
    if(ep&&ep[0]===r+dir&&ep[1]===c+dc) moves.push([r+dir,c+dc]);
  }
  return moves;
}
function slideMoves(board,r,c,dirs){
  const moves=[],col=color(board[r][c]);
  for(const [dr,dc] of dirs){ let nr=r+dr,nc=c+dc;
    while(inBounds(nr,nc)){ if(board[nr][nc]){if(color(board[nr][nc])!==col)moves.push([nr,nc]);break;} moves.push([nr,nc]);nr+=dr;nc+=dc; }
  } return moves;
}
function knightMoves(board,r,c){
  const col=color(board[r][c]);
  return [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    .map(([dr,dc])=>[r+dr,c+dc]).filter(([nr,nc])=>inBounds(nr,nc)&&color(board[nr][nc])!==col);
}
function kingMoves(board,r,c,cas){
  const moves=[],col=color(board[r][c]);
  for(const [dr,dc] of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){
    const nr=r+dr,nc=c+dc;
    if(inBounds(nr,nc)&&color(board[nr][nc])!==col) moves.push([nr,nc]);
  }
  if(cas&&col==='w'&&r===7&&c===4){ if(cas.wK&&!board[7][5]&&!board[7][6])moves.push([7,6]); if(cas.wQ&&!board[7][3]&&!board[7][2]&&!board[7][1])moves.push([7,2]); }
  if(cas&&col==='b'&&r===0&&c===4){ if(cas.bK&&!board[0][5]&&!board[0][6])moves.push([0,6]); if(cas.bQ&&!board[0][3]&&!board[0][2]&&!board[0][1])moves.push([0,2]); }
  return moves;
}
function getRawMoves(board,r,c,ep,cas){
  const p=board[r][c];if(!p)return[];const t=p[1];
  if(t==='P')return pawnMoves(board,r,c,p,ep);
  if(t==='N')return knightMoves(board,r,c);
  if(t==='R')return slideMoves(board,r,c,[[0,1],[0,-1],[1,0],[-1,0]]);
  if(t==='B')return slideMoves(board,r,c,[[1,1],[1,-1],[-1,1],[-1,-1]]);
  if(t==='Q')return slideMoves(board,r,c,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
  if(t==='K')return kingMoves(board,r,c,cas);
  return[];
}
function isInCheck(board,col){
  let kr=-1,kc=-1;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(board[r][c]===col+'K'){kr=r;kc=c;}
  if(kr===-1)return true;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(color(board[r][c])===opp(col)&&getRawMoves(board,r,c,null,null).some(([mr,mc])=>mr===kr&&mc===kc))return true;
  return false;
}
function applyMove(board,fr,fc,tr,tc,ep,cas,promo='Q'){
  const b=board.map(r=>[...r]),p=b[fr][fc],col=color(p);
  b[tr][tc]=p;b[fr][fc]=null;
  if(p[1]==='P'&&Math.abs(tc-fc)===1&&!board[tr][tc])b[fr][tc]=null;
  if(p[1]==='P'&&(tr===0||tr===7))b[tr][tc]=col+promo;
  if(p[1]==='K'&&fc===4&&tc===6){b[tr][5]=col+'R';b[tr][7]=null;}
  if(p[1]==='K'&&fc===4&&tc===2){b[tr][3]=col+'R';b[tr][0]=null;}
  return b;
}
function getLegal(board,r,c,ep,cas){
  const col=color(board[r][c]);
  return getRawMoves(board,r,c,ep,cas).filter(([tr,tc])=>!isInCheck(applyMove(board,r,c,tr,tc,ep,cas),col));
}

// AI
function evalBoard(b){ let s=0; const v={P:100,N:320,B:330,R:500,Q:900,K:20000};
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;s+=color(p)==='b'?v[p[1]]:-v[p[1]];} return s; }
function minimax(b,d,a,be,max,ep,cas){
  if(d===0)return evalBoard(b);
  const col=max?'b':'w',moves=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(color(b[r][c])===col)getLegal(b,r,c,ep,cas).forEach(([tr,tc])=>moves.push([r,c,tr,tc]));
  if(!moves.length)return isInCheck(b,col)?(max?-99999:99999):0;
  if(max){let best=-Infinity;for(const [fr,fc,tr,tc]of moves){const nb=applyMove(b,fr,fc,tr,tc,ep,cas);const nep=b[fr][fc][1]==='P'&&Math.abs(tr-fr)===2?[fr+(tr-fr)/2,fc]:null;best=Math.max(best,minimax(nb,d-1,a,be,false,nep,cas));a=Math.max(a,best);if(be<=a)break;}return best;}
  else{let best=Infinity;for(const [fr,fc,tr,tc]of moves){const nb=applyMove(b,fr,fc,tr,tc,ep,cas);const nep=b[fr][fc][1]==='P'&&Math.abs(tr-fr)===2?[fr+(tr-fr)/2,fc]:null;best=Math.min(best,minimax(nb,d-1,a,be,true,nep,cas));be=Math.min(be,best);if(be<=a)break;}return best;}
}
function eloToParams(elo){
  if(elo<800)return{depth:1,noise:1.0};if(elo<1000)return{depth:1,noise:0.6};
  if(elo<1200)return{depth:2,noise:0.4};if(elo<1400)return{depth:2,noise:0.2};
  if(elo<1600)return{depth:2,noise:0.08};if(elo<1800)return{depth:3,noise:0.04};
  if(elo<2000)return{depth:3,noise:0.01};return{depth:4,noise:0};
}
function eloLabel(e){
  if(e<800)return'Anfänger';if(e<1000)return'Einsteiger';if(e<1200)return'Fortgeschritten';
  if(e<1400)return'Club-Spieler';if(e<1600)return'Erfahren';if(e<1800)return'Stark';
  if(e<2000)return'Expert';return'Meister';
}
function getBestMove(board,ep,cas,elo){
  const {depth,noise}=eloToParams(elo);let best=null,bestVal=-Infinity;
  const moves=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(color(board[r][c])==='b')getLegal(board,r,c,ep,cas).forEach(([tr,tc])=>moves.push([r,c,tr,tc]));
  moves.sort(()=>Math.random()-0.5);
  for(const [fr,fc,tr,tc]of moves){const nb=applyMove(board,fr,fc,tr,tc,ep,cas);const nep=board[fr][fc][1]==='P'&&Math.abs(tr-fr)===2?[fr+(tr-fr)/2,fc]:null;
    let v=minimax(nb,depth,-Infinity,Infinity,false,nep,cas)+noise*(Math.random()-0.5)*400;
    if(v>bestVal){bestVal=v;best=[fr,fc,tr,tc];}}
  return best;
}

// lichess time controls
const LICHESS_TCS = [
  {label:'Bullet 1+0', tc:'1+0'},{label:'Bullet 2+1', tc:'2+1'},
  {label:'Blitz 3+0', tc:'3+0'},{label:'Blitz 5+0', tc:'5+0'},
  {label:'Rapid 10+0', tc:'10+0'},{label:'Classical 15+15', tc:'15+15'},
];

export default function Chess(){
  const [mode,setMode]=useState(null); // 'ai' | 'local' | 'online'
  const [board,setBoard]=useState(initBoard);
  const [selected,setSelected]=useState(null);
  const [legalMoves,setLegalMoves]=useState([]);
  const [turn,setTurn]=useState('w');
  const [ep,setEp]=useState(null);
  const [cas,setCas]=useState({wK:true,wQ:true,bK:true,bQ:true});
  const [status,setStatus]=useState('');
  const [gameOver,setGameOver]=useState(false);
  const [lastMove,setLastMove]=useState(null);
  const [elo,setElo]=useState(1200);
  const [selectedTc,setSelectedTc]=useState('5+0');
  const eloRef=useRef(elo);
  useEffect(()=>{eloRef.current=elo;},[elo]);

  const checkState=useCallback((b,col,nep,ncas)=>{
    const moves=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(color(b[r][c])===col)getLegal(b,r,c,nep,ncas).forEach(m=>moves.push(m));
    if(!moves.length){
      if(isInCheck(b,col)){setStatus(col==='w'?'Schachmatt! Schwarz gewinnt 🎉':'Schachmatt! Weiß gewinnt 🎉');setGameOver(true);}
      else{setStatus('Patt! Unentschieden');setGameOver(true);}
      return true;
    }
    if(isInCheck(b,col))setStatus(col==='w'?'Schach! Weiß am Zug':'Schach! Schwarz am Zug');
    else setStatus(col==='w'?'Weiß am Zug':'Schwarz am Zug');
    return false;
  },[]);

  const doAI=useCallback((b,nep,ncas)=>{
    setTimeout(()=>{
      const mv=getBestMove(b,nep,ncas,eloRef.current);
      if(!mv){setStatus('Keine Züge');setGameOver(true);return;}
      const [fr,fc,tr,tc]=mv,nb=applyMove(b,fr,fc,tr,tc,nep,ncas);
      const nnep=b[fr][fc][1]==='P'&&Math.abs(tr-fr)===2?[fr+(tr-fr)/2,fc]:null;
      const ncas2={...ncas};
      if(b[fr][fc]==='bK'){ncas2.bK=false;ncas2.bQ=false;}
      if(b[fr][fc]==='bR'){if(fr===0&&fc===0)ncas2.bQ=false;if(fr===0&&fc===7)ncas2.bK=false;}
      setBoard(nb);setEp(nnep);setCas(ncas2);setTurn('w');setLastMove([fr,fc,tr,tc]);
      checkState(nb,'w',nnep,ncas2);
    },300);
  },[checkState]);

  const startGame=m=>{
    setMode(m);setBoard(initBoard());setSelected(null);setLegalMoves([]);
    setTurn('w');setEp(null);setCas({wK:true,wQ:true,bK:true,bQ:true});
    setGameOver(false);setLastMove(null);
    setStatus(m==='ai'?'Du spielst Weiß':m==='local'?'Weiß am Zug':'');
  };

  const handleClick=(r,c)=>{
    if(gameOver)return;
    if(mode==='ai'&&turn!=='w')return;
    if(selected){
      const [sr,sc]=selected;
      if(legalMoves.some(([mr,mc])=>mr===r&&mc===c)){
        const nb=applyMove(board,sr,sc,r,c,ep,cas);
        const nep=board[sr][sc][1]==='P'&&Math.abs(r-sr)===2?[sr+(r-sr)/2,sc]:null;
        const ncas={...cas};
        const moved=board[sr][sc];
        if(moved==='wK'){ncas.wK=false;ncas.wQ=false;}if(moved==='bK'){ncas.bK=false;ncas.bQ=false;}
        if(moved==='wR'){if(sr===7&&sc===0)ncas.wQ=false;if(sr===7&&sc===7)ncas.wK=false;}
        if(moved==='bR'){if(sr===0&&sc===0)ncas.bQ=false;if(sr===0&&sc===7)ncas.bK=false;}
        const next=opp(turn);
        setBoard(nb);setEp(nep);setCas(ncas);setTurn(next);
        setSelected(null);setLegalMoves([]);setLastMove([sr,sc,r,c]);
        const over=checkState(nb,next,nep,ncas);
        if(!over&&mode==='ai') doAI(nb,nep,ncas);
      } else {
        if(color(board[r][c])===turn){setSelected([r,c]);setLegalMoves(getLegal(board,r,c,ep,cas));}
        else{setSelected(null);setLegalMoves([]);}
      }
    } else {
      if(color(board[r][c])===turn){setSelected([r,c]);setLegalMoves(getLegal(board,r,c,ep,cas));}
    }
  };

  const reset=()=>startGame(mode);
  const files=['a','b','c','d','e','f','g','h'];

  // ── MENU ──
  if(!mode) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'2rem 1rem',gap:'1rem',fontFamily:'var(--font-sans)'}}>
      <div style={{fontSize:28}}>♟ Schach</div>
      <div style={{display:'grid',gap:12,width:'100%',maxWidth:360}}>
        {[
          {m:'ai',icon:'🤖',title:'Gegen KI spielen',sub:'Schwierigkeit per ELO wählbar'},
          {m:'local',icon:'🧑‍🤝‍🧑',title:'Lokal 2 Spieler',sub:'Beide am selben Gerät'},
          {m:'online',icon:'🌐',title:'Online Multiplayer',sub:'Über lichess.org gegen echte Spieler'},
        ].map(({m,icon,title,sub})=>(
          <button key={m} onClick={()=>m==='online'?setMode('online'):startGame(m)}
            style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',cursor:'pointer',borderRadius:'var(--border-radius-lg)',textAlign:'left',background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-secondary)'}}>
            <span style={{fontSize:28}}>{icon}</span>
            <div><div style={{fontWeight:500,fontSize:15,color:'var(--color-text-primary)'}}>{title}</div>
            <div style={{fontSize:13,color:'var(--color-text-secondary)',marginTop:2}}>{sub}</div></div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── ONLINE ──
  if(mode==='online') return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'2rem 1rem',gap:'1rem',fontFamily:'var(--font-sans)',maxWidth:400,margin:'0 auto'}}>
      <div style={{fontSize:22,fontWeight:500}}>🌐 Online Multiplayer</div>
      <p style={{fontSize:14,color:'var(--color-text-secondary)',textAlign:'center',margin:0}}>
        Wähle eine Zeitkontrolle und starte direkt auf <strong>lichess.org</strong> – kostenlos, ohne Anmeldung möglich.
      </p>
      <div style={{width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {LICHESS_TCS.map(({label,tc})=>(
          <button key={tc} onClick={()=>setSelectedTc(tc)}
            style={{padding:'10px 0',cursor:'pointer',borderRadius:'var(--border-radius-md)',fontSize:14,fontWeight:selectedTc===tc?500:400,
              background:selectedTc===tc?'var(--color-background-info)':'var(--color-background-primary)',
              color:selectedTc===tc?'var(--color-text-info)':'var(--color-text-primary)',
              border:selectedTc===tc?'1.5px solid var(--color-border-info)':'0.5px solid var(--color-border-secondary)'}}>
            {label}
          </button>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,width:'100%'}}>
        <a href={`https://lichess.org/?time=${selectedTc.split('+')[0]}&increment=${selectedTc.split('+')[1]}`}
          target="_blank" rel="noopener noreferrer"
          style={{display:'block',textAlign:'center',padding:'12px',borderRadius:'var(--border-radius-lg)',background:'var(--color-background-info)',color:'var(--color-text-info)',fontWeight:500,fontSize:15,textDecoration:'none',border:'0.5px solid var(--color-border-info)'}}>
          🎮 Spiel auf lichess.org starten ↗
        </a>
        <a href="https://lichess.org/friend" target="_blank" rel="noopener noreferrer"
          style={{display:'block',textAlign:'center',padding:'10px',borderRadius:'var(--border-radius-lg)',fontSize:14,color:'var(--color-text-secondary)',textDecoration:'none',border:'0.5px solid var(--color-border-tertiary)'}}>
          Freund einladen (Herausforderung) ↗
        </a>
      </div>
      <button onClick={()=>setMode(null)} style={{fontSize:13,color:'var(--color-text-tertiary)',background:'none',border:'none',cursor:'pointer',marginTop:4}}>← Zurück</button>
    </div>
  );

  // ── BOARD ──
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0.75rem 0',fontFamily:'var(--font-sans)'}}>
      {mode==='ai'&&(
        <div style={{width:'100%',maxWidth:472,marginBottom:'0.75rem',padding:'0.65rem 1rem',background:'var(--color-background-secondary)',borderRadius:'var(--border-radius-lg)',border:'0.5px solid var(--color-border-tertiary)'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:'var(--color-text-secondary)'}}>KI-Stärke</span>
            <span style={{fontSize:13,fontWeight:500}}>{elo} ELO — <span style={{color:'var(--color-text-secondary)'}}>{eloLabel(elo)}</span></span>
          </div>
          <input type="range" min={600} max={2200} step={100} value={elo} onChange={e=>setElo(+e.target.value)} style={{width:'100%'}}/>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--color-text-tertiary)',marginTop:2}}><span>600</span><span>1200</span><span>1800</span><span>2200</span></div>
        </div>
      )}
      {mode==='local'&&(
        <div style={{marginBottom:'0.5rem',fontSize:13,color:'var(--color-text-secondary)'}}>
          🧑‍🤝‍🧑 Lokal — abwechselnd am selben Gerät
        </div>
      )}
      <div style={{marginBottom:'0.5rem',fontSize:14,color:'var(--color-text-secondary)',fontWeight:500}}>{status}</div>
      <div style={{display:'inline-block',border:'1.5px solid var(--color-border-secondary)',borderRadius:'var(--border-radius-md)',overflow:'hidden',userSelect:'none'}}>
        {[0,1,2,3,4,5,6,7].map(r=>(
          <div key={r} style={{display:'flex'}}>
            <div style={{width:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'var(--color-text-tertiary)',background:'var(--color-background-secondary)'}}>{8-r}</div>
            {[0,1,2,3,4,5,6,7].map(c=>{
              const isLight=(r+c)%2===0;
              const isSel=selected&&selected[0]===r&&selected[1]===c;
              const isLegal=legalMoves.some(([mr,mc])=>mr===r&&mc===c);
              const isLast=lastMove&&((lastMove[0]===r&&lastMove[1]===c)||(lastMove[2]===r&&lastMove[3]===c));
              let bg=isLight?'#F0D9B5':'#B58863';
              if(isSel)bg='#F6F669';
              else if(isLast)bg=isLight?'#CDD26A':'#AABA53';
              const p=board[r][c];
              return (
                <div key={c} onClick={()=>handleClick(r,c)}
                  style={{width:56,height:56,background:bg,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative',fontSize:36,lineHeight:1}}>
                  {isLegal&&!p&&<div style={{width:18,height:18,borderRadius:'50%',background:'rgba(0,0,0,0.18)',pointerEvents:'none'}}/>}
                  {isLegal&&p&&<div style={{position:'absolute',inset:0,border:'3px solid rgba(0,0,0,0.25)',borderRadius:2,pointerEvents:'none'}}/>}
                  {p&&<span style={{zIndex:1}}>{PIECES[p]}</span>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{display:'flex',background:'var(--color-background-secondary)'}}>
          <div style={{width:20}}/>
          {['a','b','c','d','e','f','g','h'].map(f=>(
            <div key={f} style={{width:56,textAlign:'center',fontSize:11,color:'var(--color-text-tertiary)',padding:'2px 0'}}>{f}</div>
          ))}
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:'0.75rem'}}>
        <button onClick={reset} style={{padding:'8px 20px',fontSize:13,cursor:'pointer'}}>Neues Spiel</button>
        <button onClick={()=>setMode(null)} style={{padding:'8px 20px',fontSize:13,cursor:'pointer'}}>← Menü</button>
      </div>
    </div>
  );
}
