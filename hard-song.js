
// 110 BPM 6/8 → BRIDGE 70 BPM → ФІНАЛ 140 BPM
// Прив'язка: перший звук WAV = 3.285 сек (такт 2, beat 0)

const OFFSET = 0;
function o(ms) { return ms + OFFSET; }

export const HARD_PATTERN = [

  
  // ВСТУП (т.2) — Hi-Hat + томи розгін

  { string: 2, time: o(3285) },  // hihat42
  { string: 2, time: o(3558) },  // hihat42
  { string: 2, time: o(3830) },  // hihat42
  { string: 4, time: o(4103) },  // tom50
  { string: 3, time: o(4376) },  // tom47
  { string: 4, time: o(4649) },  // tom50
  { string: 2, time: o(4921) },  // kick36

    
  // ВСТУПНА ТЕМА (т.3-5) 

  { string: 1, time: o(5740) },  
  { string: 2, time: o(6558) },  
  { string: 1, time: o(7376) },  
  { string: 2, time: o(8194) },  
  { string: 1, time: o(8467) },  
  { string: 1, time: o(9012) },  
  { string: 1, time: o(9558) },  
  { string: 2, time: o(9830) },  
  // 1 (т.6-13) 

  { string: 1, time: o(10649) },  
  { string: 2, time: o(11467) },  
  { string: 2, time: o(12012) },  
  { string: 1, time: o(12285) },  
  { string: 2, time: o(12830) },  
  { string: 2, time: o(13103) },  
  { string: 2, time: o(13649) },  
  { string: 1, time: o(13921) },  
  { string: 2, time: o(14467) },  
  { string: 2, time: o(14740) },  
  { string: 2, time: o(15285) },  
  { string: 1, time: o(15558) },  
  { string: 2, time: o(16103) },  
  { string: 2, time: o(16376) },  
  { string: 2, time: o(16921) },  
  { string: 1, time: o(17194) },  
  { string: 2, time: o(17740) },  
  { string: 2, time: o(18012) }, 
  { string: 2, time: o(18558) },  
  { string: 1, time: o(18830) },  
  { string: 2, time: o(19376) },  
  { string: 2, time: o(19649) },  
  { string: 2, time: o(20194) },  
  { string: 1, time: o(20467) },  
  { string: 2, time: o(21012) },  
  { string: 2, time: o(21285) },  
  { string: 2, time: o(21830) },  
  { string: 1, time: o(22103) },  
  { string: 2, time: o(22649) },  
  { string: 0, time: o(22921) },  

  
  // Crash + томи вниз
 
  { string: 1, time: o(23740) },  
  { string: 4, time: o(24012) },  
  { string: 3, time: o(24285) },  

  
  // (т.15-21)
  
  { string: 2, time: o(24558) },  // kick36
  { string: 3, time: o(24830) },  // ride53
  { string: 2, time: o(25103) },  // kick36
  { string: 3, time: o(25376) },  // ride53
  { string: 2, time: o(25649) },  // kick36
  { string: 1, time: o(25921) },  // snare38
  { string: 2, time: o(26194) },  // kick36
  { string: 3, time: o(26467) },  // ride53
  { string: 2, time: o(26740) },  // kick36
  { string: 3, time: o(27012) },  // ride53
  { string: 2, time: o(27285) },  // kick36
  { string: 1, time: o(27558) },  // snare38
  { string: 2, time: o(27830) },  // kick36
  { string: 3, time: o(28103) },  // ride53
  { string: 2, time: o(28376) },  // kick36
  { string: 3, time: o(28649) },  // ride53
  { string: 2, time: o(28921) },  // kick36
  { string: 1, time: o(29194) },  // snare38
  { string: 2, time: o(29467) },  // kick36
  { string: 3, time: o(29740) },  // ride53
  { string: 2, time: o(30012) },  // kick36
  { string: 3, time: o(30285) },  // ride53
  { string: 2, time: o(30558) },  // kick36
  { string: 1, time: o(30830) },  // snare38
  { string: 2, time: o(31103) },  // kick36
  { string: 3, time: o(31376) },  // ride53
  { string: 2, time: o(31649) },  // kick36
  { string: 3, time: o(31921) },  // ride53
  { string: 2, time: o(32194) },  // kick36
  { string: 1, time: o(32467) },  // snare38
  { string: 2, time: o(32740) },  // kick36
  { string: 3, time: o(33012) },  // ride53
  { string: 2, time: o(33285) },  // kick36
  { string: 3, time: o(33558) },  // ride53
  { string: 2, time: o(33830) },  // kick36
  { string: 1, time: o(34103) },  // snare38
  { string: 2, time: o(34376) },  // kick36
  { string: 3, time: o(34649) },  // ride53
  { string: 2, time: o(34921) },  // kick36
  { string: 3, time: o(35194) },  // ride53
  { string: 2, time: o(35467) },  // kick36
  { string: 1, time: o(35740) },  // snare38
  { string: 1, time: o(36012) },  // snare38

  
  // FILL (т.22-23) — 3/8 + томи спуск
  
  { string: 1, time: o(36285) },  // snare38
  { string: 1, time: o(36558) },  // snare38
  { string: 4, time: o(36830) },  // tom50
  { string: 3, time: o(37103) },  // tom47
  { string: 2, time: o(37376) },  // tom45
  { string: 1, time: o(37649) },  // tom41
  { string: 2, time: o(37921) },  // kick36
  { string: 4, time: o(38194) },  // tom50

  
  // CRASH секція (т.24-25)
 
  { string: 4, time: o(38467) },  // crash49
  { string: 1, time: o(39285) },  // snare38
  { string: 0, time: o(40103) },  // crash49
  { string: 1, time: o(40921) },  // snare38

  
  // FILL (т.26) — Tom cascade
  
  { string: 4, time: o(41740) },  // tom50
  { string: 3, time: o(42012) },  // tom47
  { string: 1, time: o(42285) },  // snare38
  { string: 4, time: o(42558) },  // crash49
  { string: 2, time: o(42830) },  // tom45
  { string: 0, time: o(43103) },  // crash57

 
  // THEME 2 (т.27-29) — Open Hi-Hat + Ride Bell
  
  { string: 2, time: o(43376) },  // kick36
  { string: 3, time: o(43649) },  // ride53
  { string: 3, time: o(43921) },  // ride53
  { string: 1, time: o(44194) },  // snare38
  { string: 3, time: o(44740) },  // ride53
  { string: 2, time: o(45012) },  // kick36
  { string: 3, time: o(45285) },  // ride53
  { string: 3, time: o(45558) },  // ride53
  { string: 1, time: o(45830) },  // snare38
  { string: 3, time: o(46376) },  // ride53
  { string: 2, time: o(46649) },  // kick36
  { string: 3, time: o(46921) },  // ride53
  { string: 3, time: o(47194) },  // ride53
  { string: 1, time: o(47467) },  // snare38
  { string: 3, time: o(48012) },  // ride53

  
  // THEME 3 Jack Sparrow (т.30-33) — Crash57 кожен такт
  
  { string: 4, time: o(48285) },  // crash57
  { string: 1, time: o(49103) },  // snare38
  { string: 3, time: o(49376) },  // ride53
  { string: 3, time: o(49649) },  // ride53
  { string: 0, time: o(49921) },  // crash57
  { string: 1, time: o(50740) },  // snare38
  { string: 3, time: o(51012) },  // ride53
  { string: 3, time: o(51285) },  // ride53
  { string: 4, time: o(51558) },  // crash57
  { string: 1, time: o(52376) },  // snare38
  { string: 3, time: o(52649) },  // ride53
  { string: 3, time: o(52921) },  // ride53
  { string: 0, time: o(53194) },  // crash57
  { string: 1, time: o(54012) },  // snare38
  { string: 3, time: o(54285) },  // ride53
  { string: 3, time: o(54558) },  // ride53
  { string: 4, time: o(54830) },  // crash57

  
  // FILL (т.34)
 
  { string: 0, time: o(55103) },  // crash49
  { string: 4, time: o(55649) },  // tom50
  { string: 3, time: o(55921) },  // tom47
  { string: 1, time: o(56194) },  // tom43

  
  // CRASH секція (т.35-37)
 
  { string: 4, time: o(56467) },  // crash49
  { string: 1, time: o(57285) },  // snare38
  { string: 0, time: o(58103) },  // crash49
  { string: 1, time: o(58921) },  // snare38
  { string: 4, time: o(59740) },  // crash49
  { string: 1, time: o(60558) },  // snare38

  
  // РОЗШИРЕНА СЕКЦІЯ (т.38-46)
 
  { string: 2, time: o(61376) },  // kick36
  { string: 0, time: o(61921) },  // crash49
  { string: 1, time: o(62194) },  // snare38
  { string: 4, time: o(62467) },  // tom50
  { string: 2, time: o(63012) },  // kick36
  { string: 4, time: o(63558) },  // crash49
  { string: 1, time: o(63830) },  // snare38
  { string: 4, time: o(64103) },  // tom50
  { string: 2, time: o(64649) },  // kick36
  { string: 0, time: o(65194) },  // crash49
  { string: 1, time: o(65467) },  // snare38
  { string: 4, time: o(65740) },  // tom50
  { string: 2, time: o(66285) },  // kick36
  { string: 4, time: o(66830) },  // crash49
  { string: 1, time: o(67103) },  // snare38
  { string: 4, time: o(67376) },  // tom50
  { string: 2, time: o(67921) },  // kick36
  { string: 0, time: o(68467) },  // crash49
  { string: 1, time: o(68740) },  // snare38
  { string: 4, time: o(69012) },  // tom50
  { string: 2, time: o(69558) },  // kick36
  { string: 4, time: o(70103) },  // crash49
  { string: 1, time: o(70376) },  // snare38
  { string: 4, time: o(70649) },  // tom50
  { string: 2, time: o(71194) },  // kick36
  { string: 0, time: o(71740) },  // crash49
  { string: 1, time: o(72012) },  // snare38
  { string: 4, time: o(72285) },  // tom50
  { string: 2, time: o(72830) },  // kick36
  { string: 4, time: o(73376) },  // crash49
  { string: 1, time: o(73649) },  // snare38
  { string: 4, time: o(73921) },  // tom50
  { string: 0, time: o(74467) },  // crash49
  { string: 1, time: o(75285) },  // snare38
  { string: 2, time: o(76103) },  // kick36

 
  // GUITAR SOLO 1 (т.47-53) — Hi-Hat
  
  { string: 2, time: o(76649) },  // kick36
  { string: 1, time: o(76921) },  // snare38
  { string: 2, time: o(77740) },  // kick36
  { string: 2, time: o(78285) },  // kick36
  { string: 1, time: o(78558) },  // snare38
  { string: 2, time: o(79376) },  // kick36
  { string: 2, time: o(79921) },  // kick36
  { string: 1, time: o(80194) },  // snare38
  { string: 2, time: o(81012) },  // kick36
  { string: 2, time: o(81558) },  // kick36
  { string: 1, time: o(81830) },  // snare38
  { string: 2, time: o(82649) },  // kick36
  { string: 2, time: o(83194) },  // kick36
  { string: 1, time: o(83467) },  // snare38
  { string: 2, time: o(84285) },  // kick36
  { string: 2, time: o(84830) },  // kick36
  { string: 1, time: o(85103) },  // snare38
  { string: 2, time: o(85921) },  // kick36
  { string: 2, time: o(86467) },  // kick36
  { string: 1, time: o(86740) },  // snare38

  
  // FILL (т.54)
 
  { string: 4, time: o(87558) },  // crash49
  { string: 1, time: o(88376) },  // snare38
  { string: 4, time: o(88649) },  // tom50
  { string: 3, time: o(88921) },  // tom47
  { string: 2, time: o(89194) },  // kick36

 
  // He's A PIRATE (т.55-61) — Ride Bell
 
  { string: 3, time: o(89467) },  // ride53
  { string: 2, time: o(89740) },  // kick36
  { string: 3, time: o(90012) },  // ride53
  { string: 2, time: o(90285) },  // kick36
  { string: 1, time: o(90558) },  // snare38
  { string: 2, time: o(90830) },  // kick36
  { string: 3, time: o(91103) },  // ride53
  { string: 2, time: o(91376) },  // kick36
  { string: 3, time: o(91649) },  // ride53
  { string: 2, time: o(91921) },  // kick36
  { string: 1, time: o(92194) },  // snare38
  { string: 2, time: o(92467) },  // kick36
  { string: 3, time: o(92740) },  // ride53
  { string: 2, time: o(93012) },  // kick36
  { string: 3, time: o(93285) },  // ride53
  { string: 2, time: o(93558) },  // kick36
  { string: 1, time: o(93830) },  // snare38
  { string: 2, time: o(94103) },  // kick36
  { string: 3, time: o(94376) },  // ride53
  { string: 2, time: o(94649) },  // kick36
  { string: 3, time: o(94921) },  // ride53
  { string: 2, time: o(95194) },  // kick36
  { string: 1, time: o(95467) },  // snare38
  { string: 2, time: o(95740) },  // kick36
  { string: 3, time: o(96012) },  // ride53
  { string: 2, time: o(96285) },  // kick36
  { string: 3, time: o(96558) },  // ride53
  { string: 2, time: o(96830) },  // kick36
  { string: 1, time: o(97103) },  // snare38
  { string: 2, time: o(97376) },  // kick36
  { string: 3, time: o(97649) },  // ride53
  { string: 2, time: o(97921) },  // kick36
  { string: 3, time: o(98194) },  // ride53
  { string: 2, time: o(98467) },  // kick36
  { string: 1, time: o(98740) },  // snare38
  { string: 2, time: o(99012) },  // kick36
  { string: 3, time: o(99285) },  // ride53
  { string: 2, time: o(99558) },  // kick36
  { string: 3, time: o(99830) },  // ride53
  { string: 2, time: o(100103) },  // kick36
  { string: 1, time: o(100376) },  // snare38

  // ══════════════════════════════════════════════════════════
  // FILL (т.62-63) — 3/8 + томи
  // ══════════════════════════════════════════════════════════
  { string: 1, time: o(100649) },  // snare38
  { string: 1, time: o(100921) },  // snare38
  { string: 1, time: o(101194) },  // snare38
  { string: 4, time: o(101467) },  // tom50
  { string: 3, time: o(101740) },  // tom47
  { string: 2, time: o(102012) },  // tom45
  { string: 1, time: o(102285) },  // tom41
  { string: 4, time: o(102830) },  // tom50
  { string: 0, time: o(103103) },  // crash49

  // ══════════════════════════════════════════════════════════
  // CRASH секція (т.64-65)
  // ══════════════════════════════════════════════════════════
  { string: 1, time: o(103921) },  // snare38
  { string: 4, time: o(104740) },  // crash49
  { string: 1, time: o(105558) },  // snare38

  // ══════════════════════════════════════════════════════════
  // FILL (т.66) — Tom cascade
  // ══════════════════════════════════════════════════════════
  { string: 4, time: o(106376) },  // tom50
  { string: 3, time: o(106649) },  // tom47
  { string: 1, time: o(106921) },  // snare38
  { string: 0, time: o(107194) },  // crash49
  { string: 2, time: o(107467) },  // tom45
  { string: 4, time: o(107740) },  // crash57
  { string: 1, time: o(108012) },  // snare38

  // ══════════════════════════════════════════════════════════
  // RIDE CYMBAL секція (т.67-69) — Crash57 кінець
  // ══════════════════════════════════════════════════════════
  { string: 3, time: o(108285) },  // ride51
  { string: 3, time: o(108830) },  // ride51
  { string: 0, time: o(109376) },  // crash57
  { string: 1, time: o(109649) },  // snare38
  { string: 3, time: o(109921) },  // ride51
  { string: 3, time: o(110467) },  // ride51
  { string: 4, time: o(111012) },  // crash57
  { string: 1, time: o(111285) },  // snare38
  { string: 3, time: o(111558) },  // ride51
  { string: 3, time: o(112103) },  // ride51
  { string: 0, time: o(112649) },  // crash57
  { string: 1, time: o(112921) },  // snare38
  { string: 3, time: o(113467) },  // ride51
  { string: 4, time: o(114012) },  // crash57

  // ══════════════════════════════════════════════════════════
  // SOLO 2 (т.71-77) — Splash cymbal
  // ══════════════════════════════════════════════════════════
  { string: 2, time: o(114558) },  // kick36
  { string: 1, time: o(115376) },  // snare38
  { string: 0, time: o(115649) },  // splash55
  { string: 2, time: o(116194) },  // kick36
  { string: 1, time: o(117012) },  // snare38
  { string: 4, time: o(117285) },  // splash55
  { string: 2, time: o(117830) },  // kick36
  { string: 1, time: o(118649) },  // snare38
  { string: 0, time: o(118921) },  // splash55
  { string: 2, time: o(119467) },  // kick36
  { string: 1, time: o(120285) },  // snare38
  { string: 4, time: o(120558) },  // splash55
  { string: 2, time: o(121103) },  // kick36
  { string: 1, time: o(121921) },  // snare38
  { string: 0, time: o(122194) },  // splash55
  { string: 2, time: o(122740) },  // kick36
  { string: 1, time: o(123558) },  // snare38
  { string: 4, time: o(123830) },  // splash55
  { string: 2, time: o(124376) },  // kick36
  { string: 1, time: o(125194) },  // snare38
  { string: 0, time: o(125467) },  // splash55
  { string: 2, time: o(126012) },  // kick36

  // ══════════════════════════════════════════════════════════
  // ПЕРЕХІД до Bridge (т.78)
  // ══════════════════════════════════════════════════════════
  { string: 4, time: o(126558) },  // crash49
  { string: 1, time: o(126830) },  // snare38
  { string: 0, time: o(127376) },  // crash49

  // ══════════════════════════════════════════════════════════
  // BRIDGE 70 BPM (т.79-86) — Crash кожен такт
  // ══════════════════════════════════════════════════════════
  { string: 4, time: o(127649) },  // crash49_bridge
  { string: 1, time: o(130220) },  // snare38_pre
  { string: 1, time: o(130766) },  // snare38_pre
  { string: 1, time: o(131311) },  // snare38_pre
  { string: 0, time: o(132791) },  // crash49
  { string: 3, time: o(133220) },  // ride53
  { string: 1, time: o(134077) },  // snare38
  { string: 3, time: o(134506) },  // ride53
  { string: 4, time: o(135363) },  // crash49
  { string: 3, time: o(135791) },  // ride53
  { string: 1, time: o(136649) },  // snare38
  { string: 3, time: o(137077) },  // ride53
  { string: 0, time: o(137934) },  // crash49
  { string: 3, time: o(138363) },  // ride53
  { string: 1, time: o(139220) },  // snare38
  { string: 3, time: o(139649) },  // ride53
  { string: 4, time: o(140506) },  // crash49
  { string: 3, time: o(140934) },  // ride53
  { string: 1, time: o(141791) },  // snare38
  { string: 3, time: o(142220) },  // ride53
  { string: 0, time: o(143077) },  // crash49
  { string: 3, time: o(143506) },  // ride53
  { string: 1, time: o(144363) },  // snare38
  { string: 3, time: o(144791) },  // ride53
  { string: 4, time: o(145649) },  // crash49
  { string: 3, time: o(146077) },  // ride53
  { string: 1, time: o(146934) },  // snare38
  { string: 3, time: o(147363) },  // ride53
  { string: 3, time: o(148220) },  // tom47_140

  // ══════════════════════════════════════════════════════════
  // ФІНАЛ 140 BPM (т.87-94) — Crash57 кожен такт
  // ══════════════════════════════════════════════════════════
  { string: 4, time: o(148434) },  // tom50_140
  { string: 2, time: o(148649) },  // tom45_140
  { string: 0, time: o(148863) },  // crash57_fin
  { string: 3, time: o(149291) },  // ride53
  { string: 2, time: o(149720) },  // kick36
  { string: 1, time: o(149934) },  // snare38
  { string: 4, time: o(150149) },  // crash57_fin
  { string: 3, time: o(150577) },  // ride53
  { string: 2, time: o(151006) },  // kick36
  { string: 1, time: o(151220) },  // snare38
  { string: 0, time: o(151434) },  // crash57_fin
  { string: 3, time: o(151863) },  // ride53
  { string: 2, time: o(152291) },  // kick36
  { string: 1, time: o(152506) },  // snare38
  { string: 4, time: o(152720) },  // crash57_fin
  { string: 3, time: o(153149) },  // ride53
  { string: 2, time: o(153577) },  // kick36
  { string: 1, time: o(153791) },  // snare38
  { string: 0, time: o(154006) },  // crash57_fin
  { string: 3, time: o(154434) },  // ride53
  { string: 2, time: o(154863) },  // kick36
  { string: 1, time: o(155077) },  // snare38
  { string: 4, time: o(155291) },  // crash57_fin
  { string: 3, time: o(155720) },  // ride53
  { string: 2, time: o(156149) },  // kick36
  { string: 1, time: o(156363) },  // snare38
  { string: 0, time: o(156577) },  // crash57_fin
  { string: 3, time: o(157006) },  // ride53
  { string: 2, time: o(157434) },  // kick36
  { string: 1, time: o(157649) },  // snare38

  // ══════════════════════════════════════════════════════════
  // КУЛЬМІНАЦІЯ (т.95) — спуск томів
  // ══════════════════════════════════════════════════════════
  { string: 4, time: o(157863) },  // crash57_climax
  { string: 4, time: o(158077) },  // tom50
  { string: 4, time: o(158291) },  // tom50
  { string: 3, time: o(158506) },  // tom47
  { string: 2, time: o(158720) },  // tom45
  { string: 1, time: o(158934) },  // tom43

  // ══════════════════════════════════════════════════════════
  // ФІНАЛ cont. (т.96-102)
  // ══════════════════════════════════════════════════════════
  { string: 0, time: o(159149) },  // crash57
  { string: 4, time: o(159363) },  // tom50
  { string: 3, time: o(159577) },  // ride53
  { string: 4, time: o(159791) },  // tom50
  { string: 1, time: o(160220) },  // snare38
  { string: 4, time: o(160434) },  // crash57
  { string: 4, time: o(160649) },  // tom50
  { string: 3, time: o(160863) },  // ride53
  { string: 4, time: o(161077) },  // tom50
  { string: 1, time: o(161506) },  // snare38
  { string: 0, time: o(161720) },  // crash57
  { string: 4, time: o(161934) },  // tom50
  { string: 3, time: o(162149) },  // ride53
  { string: 4, time: o(162363) },  // tom50
  { string: 1, time: o(162791) },  // snare38
  { string: 4, time: o(163006) },  // crash57
  { string: 4, time: o(163220) },  // tom50
  { string: 3, time: o(163434) },  // ride53
  { string: 4, time: o(163649) },  // tom50
  { string: 1, time: o(164077) },  // snare38
  { string: 0, time: o(164291) },  // crash57
  { string: 4, time: o(164506) },  // tom50
  { string: 3, time: o(164720) },  // ride53
  { string: 4, time: o(164934) },  // tom50
  { string: 1, time: o(165363) },  // snare38
  { string: 4, time: o(165577) },  // crash57
  { string: 4, time: o(165791) },  // tom50
  { string: 3, time: o(166006) },  // ride53
  { string: 4, time: o(166220) },  // tom50
  { string: 1, time: o(166649) },  // snare38
  { string: 0, time: o(166863) },  // crash57
  { string: 4, time: o(167077) },  // tom50
  { string: 3, time: o(167291) },  // ride53
  { string: 4, time: o(167506) },  // tom50
  { string: 1, time: o(167934) },  // snare38

  // ══════════════════════════════════════════════════════════
  // ФІНАЛЬНИЙ FILL спуск (т.103)
  // ══════════════════════════════════════════════════════════
  { string: 4, time: o(168149) },  // crash57_final
  { string: 3, time: o(168363) },  // tom47
  { string: 3, time: o(168577) },  // tom47
  { string: 2, time: o(168791) },  // tom45
  { string: 1, time: o(169006) },  // tom43
  { string: 0, time: o(169220) },  // tom41
  { string: 0, time: o(169434) },  // FINAL_CRASH
];

export const HARD_SONG_DURATION = o(172434);