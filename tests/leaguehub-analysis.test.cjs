const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const A = require('../DH_P2.53/scripts/leaguehub-analysis.js');
// Exercise the production lineup builder with reordered league slots, without
// fetching data or adding a test-only browser API to the deployed page.
const source = fs.readFileSync(require.resolve('../DH_P2.53/scripts/leaguehub.js'), 'utf8');
const start = source.indexOf('    function createDerivedSlotTotals(');
const end = source.indexOf('    function formatPlayerName(', start);
const context = { SLOT_ORDER: ['QB','RB','WR','TE','FLEX','SUPER_FLEX'], POSITION_ORDER: ['QB','RB','WR','TE'], RADAR_FLEX_ELIGIBLE: ['RB','WR','TE'] };
vm.createContext(context);
vm.runInContext(source.slice(start, end), context);
const players = [
 ['q1','QB',900,300], ['q2','QB',800,250], ['q3','QB',700,210],
 ['r1','RB',600,180], ['r2','RB',500,200], ['r3','RB',400,140], ['r4','RB',300,130],
 ['w1','WR',950,220], ['w2','WR',750,190], ['w3','WR',550,170], ['w4','WR',450,160],
 ['t1','TE',650,120], ['t2','TE',350,110], ['t3','TE',250,90],
].map(([id,pos,ktc,proj])=>({id,pos,ktc,proj,name:id}));
const slots = ['FLEX','QB','RB','WR','TE','SUPER_FLEX'].map(type=>({type,label:type}));
const build = metric => context.buildDerivedLineup(players, [], slots, metric);
function team() { return { allPlayers: players, derivedLineups: { value:build('value'),proj:build('proj') }, totalValue: 10000, overallPositional: {Picks:1000} }; }
test('ROS starts at current week, future seasons at one, completed seasons have none',()=>{
 assert.deepEqual(A.projectionWeeks(2026,{season:'2026',week:7,season_type:'regular'}),[7,8,9,10,11,12,13,14,15,16,17,18]);
 assert.equal(A.projectionWeeks(2027,{season:'2026',week:7,season_type:'regular'}).length,18);
 assert.equal(A.projectionWeeks(2026,{season:'2026',week:0,season_type:'pre'}).length,18);
 assert.deepEqual(A.projectionWeeks(2025,{season:'2026',week:1,season_type:'regular'}),[]);
 assert.deepEqual(A.projectionWeeks(2026,{season:'2026',week:1,season_type:'post'}),[]);
});
test('league scoring includes custom passing TDs, turnovers and TE premium exactly once',()=>{
 assert.equal(A.scoreProjection({pass_yd:250,pass_td:2,pass_int:1,pts_ppr:16},{pass_yd:.04,pass_td:6,pass_int:-2},'QB'),20);
 assert.equal(A.scoreProjection({rec:5,rec_yd:50,bonus_rec_te:5,pts_ppr:10},{rec:1,rec_yd:.1,bonus_rec_te:.5},'TE'),12.5);
 assert.equal(A.scoreProjection({rec:5,rec_yd:50,pts_ppr:10},{rec:1,rec_yd:.1,bonus_rec_te:.5},'TE'),12.5);
});
test('missing data stays null while an explicitly projected zero is valid',()=>{
 assert.equal(A.scoreProjection({gp:1,adp_ppr:99},{rec:1},'WR'),null);
 assert.equal(A.scoreProjection({pts_ppr:0},{rec:1},'WR'),0);
 assert.equal(A.scoreProjection(null,{rec:1},'WR'),null);
 assert.equal(A.sumProjections([{proj:null},{proj:20}]),null);
});
test('position slots fill before FLEX even when FLEX is first; no player is reused',()=>{
 const lineup = build('proj');
 assert.deepEqual(Array.from(lineup.assignments,slot=>slot.player.id),['w2','q1','r2','w1','t1','q2']);
 assert.equal(new Set(lineup.assignments.map(slot=>slot.player.id)).size,6);
 assert.equal(lineup.totals.proj,1280);
});
test('Dynasty and Contender choose different starters with the same existing slot rules',()=>{
 assert.equal(build('value').assignments[2].player.id,'r1');
 assert.equal(build('proj').assignments[2].player.id,'r2');
 assert.equal(build('proj').assignments[5].player.id,'q2');
});
test('Contender depth uses only 1 QB + 3 combined RB/WR + 1 TE from nonstarters',()=>{
 const q=A.quality(team(),'proj');
 assert.deepEqual(q.depthPlayers.map(p=>p.id),['q3','r1','w3','w4','t2']);
 assert.equal(q.depth,830);
 assert.equal(q.overall,1280);
 assert.equal(q.overall,q.starters);
});
test('Dynasty depth counts every nonstarter, while overall includes full roster and picks',()=>{
 const t=team();const q=A.quality(t,'value');
 const ids=new Set(t.derivedLineups.value.assignments.map(a=>a.player.id));
 assert.equal(q.depth,players.filter(p=>!ids.has(p.id)).reduce((sum,p)=>sum+p.ktc,0));
 assert.equal(q.overall,10000);assert.equal(q.picks,1000);
});
test('ties share ranks and ring fill; absent projections do not receive rank one',()=>{
 assert.equal(A.rank(100,[100,100,80]),1);assert.equal(A.rank(80,[100,100,80]),3);
 assert.equal(A.rank(null,[null,null]),null);assert.equal(A.rankFill(1,12),1);
 assert.equal(A.rankFill(12,12),1/12);assert.equal(A.rankFill(null,12),0);
});
