"use strict";

const CHRHEIGHT       = 9;                                 //キャラの高さ
const CHRWIDTH        = 8;                                 //キャラの幅
const FONT            = "12px monospace";                  //使用フォント
const FONTSTYLE       = "#ffffff";                         //文字の色
const HEIGHT          = 120;                               //仮装画面サイズの高さ
const WIDTH           = 128;                               //仮装画面サイズの幅
const INTERVAL        = 33;                                //フレーム呼び出し間隔
const MAP_HEIGHT      = 32;                                //マップの高さ
const MAP_WIDTH       = 32;                                //マップの幅
const SCR_HEIGHT      = 8;                                 //画面タイルサイズ半分の高さ
const SCR_WIDTH       = 8;                                 //画面タイルサイズ半分の幅
const SCROLL          = 1;                                 //スクロール速度
const SMOOTH          = 0;                                 //補間処理
const START_HP        = 50;                                //開始HP
const START_X         = 16;                                //開始位置X
const START_Y         = 11;                                //開始位置Y
const TILECOLUMN      = 8;                                 //タイル桁数
const TILEROW         = 8;                                 //タイル行数
const TILESIZE        = 8;                                 //タイルサイズ
const WNDSTYLE        = "rgba(0,0,0,0.75)";              //ウィンドウの色
const gKey            = new Uint8Array(0x100);             //キー入力バッファ

let   gAngle          = 0;                                 //プレイヤーの向き
let   gEx             = 0;                                 //プレイヤーの経験値
let   gHP             = START_HP;                          //プレイヤーのHP
let   gMHP            = START_HP;                          //プレイヤーの最大HP
let   gLv             = 1;                                 //プレイヤーのレベル
let   gGold           = 100;                               //所持金
let   gPotion1        = 0;                                 //ポーション1の数
let   gPotion2        = 0;                                 //ポーション2の数
let   gCursor         = 0;                                 //カーソル位置
let   gCursorX        = 0;                                 //カーソル位置
let   gCursorY        = 0;                                 //カーソル位置
let   gEnemyHP;                                            //敵のHP
let   gEnemyType;                                          //敵種別
let   gFrame          = 0;                                 //内部カウンタ
let   gHeight;                                             //実画面の高さ
let   gWidth;                                              //実画面の幅
let   gImgBoss;                                            //魔王画像
let   gImgMap;                                             //マップ画像
let   gImgMonster;                                         //モンスター画像
let   gImgPlayer;                                          //プレイヤー画像
let   gImgStageBoss1;                                      //スライム画像
let   gImgStageBoss2;                                      //コウモリ画像
let   gImgStageBoss3;                                      //ドラゴン画像
let   gImgStageBoss4;                                      //スケルトン画像
let   gImgPotion1;                                         //ポーション1画像
let   gImgPotion2;                                         //ポーション2画像
let   gItem           = 0;                                 //所持アイテム
let   gMessage1       = null;                              //表示メッセージ1
let   gMessage2       = null;                              //表示メッセージ2
let   gMessage3       = null;                              //表示メッセージ3
let   gMessage4       = null;                              //表示メッセージ4
let   gMoveX          = 0;                                 //移動量X
let   gMoveY          = 0;                                 //移動量Y
let   gOrder;                                              //行動順
let   gPhase          = 0;                                 //戦闘フェーズ
let   gPlayerX        = START_X * TILESIZE + TILESIZE / 2; //プレイヤー座標X
let   gPlayerY        = START_Y * TILESIZE + TILESIZE / 2; //プレイヤー座標Y

const gFileBoss       = "../img/boss1.png";
const gFileMap        = "../img/map2.png";
const gFileMonster    = "../img/monster1.png"
const gFilePlayer     = "../img/player1.png";
const gFileStageboss1 = "../img/bigslime.png";
const gFileStageboss2 = "../img/bigbat.png";
const gFileStageboss3 = "../img/bigdragon.png";
const gFileStageboss4 = "../img/bigbone.png";
const gFilePotion1    = "../img/potion1.png";
const gFilePotion2    = "../img/potion2.png";

const gEncounter      = [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const gMonsterName    = ["すらいむ","こうもり","どらごん","すけるとん","スライム","コウモリ","ドラゴン","スケルトン","魔王"];

//マップ
const gMapOverworld = [
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,30,12,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,30,30,30,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,30,30,30,12,12,30,30,30,30,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,30,30,12,12,12,30,30,30,30,30,30,30,12,12,12,12,12,12,30,13,12,12,12,12,12,12,
 12,12,12,12,12,12,30,30,30,30,30,30,30,30,30,30,12,12,30,12,12,12,12,13,13,30,30,30,13,12,12,12,
 12,12,12,12,12,12,12,30,30,13,30,18,19,30,30,30,30,12,12,12,12,12,12,30,13,13,13,13,30,12,12,12,
 12,12,12,12,12,12,12,30,13,30,30,30,30,30,30,30,30,12,12,12,12,12,13,30,13,17,13,30,13,12,12,12,
 12,12,12,12,12,30,30,13,30,30,13,30,30,13,30,13,30,12,12,12,12,12,30,13,31,13,13,12,12,12,12,12,
 12,12,12,12,30,30,13,30,30,13,30,13,30,13,13,30,30,30,30,30,12,12,13,31,30,13,30,30,12,12,12,12,
 12,12,12,30,12,30,30,30,13,30,30,30,13, 4, 4,30,30,30,30,30,30,30,30,31,13,30,13,13,12,12,12,12,
 12,12,12,12,12,12,30,13,13,30,13,13,30,30, 4, 4, 4,30,30,30,30,30,31,30,12,12,12,13,12,12,12,12,
 12,12,12,12,12,12,12,30,30,13,13,30,13,13,13,13, 4, 4, 4,30,30,30,30,30,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,30,30,13,30,13,30,13,13,30,13,30,30, 4, 4,30,30,30,12,12,12,12,12,12,12,12,
 12,12,12,12,30,12,12,12,12,30,13,13,13,13,30,13,30,30,30,30, 4, 4, 4, 4,12,12,12,12,12,12,12,12,
 12,12,30,30,30,30,12,12,12,13,30,13,30,13,20,21,13,30,13,30,30, 4, 4, 4,12,12,12,12,12,12,12,12,
 12,30,30,56,57,13,30,30,13,30,13,13,13,30,28,29,30,13,30,13,30,30, 4,12,12,12,12,12,12,12,12,12,
 12,30,30,30,13,30,30,13,13,13,13,13,30,13,13,30,30,13,30,31,13,13,12,12,12,12,12,12,12,12,12,12,
 12,12,30,30,30,13,13,13,30,30,13,30,13,13,30,13,13,30,13,13,31,30,12,12,12,12,12,13,13,12,12,12,
 12,12,30,30,30,30,30,13,30,13,13,13,30,30,13,30,13,13,31,31,13,13,12,12,12,12,13,13,12,12,12,12,
 12,12,30,30,30,30,30,30,13,13,30,13,13,13,30,13,13,31,13,30,13,12,12,12,13,13,13,13,13,13,12,12,
 12,12,30,30,30,13,30,13,30,30,13,13,13,13,13,30,13,13,31,13,13,12,12,12,12,13,13,14,15,13,13,12,
 12,12,30,12,30,30,13,30,30,13,13,30,13,13,13,13,13,13,31,13,13,13,12,12,12,12,13,22,23,13,13,12,
 12,12,12,12,12,30,30,30,30,30,46,47,13,30,12,12,12,13,13,13,13,13,12,12,12,13,13,13,13,13,12,12,
 12,12,12,12,12,30,30,30,30,13,30,30,13,13,30,12,12,12,13,13,13,12,12,13,13,16,13,13,13,12,12,12,
 12,12,12,12,12,30,30,30,30,30,30,30,30,30,30,12,12,12,12,13,13,13,13,13,13,12,13,13,12,12,12,12,
 12,12,12,12,30,30,30,30,30,30,30,30,30,30,12,12,12,12,12,12,13,13,13,13,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,30,30,30,30,30,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
 12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,
];


const gMapCastle = [
 43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,
 43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,
 43,43, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33, 0, 1,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33, 8, 9,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,44,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,45,45,37,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,39,45,45, 5,43,43,
 43,43, 5,45,45,37,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,38,39,45,45, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,32,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,33,34,27,27, 5,43,43,
 43,43, 5,27,27,40,41,41,41,41,41,41,41,41,35,33,33,36,41,41,41,41,41,41,41,41,42,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,32,33,33,34,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,32,33,33,34,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,32,33,33,34,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2,40,41,41,42, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,43,43,
 43,43, 5,27,27,27,27,53,54,27,27, 7,27,10,27,27,27,27,11,27, 7,27,27,27,53,54,27,27,27, 5,43,43,
 43,43, 5,27,27,27, 6,61,62,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 6,61,62,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5,27,27,27,27,27,27,27,27,27,27,27,48,49,50,51,27,27,27,27,27,27,27,27,27,27,27, 5,43,43,
 43,43, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,43,43,
 43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,
 43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,
];

let gCurrentMap = gMapCastle; //初期状態ではフィールドマップ

//戦闘行動処理
function Action(){
  gPhase ++;                        //フェーズ経過

  if(((gPhase + gOrder) & 1) == 0){ //敵の行動順の場合
    const d = GetDamage(gEnemyHP / 2);
    if(gCursorX == 1 && gCursorY == 0){  // 防御を選択していた場合
      if(Math.random() < 0.5){           // 50%の確率で防御成功
        SetMessage("防御成功！","攻撃を防いだ！",null,null);
        g.fillText(" ",5 + 60 * gCursorX,96 + 14 * gCursorY); //カーソル描画
        gPhase = 2;                      // 戦闘コマンド選択フェーズに戻る
        return;
      }
    }
    SetMessage(gMonsterName[gEnemyType] + "の攻撃！",d + "のダメージ！",null,null);
    gHP = Math.max(0,gHP - d);      //プレイヤーのHP減少
    if(gHP <= 0){                   //プレイヤーが死亡した場合
      gPhase = 7;                   //死亡フェーズ
    }
    return;
  }

  //プレイヤーの行動順
  if(gCursorX == 0 && gCursorY == 0){                 //「戦う」選択時
    const d = GetDamage(gLv + 1);   //ダメージ計算結果取得
    SetMessage("あなたの攻撃！",d + "のダメージ！",null,null);
    gEnemyHP = Math.max(0,gEnemyHP - d);
    if(gEnemyHP <= 0){
      gPhase = 5;
    }
    return;
  }

  if(gCursorX == 0 && gCursorY == 1){
    gPhase = 30;                   // 回復フェーズへ移行
    gCursor = 0;
    SetMessage("  ﾐﾆ回復ポーション","  ﾚｱ回復ポーション",null,null);
  }

  if(gCursorX == 1 && gCursorY == 1){
    if(Math.random() < 0.4){          //「逃げる」成功時
      SetMessage("おめでとう！","逃げ出せたよ！",null,null);
      gPhase = 0;
      return;
    }
    //「逃げる」失敗時
    SetMessage("残念…","回り込まれちゃった。",null,null);
  }
}

//経験値加算処理
function AddExp(val){
  gEx += val;
  while(gLv * (gLv + 1) * 2 <= gEx){           //レベルアップ条件を満たしている場合
    gLv ++;
    gMHP += 4 + Math.floor(Math.random() * 3); //最大HP上昇4〜6
  }
  const goldDrops = [0,10,12,14,16,20,22,24,26,0];
  const enemyTypeIndex = Math.min(gEnemyType, goldDrops.length - 1);
  const goldAmount = goldDrops[enemyTypeIndex];
  gGold += goldAmount;
}

//敵出現処理
function AppearEnemy(t){
  gPhase = 1;           //敵出現フェーズ
  gEnemyHP = t * 3 + 5; //敵HP
  gEnemyType = t;
  SetMessage("敵が現れた！",null,null,null);
}

//戦闘コマンド
function CommandFight(){
  gPhase = 2; //戦闘コマンド選択フェーズ
  gCursor = 0;
  SetMessage("  戦う","  回復","  防御","  逃げる");
}

//戦闘画面描画
function DrawFight(g){
  g.fillStyle = "#000000";
  g.fillRect(0,0,WIDTH,HEIGHT); //画面全体を矩形描画
  //敵が生存している場合
  if(gPhase <= 5){
    if(IsBoss()){               //ラスボスの場合
      g.drawImage(gImgBoss,Math.floor(WIDTH / 2 - gImgBoss.width / 2),
                  Math.floor(HEIGHT / 2 - gImgBoss.height / 2));

    }else if(IsStageBoss1()){
      g.drawImage(gImgStageBoss1,Math.floor(WIDTH / 2 - gImgStageBoss1.width / 2),
      Math.floor(HEIGHT / 2 - gImgStageBoss1.height / 2));

    }else if(IsStageBoss2()){
      g.drawImage(gImgStageBoss2,Math.floor(WIDTH / 2 - gImgStageBoss2.width / 2),
      Math.floor(HEIGHT / 2 - gImgStageBoss2.height / 2));

    }else if(IsStageBoss3()){
      g.drawImage(gImgStageBoss3,Math.floor(WIDTH / 2 - gImgStageBoss3.width / 2),
      Math.floor(HEIGHT / 2 - gImgStageBoss3.height / 2));

    }else if(IsStageBoss4()){
      g.drawImage(gImgStageBoss4,Math.floor(WIDTH / 2 - gImgStageBoss4.width / 2),
      Math.floor(HEIGHT / 2 - gImgStageBoss4.height / 2));

    }else{
      let w = gImgMonster.width / 4;
      let h = gImgMonster.height;
      g.drawImage(gImgMonster,gEnemyType * w,0,w,h,
                  Math.floor(WIDTH / 2 - w / 2),Math.floor(HEIGHT / 2 - h / 2),w,h);
    }
  }
  DrawStatus(g);
  DrawEnemyStatus(g);
  DrawMessage(g);

  if(gPhase == 2){                       //戦闘フェーズがコマンド選択中の場合
    g.fillText("→",5 + 60 * gCursorX,96 + 14 * gCursorY); //カーソル描画
  }
}

//フィールド描画
function DrawField(g){
      let mx = Math.floor(gPlayerX / TILESIZE); //プレイヤーのタイル座標X
      let my = Math.floor(gPlayerY / TILESIZE); //プレイヤーのタイル座標Y

  for(let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++){
      let ty = my + dy;                         //タイル座標Y
      let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;  //ループ後タイル座標Y

  for(let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++){
      let tx = mx + dx;                         //タイル座標X
      let px = (tx + MAP_WIDTH) % MAP_WIDTH;    //ループ後タイル座標X

  DrawTile(g,
           tx * TILESIZE + WIDTH / 2 - gPlayerX,
           ty * TILESIZE + HEIGHT / 2 - gPlayerY,
           gCurrentMap[py * MAP_WIDTH + px]);
    }
  }
  //プレイヤーの描画
  g.drawImage(gImgPlayer,
             (gFrame >> 4 & 1) * CHRWIDTH,gAngle * CHRHEIGHT,CHRWIDTH,CHRHEIGHT,
              WIDTH / 2 - CHRWIDTH / 2,HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2,CHRWIDTH,CHRHEIGHT);
  //ステータスウィンドウ
  g.fillStyle = WNDSTYLE; //ウィンドウの色
  g.fillRect(2,3,44,49);
  DrawStatus(g);
  DrawMessage(g);
}

//ポーション購入画面描画
function DrawBuyPotion(g){
  g.fillStyle = "#000000";
  g.fillRect(0,0,WIDTH,HEIGHT); //画面全体を矩形描画
  g.drawImage(gImgPotion1,Math.floor(WIDTH / 4 - gImgPotion1.width / 2),
  Math.floor(HEIGHT / 2.4 - gImgPotion1.height / 2));
  g.drawImage(gImgPotion2,Math.floor(WIDTH / 1.4 - gImgPotion2.width / 2),
  Math.floor(HEIGHT / 2.4 - gImgPotion2.height / 2));
  g.font = FONT;
  g.fillStyle = FONTSTYLE;
  g.fillText("Gd",4,13);
  DrawTextR(g,gGold,43,13);
  g.font = "9px monospace";;
  g.fillStyle = FONTSTYLE;
  g.fillText("↓ﾐﾆ回復ポーション",27,30);
  g.fillText("ﾚｱ回復ポーション↑",15,77);
  DrawMessage(g);
}

//キャンバスの描画
function DrawMain(){
    const g = TUG.GR.mG; //仮想画面の2D描画コンテキストを取得
    if(gPhase <= 1 || gPhase == 10 || gPhase ==12 || gPhase == 14 || gPhase == 15 || gPhase == 17 || gPhase == 18 || gPhase == 20 || gPhase == 21 || gPhase == 23 || gPhase == 24 || gPhase == 40){
      DrawField(g);      //フィールド画面描画
    }else if(gPhase == 41 || gPhase == 43){
      DrawBuyPotion(g);
    }else{
      DrawFight(g);
    }
}

//敵のステータス描画
function DrawEnemyStatus(g){
  g.fillStyle = WNDSTYLE;
  g.fillRect(50,3,75,25);
  g.font = FONT;
  g.fillStyle = FONTSTYLE;
  g.fillText(gMonsterName[gEnemyType],64,15);
  g.fillText("HP:" + gEnemyHP,64,25);
}

//メッセージ描画
function DrawMessage(g){
  if(!gMessage1){              //メッセージ内容が存在しない場合
    return;
  }
  //メッセージウィンドウ
  g.fillStyle = WNDSTYLE;
  g.fillRect(4,84,120,30);
  g.font = FONT;               //文字フォント設定
  g.fillStyle = FONTSTYLE;     //文字の色
  g.fillText(gMessage1,5,96);  //メッセージ一行目描画
  if(gMessage2){
  g.fillText(gMessage2,5,110); //メッセージ二行目描画
  }
  if(gMessage3){
    g.fillText(gMessage3,66,96);
  }
  if(gMessage4){
    g.fillText(gMessage4,66,110);
  }
  if(gPhase == 10){                       //戦闘フェーズがコマンド選択中の場合
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 12){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 15){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 18){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 21){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 24){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 30){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 41){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
  if(gPhase == 43){
    g.fillText("→",5,96 + 14 * gCursor); //カーソル描画
  }
}

//ステータス描画
function DrawStatus(g){
  g.font = FONT;               //文字フォント設定
  g.fillStyle = FONTSTYLE;     //文字の色
  g.fillText("Lv",4,13);   DrawTextR(g,gLv,43,13); //レベル
  g.fillText("HP",4,25);   DrawTextR(g,gHP,43,25); //HP
  g.fillText("Ex",4,37);   DrawTextR(g,gEx,43,37); //経験値
  g.fillText("Gd",4,49);   DrawTextR(g,gGold,43,49);
}

//描画
function DrawTextR(g,str,x,y){
  g.textAlign = "right";
  g.fillText(str,x,y);
  g.textAlign = "left";
}

//タイルの描画
function DrawTile(g,x,y,idx){
  const ix = (idx % TILECOLUMN) * TILESIZE;
  const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
  g.drawImage(gImgMap,ix,iy,TILESIZE,TILESIZE,x,y,TILESIZE,TILESIZE);
}

//ポーション1購入
function BuyPotion1(){
  const potion1Cost = 10;
  if(gGold >= potion1Cost){
    gGold -= potion1Cost;
    gPotion1 ++;
    SetMessage("ﾐﾆ回復ポーション","を購入しました！",null,null);
  }else{
    SetMessage("お金が足りません。",null,null,null);
  }
  gPhase = 0;
}

//ポーション2購入
function BuyPotion2(){
  const potion2Cost = 100;
  if(gGold >= potion2Cost){
    gGold -= potion2Cost;
    gPotion2 ++;
    SetMessage("ﾚｱ回復ポーション","を購入しました！",null,null);
  }else{
    SetMessage("お金が足りません。",null,null,null);
  }
  gPhase = 0;
}

// 回復処理を追加
function UsePotion(potionType){
  if(potionType == 1 && gPotion1 > 0){
    gPotion1--;
    gHP = Math.min(gMHP, gHP + 10);  // ミニポーションは20回復
    g.fillText(" ",5,96 + 14 * gCursor); //カーソル描画
    gPhase = 2;
  }else if(potionType == 2 && gPotion2 > 0){
    gPotion2--;
    gHP = gMHP;  // レアポーションは全回復
    g.fillText(" ",5,96 + 14 * gCursor); //カーソル描画
    gPhase = 2;
  }else{
    SetMessage("ポーションが","ありません。",null,null);
  }
}

//ダメージ量算出
function GetDamage(a){
  return(Math.floor(a * (1 + Math.random()))); //攻撃力の1〜2倍
}

//ボス
function IsBoss(){
  return(gEnemyType == gMonsterName.length - 1);
}

//ステージボス1
function IsStageBoss1(){
  return(gEnemyType == gMonsterName.length - 5);
}

//ステージボス2
function IsStageBoss2(){
  return(gEnemyType == gMonsterName.length - 4);
}

//ステージボス3
function IsStageBoss3(){
  return(gEnemyType == gMonsterName.length - 3);
}

//ステージボス4
function IsStageBoss4(){
  return(gEnemyType == gMonsterName.length - 2);
}

//画像の読み込み
function LoadImage(){
  gImgBoss       = new Image(); gImgBoss.src        = gFileBoss;    //ボス画像の読み込み
  gImgMap        = new Image(); gImgMap.src         = gFileMap;     //マップ画像の読み込み
  gImgMonster    = new Image(); gImgMonster.src     = gFileMonster; //モンスター画像の読み込み
  gImgPlayer     = new Image(); gImgPlayer.src      = gFilePlayer;  //プレイヤー画像の読み込み
  gImgStageBoss1 = new Image(); gImgStageBoss1.src  = gFileStageboss1;
  gImgStageBoss2 = new Image(); gImgStageBoss2.src  = gFileStageboss2;
  gImgStageBoss3 = new Image(); gImgStageBoss3.src  = gFileStageboss3;
  gImgStageBoss4 = new Image(); gImgStageBoss4.src  = gFileStageboss4;
  gImgPotion1    = new Image(); gImgPotion1.src     = gFilePotion1;
  gImgPotion2    = new Image(); gImgPotion2.src     = gFilePotion2;
}

//IE対応
function SetMessage(v1,v2,v3,v4){
  gMessage1 = v1;
  gMessage2 = v2;
  gMessage3 = v3;
  gMessage4 = v4;
}

//フィールド進行処理
function TickField(){
  if(gPhase != 0){
    return;
  }
  if(gMoveX != 0 || gMoveY != 0 || gMessage1){}        //移動中orメッセージ表示中の場合
  else if(gKey[87]){gAngle = 3; gMoveY =- TILESIZE;}   //上
  else if(gKey[83]){gAngle = 0; gMoveY = TILESIZE;}    //下
  else if(gKey[65]){gAngle = 1; gMoveX =- TILESIZE;}   //左
  else if(gKey[68]){gAngle = 2; gMoveX = TILESIZE;}    //右

  //移動後のタイル座標判定
  let mx = Math.floor((gPlayerX + gMoveX) / TILESIZE); //移動後のタイル座標X
  let my = Math.floor((gPlayerY + gMoveY) / TILESIZE); //移動後のタイル座標Y

  //マップループ処理
  mx += MAP_WIDTH;
  mx %= MAP_WIDTH;
  my += MAP_HEIGHT;
  my %= MAP_HEIGHT;

  let m = gCurrentMap[my * MAP_WIDTH + mx];

  //移動不可の地形の場合移動禁止にする
  if(m < 13){
    gMoveX = 0;
    gMoveY = 0;
  }

  if(Math.abs(gMoveX) + Math.abs(gMoveY) == SCROLL){ //マス目移動が終わる直前
    if(m == 28 || m == 29){                            //お城
      gPhase = 10;
      gHP = gMHP;                                    //HP全回復
      SetMessage("  お城に入る","  お城に入らない",null,null);
    }
    if(m == 44){
      SetMessage("魔王を倒して","世界を救ってくれ！",null,null)
    }
    if(m == 61 || m == 62){
      gPhase = 40;
      SetMessage("回復ポーションを","購入しますか？",null,null)
    }
    if(m == 48 || m == 49 || m == 50 || m == 51){
      gPhase = 12;
      SetMessage("  お城から出る","  お城から出ない",null,null);
    }
    if(m == 46 || m == 47){                          //ステージ1
      gHP = gMHP;
      gPhase = 17;
      SetMessage("ステージボスとの","戦闘を開始しますか？",null,null);
    }
    if(m == 56 || m == 57){                          //ステージ2
      gHP = gMHP;
      gPhase = 20;
      SetMessage("ステージボスとの","戦闘を開始しますか？",null,null);
    }
    if(m == 18 || m == 19){                          //ステージ3
      gHP = gMHP;
      gPhase = 23;
      SetMessage("ステージボスとの","戦闘を開始しますか？",null,null);
    }
    if(m == 17){                                     //洞窟（ステージ4）
      gPhase = 14;
      SetMessage("ステージボスとの","戦闘を開始しますか？",null,null);
    }
    if(m == 16){                                     //扉
      if(gItem == 0){
        gPlayerX -= TILESIZE;                        //１マス上へ移動
        SetMessage("鍵があと4つ必要です。",null,null,null);

      }else if(gItem == 1){
        gPlayerX -= TILESIZE;                        //１マス上へ移動
        SetMessage("鍵があと3つ必要です。",null,null,null);

      }else if(gItem == 2){
        gPlayerX -= TILESIZE;                        //１マス上へ移動
        SetMessage("鍵があと2つ必要です。","ガンバレ！",null,null);

      }else if(gItem == 3){
        gPlayerX -= TILESIZE;                        //１マス上へ移動
        SetMessage("鍵があと1つ必要です。","もう少し！",null,null);

      }else if(gItem == 4){
        SetMessage("扉が開いた！",null,null,null);
      }
    }
    if(m == 22 || m == 23){                                     //ボス
      AppearEnemy(gMonsterName.length - 1);
    }
    if(Math.random() * 8 < gEncounter[m]){           //ランダムエンカウント
      let t = Math.abs(gPlayerX / TILESIZE - START_X) +
              Math.abs(gPlayerY / TILESIZE - START_Y);
      if(m == 13){ //マップタイルが林だった場合
        t += 16;
      }
      t += Math.random() * 8;                  //敵レベルを0〜0.5上昇
      let levelBonus = Math.floor(gLv / 3);
      t = Math.floor(t / 16) + levelBonus;
      t = Math.min(t,gMonsterName.length - 6); //上限処理
      if(t < 3 && Math.random() < 0.1){
        t = 3;
      }
      AppearEnemy(t);
    }
  }
  gPlayerX += TUG.Sign(gMoveX) * SCROLL; //プレイヤー座標移動X
  gPlayerY += TUG.Sign(gMoveY) * SCROLL; //プレイヤー座標移動Y
  gMoveX   -= TUG.Sign(gMoveX) * SCROLL; //移動量消費X
  gMoveY   -= TUG.Sign(gMoveY) * SCROLL; //移動量消費Y

  //マップループ処理
  gPlayerX += (MAP_WIDTH  * TILESIZE);
  gPlayerX %= (MAP_WIDTH  * TILESIZE);
  gPlayerY += (MAP_HEIGHT * TILESIZE);
  gPlayerY %= (MAP_HEIGHT * TILESIZE);
}

//ゲーム画面の描画更新処理
function WmPaint(){
  DrawMain();
  const ca = document.getElementById("main"); //キャンバスの要素を取得
  const g = ca.getContext("2d");              //2D描画コンテキストを取得
  //仮想画面のイメージを実画面へ転送
  g.drawImage(TUG.GR.mCanvas,0,0,TUG.GR.mCanvas.width,TUG.GR.mCanvas.height,0,0,gWidth,gHeight);
}

//ブラウザサイズ変更イベント処理
function WmSize(){
  const ca = document.getElementById("main");                   //キャンバスの要素を取得
  ca.width = window.innerWidth;                                 //キャンバスの幅をブラウザの幅へ変更
  ca.height = window.innerHeight;                               //キャンバスの高さをブラウザの高さへ変更
  const g = ca.getContext("2d");                                //2D描画コンテキストを取得
  g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH; //補間処理

  //実画面サイズを計測しドットのアスペクト比を維持したままでの最大サイズを計測
  gWidth = ca.width;
  gHeight = ca.height;
  if(gWidth / WIDTH < gHeight / HEIGHT){
     gHeight = gWidth * HEIGHT / WIDTH;
  }else{
     gWidth = gHeight * WIDTH / HEIGHT;
  }
}

//タイマーイベント発生時の処理
TUG.onTimer = function(d){
  if(!gMessage1){
    while(d--){
      gFrame++; //内部カウンタを加算
      TickField();
    }
  }
  WmPaint();
}

//キー入力イベント（DOWN）
window.onkeydown = function(ev){
  let c = ev.keyCode;        //キーコード取得
  if(gKey[c] != 0){          //キーリピート
    return;
  }
  gKey[c] = 1;

  if(gPhase == 1){           //敵が現れた場合
    CommandFight();          //戦闘コマンド
    return;
  }

  if(gPhase == 2){                            //戦闘コマンド選択フェーズ
    if(c == 13 || c == 90){                   //EnterキーorZキー
      gOrder = Math.floor(Math.random() * 2); //戦闘行動順
      Action();                               //戦闘行動処理
    }else if(c == 38 || c == 40){                        // 上矢印
      gCursorY = 1 - gCursorY;        // カーソルを上に移動
    }else if(c == 37 || c == 39){                        // 左矢印
      gCursorX = 1 - gCursorX;
    }
    return;
  }

  if(gPhase == 3){           //戦闘行動処理
    Action();
    return;
  }

  if(gPhase == 4){
    CommandFight();          //戦闘コマンド
    return;
  }

  if(gPhase == 5){
    gPhase = 6;
    AddExp(gEnemyType + 1);  //経験値加算
    SetMessage("敵を倒した！",null,null,null);
    return;
  }

  if(gPhase ==6){
    if(IsBoss() && gCursor == 0){ //敵がボスかつ「戦う」選択時
      SetMessage("魔王を倒し","世界に平和が訪れた。",null,null);
      return;
    }else if(IsStageBoss1() && gCursor == 0){
      SetMessage("ステージクリア！","鍵を手に入れたよ！",null,null);
      gItem = 1;
      gPhase = 0;
    }else if(IsStageBoss2() && gCursor == 0){
      SetMessage("ステージクリア！","鍵を手に入れたよ！",null,null);
      gItem = 2;
      gPhase = 0;
    }else if(IsStageBoss3() && gCursor == 0){
      SetMessage("ステージクリア！","鍵を手に入れたよ！",null,null);
      gItem = 3;
      gPhase = 0;
    }else if(IsStageBoss4() && gCursor == 0){
      SetMessage("ステージクリア！","鍵を手に入れたよ！",null,null);
      gItem = 4;
      gPhase = 0;
    }else{
      SetMessage(null,null,null,null);
      gPhase = 0;
    }
    gPhase = 0;
    return;
  }

  if(gPhase == 7){
    gPhase = 8;
    SetMessage("あなたは死亡した。",null,null,null);
    return;
  }

  if(gPhase == 8){
    SetMessage("ゲームオーバー。","…そんな日もあるよ。",null,null)
    return;
  }

  if(gPhase == 10){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        gCurrentMap = gMapCastle;
        gPlayerX = 16 * TILESIZE + TILESIZE / 2;
        gPlayerY = 27 * TILESIZE + TILESIZE / 2;
      }
      gPhase = 0;
      WmPaint();
      SetMessage(null,null,null,null);
    }
    return;
  }

  if(gPhase == 12){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        gCurrentMap = gMapOverworld;
        gPlayerX = 15 * TILESIZE + TILESIZE / 2;
        gPlayerY = 18 * TILESIZE + TILESIZE / 2;
      }
      gPhase = 0;
      WmPaint();
      SetMessage(null,null,null,null);
    }
    return;
  }

  if(gPhase == 14){
    gPhase = 15;
    gCursor = 0;
    SetMessage("  はい","  いいえ",null,null);
    return;
  }

  if(gPhase == 15){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        AppearEnemy(7);
        gPhase = 1;
      }else{
        gPhase = 0;
        SetMessage(null,null,null,null);
      }
      return;
    }
  }

  if(gPhase == 17){
    gPhase = 18;
    gCursor = 0;
    SetMessage("  はい","  いいえ",null,null);
    return;
  }

  if(gPhase == 18){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        AppearEnemy(4);
        gPhase = 1;
      }else{
        gPhase = 0;
        SetMessage(null,null,null,null);
      }
      return;
    }
  }

  if(gPhase == 20){
    gPhase = 21;
    gCursor = 0;
    SetMessage("  はい","  いいえ",null,null);
    return;
  }

  if(gPhase == 21){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        AppearEnemy(5);
        gPhase = 1;
      }else{
        gPhase = 0;
        SetMessage(null,null,null,null);
      }
      return;
    }
  }

  if(gPhase == 23){
    gPhase = 24;
    gCursor = 0;
    SetMessage("  はい","  いいえ",null,null);
    return;
  }

  if(gPhase == 24){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        AppearEnemy(6);
        gPhase = 1;
      }else{
        gPhase = 0;
        SetMessage(null,null,null,null);
      }
      return;
    }
  }

  // 回復フェーズの処理を追加
  if(gPhase == 30){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        UsePotion(1);  // ミニポーション
        gPhase = 1;
        return;
      }else{
        UsePotion(2);  // レアポーション
        gPhase = 1;
        return;
      }
    }
  }

  if(gPhase == 40){
    gPhase = 41;
    gCursor = 0;
    SetMessage("  はい","  いいえ",null,null);
    return;
  }

  if(gPhase == 41){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        gPhase = 42;
        SetMessage(null,null,null,null);
      }else{
        gPhase = 0;
        SetMessage(null,null,null,null);
        return;
      }
    }
  }

  if(gPhase == 42){
    gPhase = 43;
    gCursor = 0;
    SetMessage("  ミニ 10ゴールド","  レア 100ゴールド",null,null);
    return;
  }

  if(gPhase == 43){
    if(c == 38 || c == 40){
      gCursor = 1 - gCursor;
      return;
    }
    if(c == 13 || c == 90){
      if(gCursor == 0){
        BuyPotion1();
      }else{
        BuyPotion2();
      }
      return;
    }
  }
  if(gPhase == 0 || gPhase == 5 || gPhase == 6 || gPhase == 7 || gPhase == 8){
    gMessage1 = null;
  }
}

//キー入力イベント（UP）
window.onkeyup = function(ev){
  gKey[ev.keyCode] = 0;
}

//ブラウザ起動イベント
window.onload=function(){
  LoadImage();
  WmSize();                                               //画面サイズ初期化
  window.addEventListener("resize",function(){WmSize()}); //ブラウザサイズ変更時WmSize()が呼ばれる
  TUG.init();
}