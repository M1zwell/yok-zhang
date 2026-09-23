import type { Locale } from "@/lib/i18n";

export type PlanningCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  titleAlt: string;
  lede: string;
  boundary: string;
  jump: string;
  navReading: string;
  navPlanet: string;
  navIndicators: string;
  navSyntax: string;
  navResearch: string;
  followKicker: string;
  followTitle: string;
  followLede: string;
  usual: string;
  residents: string;
  workers: string;
  visitors: string;
  labor: string;
  density: string;
  industry: string;
  walk: string;
  housing: string;
  rent: string;
  floors: string;
  dining: string;
  drive: string;
  peopleNote: string;
  qualityTitle: string;
  contradiction: string;
  images: string;
  mix: string;
  night: string;
  carbon: string;
  events: string;
  checksTitle: string;
  checkPopulation: string;
  checkAge: string;
  checkArea: string;
  checkVisitors: string;
  pass: string;
  fail: string;
  coverage: string;
  statusValue: string;
  statusZero: string;
  statusNoData: string;
  statusError: string;
  distAge: string;
  distIncome: string;
  distJob: string;
  distSpend: string;
  distTicket: string;
  distPhone: string;
  distCarrier: string;
  distSex: string;
  planetKicker: string;
  planetTitle: string;
  planetLede: string;
  layerPeople: string;
  layerEconomy: string;
  layerSyntax: string;
  layerCarbon: string;
  peopleReading: string;
  economyReading: string;
  syntaxReading: string;
  carbonReading: string;
  schematic: string;
  openPlanet: string;
  openWorlds: string;
  indicatorKicker: string;
  indicatorTitle: string;
  indicatorLede: string;
  code: string;
  name: string;
  query: string;
  reset: string;
  exportExcel: string;
  exportJson: string;
  proposedToggle: string;
  dimension: string;
  module: string;
  source: string;
  any: string;
  results: string;
  empty: string;
  requiredYes: string;
  requiredNo: string;
  definitionMissing: string;
  depends: string;
  attempts: string;
  colCode: string;
  colName: string;
  colUnit: string;
  colType: string;
  colGrain: string;
  colDimension: string;
  colModule: string;
  colRequired: string;
  colDepends: string;
  colTask: string;
  close: string;
  syntaxKicker: string;
  syntaxTitle: string;
  syntaxLede: string;
  stepBoundary: string;
  stepGraph: string;
  stepJoin: string;
  radii: string;
  formula: string;
  se14: string;
  also: string;
  proposedTitle: string;
  notRun: string;
  researchKicker: string;
  researchTitle: string;
  researchLede: string;
  contractTitle: string;
  contractBody: string;
};

const en: PlanningCopy = {
  metaTitle: "Planning",
  metaDescription:
    "Spatial, population, and economy advisory. Task 9 follow-up for one study area, with the authorised indicator catalog and a Space Syntax, depthmapX, and QGIS layer.",
  kicker: "ichina.co/planning · Task 9 follow-up",
  title: "Read the district before you draw it.",
  titleAlt: "先读片区，再画方案。",
  lede: "Task 9 is one collected reading. The population accounts close. Catering leads the POI count, and visitors outnumber usual residents. The street network was never analysed, and several authorised indicators came back empty. This is the desk for that follow-up.",
  boundary:
    "The file stores city 郑州 and district 洛阳. Luoyang is a prefecture-level city in Henan, not a district of Zhengzhou. SE12 records the scope as 「郑州洛阳」. Keep the pair as collected, and confirm one polygon in QGIS before either name becomes the boundary.",
  jump: "On this page",
  navReading: "Reading",
  navPlanet: "Planet",
  navIndicators: "Indicators",
  navSyntax: "Syntax",
  navResearch: "Research",
  followKicker: "Collected output",
  followTitle: "What Task 9 actually returned",
  followLede:
    "Figures below are the stored values. Derived checks are labelled as checks. Nothing here is a DepthmapX result.",
  usual: "Usual population",
  residents: "Residents",
  workers: "Workers",
  visitors: "Visitors",
  labor: "Working age",
  density: "Density",
  industry: "Leading POI",
  walk: "10-minute circle",
  housing: "Housing price",
  rent: "Office rent",
  floors: "Office floors",
  dining: "Monthly dining",
  drive: "Drive a car",
  peopleNote: "SE01 equals SE02 plus SE03 in this run. The definition asks for a de-duplicated union. Here the two groups do not overlap.",
  qualityTitle: "Follow-up, before anyone briefs a client",
  contradiction:
    "IF01 counts catering POIs in the thousands. The later IF03 pass counts zero retail, catering, education, medical, and leisure facilities. The earlier IF03 pass failed because the supporting workbook was missing. Those statements cannot describe the same layer until the POI table and the facility table are joined.",
  images: "IF05 is waiting on two dates of satellite or aerial imagery. Retrofit share stays unmeasured.",
  mix: "IF04 has an empty definition in the catalog and an empty result in the run. It asked for a supporting workbook. Functional mix needs a formula before it needs another export.",
  night: "IF09, IF10, and IF11 were not extracted. Night economy and 24-hour service cannot be read from this file. IF10 and IF11 also depend on IF09, so the dependency is blocked.",
  carbon: "IF06, IF07, and IF08 returned no data from the web and certification sources. The carbon ring stays off.",
  events: "SE12 was collected as zero events for 2026, scope 「郑州洛阳」. A zero is a value. It is not the same failure as a missing extractor.",
  checksTitle: "Accounts that close",
  checkPopulation: "Resident plus workplace equals usual population",
  checkAge: "Ages 18–64 sum to the working-age share",
  checkArea: "Usual population divided by density",
  checkVisitors: "Visitors divided by usual population",
  pass: "Holds",
  fail: "Breaks",
  coverage: "Latest status across the 39 authorised codes",
  statusValue: "Value",
  statusZero: "Zero",
  statusNoData: "No data",
  statusError: "Error",
  distAge: "Age",
  distIncome: "Income",
  distJob: "Occupation",
  distSpend: "Monthly spend",
  distTicket: "Dining ticket",
  distPhone: "Handset price",
  distCarrier: "Carrier",
  distSex: "Sex",
  planetKicker: "jubuddy.com/planet",
  planetTitle: "One advisory planet, after the graph exists",
  planetLede:
    "The live planet is a walkable surface of building footprints. It can take this district as one added surface, not as a twenty-fifth city in the catalog. Task 9 has no mesh and no axial map, so the globe here is a schematic bound to the numbers that exist.",
  layerPeople: "Population",
  layerEconomy: "Economy",
  layerSyntax: "Syntax",
  layerCarbon: "Carbon",
  peopleReading: "Residents and workers partition the usual population. Visitors are the larger arrival.",
  economyReading: "Catering leads, manufacturing is close behind. Office rent is a low daily rate beside a hotel-heavy walk circle. Night hours were not extracted.",
  syntaxReading: "These streets are drawn for the presentation. They are not an integration map. Run depthmapX before this layer is allowed to mean anything.",
  carbonReading: "Low-carbon strategy, LID, and green certification returned no data. The ring stays dim on purpose.",
  schematic: "Schematic globe. Population and industry use Task 9. Street lines are not depthmapX output.",
  openPlanet: "jubuddy.com/planet",
  openWorlds: "gghere.com/worlds",
  indicatorKicker: "Authorised catalog",
  indicatorTitle: "Indicator definition query",
  indicatorLede:
    "Same fields as the collection desk: code, name, unit, type, grain, dimension, module, definition, required, dependency, category. Task 9 is joined on the right.",
  code: "Indicator code",
  name: "Indicator name",
  query: "Query",
  reset: "Reset",
  exportExcel: "Export Excel",
  exportJson: "Export JSON",
  proposedToggle: "Include proposed spatial measures (SX)",
  dimension: "Dimension",
  module: "Module",
  source: "Type",
  any: "Any",
  results: "showing",
  empty: "No indicator matches.",
  requiredYes: "Required",
  requiredNo: "Optional",
  definitionMissing: "No definition is stored in the catalog.",
  depends: "Depends on",
  attempts: "Collection attempts",
  colCode: "Code",
  colName: "Name",
  colUnit: "Unit",
  colType: "Type",
  colGrain: "Grain",
  colDimension: "Dimension",
  colModule: "Module",
  colRequired: "Required",
  colDepends: "Depends",
  colTask: "Task 9",
  close: "Close",
  syntaxKicker: "UCL Space Syntax",
  syntaxTitle: "The catalog is rich in attributes and silent on configuration",
  syntaxLede:
    "Task 9 can say who is there and which POI class leads. It cannot say whether those uses sit on a through-movement street or a deep one. That is a Space Syntax question. depthmapX computes it. QGIS holds the boundary, the road centre lines, and the join.",
  stepBoundary: "Confirm one study polygon. Do not leave 郑州 and 洛阳 as two names for an unmeasured area.",
  stepGraph: "Road centre lines to a segment map. Angular segment analysis in depthmapX, with choice, at 400, 800, 1200, and n.",
  stepJoin: "Write NAIN and NACH back to the segments. Join POI, entrances, and the Task 9 attributes. Then the planet has a layer to show.",
  radii:
    "For a district of about three square kilometres, 400 m and 800 m are the local readings. 800 m is also the network version of a 10-minute walk if speed is taken as 80 metres a minute. That speed is a convention, not a measured speed for this place.",
  formula:
    "In depthmapX, NAIN = node count^1.2 / (total depth + 2) and NACH = log(choice + 1) / log(total depth + 3). Hillier, Yang & Turner, 2012.",
  se14: "SE14 reports hotels and bus stops inside a 10-minute circle. A circle from the centroid cuts through blocks. Mouratidis (2024) is the caution: a facility count in a buffer is not accessibility. SX04 replaces the circle with a network service area from the Space Syntax Toolkit.",
  also: "sDNA and the Urban Network Analysis toolbox compute related reach and betweenness. The path that matches this lab is depthmapX through the UCL toolkit, because the measures planners will compare are NAIN and NACH.",
  proposedTitle: "Proposed measures, not in the authorised catalog",
  notRun: "Not run on Task 9",
  researchKicker: "Ground",
  researchTitle: "What the reading is standing on",
  researchLede:
    "The indicator list is an authorised product schema. These sources are why the next layer is a street graph, and why the planet waits for that graph.",
  contractTitle: "For the people building the extractor",
  contractBody:
    "Keep the status enum explicit: value, zero, no_data, error. A zero event count is not an extractor failure. NO_DATA is not an error string. IF03 shows why a later success can still be the wrong layer. Dependencies are part of the result: do not publish IF10 while IF09 failed. Leave SX codes out of the authorised export until the graph has been run.",
};

const zhHans: PlanningCopy = {
  metaTitle: "规划",
  metaDescription:
    "空间、人口与经济咨询。任务 9 续读：授权指标目录，以及空间句法、depthmapX 与 QGIS 要补上的一层。",
  kicker: "ichina.co/planning · 任务 9 续读",
  title: "先读片区，再画方案。",
  titleAlt: "Read the district before you draw it.",
  lede: "任务 9 是一次已经采集的读数。人口账能够闭合。餐饮 POI 领先，到访人口多于常驻人口。街道网络没有计算，若干授权指标返回空值。这个页面是那次续读。",
  boundary:
    "文件里的城市是郑州，区县是洛阳。洛阳是河南的地级市，不是郑州的区。SE12 把统计范围写成「郑州洛阳」。先按采集原值保留这对名称，在 QGIS 里确认一个多边形之后，再让其中任何一个名字成为边界。",
  jump: "本页",
  navReading: "读数",
  navPlanet: "行星",
  navIndicators: "指标",
  navSyntax: "句法",
  navResearch: "研究",
  followKicker: "采集输出",
  followTitle: "任务 9 实际返回了什么",
  followLede: "下面的数字是入库原值。推导检查会标明是检查。这里没有任何 depthmapX 结果。",
  usual: "常驻人口",
  residents: "居住人口",
  workers: "工作人口",
  visitors: "到访人口",
  labor: "劳动年龄",
  density: "密度",
  industry: "主导 POI",
  walk: "10 分钟步行圈",
  housing: "房均价",
  rent: "写字楼租金",
  floors: "写字楼层数",
  dining: "月餐饮消费",
  drive: "驾车",
  peopleNote: "这一次 SE01 正好等于 SE02 加 SE03。定义要求的是去重后的并集。这次两组没有重叠。",
  qualityTitle: "给客户汇报之前要先处理的续读",
  contradiction:
    "IF01 统计到上千个餐饮 POI。较晚的一次 IF03 把商业零售、餐饮、教育、医疗、文体休闲全部计为 0。较早的一次 IF03 因为缺少配套工作簿而失败。在 POI 表和设施表完成接合之前，这两句不能描述同一层数据。",
  images: "IF05 还在等两个时相的卫星或航拍影像。既有建筑改造比例尚未测到。",
  mix: "IF04 在目录里没有定义，在这次运行里也没有结果。它要求上传配套工作簿。功能复合度要先有公式，再谈下一次导出。",
  night: "IF09、IF10、IF11 没有提取到。夜间经济和 24 小时服务不能从这份文件里读出。IF10 与 IF11 依赖 IF09，所以这条依赖是阻断的。",
  carbon: "IF06、IF07、IF08 从网页和认证来源返回无数据。碳环因此保持关闭。",
  events: "SE12 按 2026 年、范围「郑州洛阳」采集为 0 场活动。零是一个值。它和提取器失败不是同一种状态。",
  checksTitle: "能够闭合的账",
  checkPopulation: "居住人口加工作人口等于常驻人口",
  checkAge: "18–64 岁占比之和等于劳动年龄占比",
  checkArea: "常驻人口除以密度",
  checkVisitors: "到访人口除以常驻人口",
  pass: "成立",
  fail: "不成立",
  coverage: "39 个授权编码的最新状态",
  statusValue: "有值",
  statusZero: "零值",
  statusNoData: "无数据",
  statusError: "错误",
  distAge: "年龄",
  distIncome: "收入",
  distJob: "职业",
  distSpend: "月消费",
  distTicket: "餐饮客单",
  distPhone: "手机价格",
  distCarrier: "运营商",
  distSex: "性别",
  planetKicker: "jubuddy.com/planet",
  planetTitle: "先有街道图，再加一颗咨询行星",
  planetLede:
    "现在的行星是可走的建筑足迹表面。这个片区可以作为一颗追加的表面，而不是目录里的第二十五座城。任务 9 没有网格，也没有轴线图，所以这里的球体是绑定已有数字的示意图。",
  layerPeople: "人口",
  layerEconomy: "经济",
  layerSyntax: "句法",
  layerCarbon: "碳",
  peopleReading: "居住与工作把常驻人口分成两半，且没有余数。到访是更大的到达量。",
  economyReading: "餐饮领先，制造业紧随。写字楼日租金很低，步行圈里的酒店却很多。营业时间没有提取到。",
  syntaxReading: "这些街道是为演示画的。它们不是整合度图。在 depthmapX 跑完之前，这一层不能被读成分析结果。",
  carbonReading: "低碳策略、低影响开发和绿色认证都返回无数据。环保持暗，是有意的。",
  schematic: "示意球体。人口与产业使用任务 9。街道线不是 depthmapX 输出。",
  openPlanet: "jubuddy.com/planet",
  openWorlds: "gghere.com/worlds",
  indicatorKicker: "授权目录",
  indicatorTitle: "指标定义查询",
  indicatorLede:
    "与采集台相同的字段：编码、名称、单位、类型、时间粒度、维度、模块、定义、必填、依赖、分类。右侧接上任务 9。",
  code: "指标编码",
  name: "指标名称",
  query: "查询",
  reset: "重置",
  exportExcel: "导出 Excel",
  exportJson: "导出 JSON",
  proposedToggle: "包含建议的空间测度（SX）",
  dimension: "维度",
  module: "模块",
  source: "类型",
  any: "全部",
  results: "条",
  empty: "没有匹配的指标。",
  requiredYes: "必填",
  requiredNo: "非必填",
  definitionMissing: "目录里没有写入定义。",
  depends: "依赖",
  attempts: "采集次数",
  colCode: "编码",
  colName: "名称",
  colUnit: "单位",
  colType: "类型",
  colGrain: "时间粒度",
  colDimension: "维度",
  colModule: "模块",
  colRequired: "必填",
  colDepends: "依赖",
  colTask: "任务 9",
  close: "关闭",
  syntaxKicker: "UCL 空间句法",
  syntaxTitle: "目录里属性很多，构形是沉默的",
  syntaxLede:
    "任务 9 能说明谁在这里、哪一类 POI 领先。它不能说明这些功能是落在穿越性街道上，还是落在很深的街道上。这是空间句法的问题。depthmapX 负责计算。QGIS 负责边界、道路中心线和结果回写。",
  stepBoundary: "确认一个研究多边形。不要让郑州和洛阳继续作为一块未测量范围的两个名字。",
  stepGraph: "道路中心线转为线段图。在 depthmapX 里做角度线段分析，包含选择度，半径取 400、800、1200 和 n。",
  stepJoin: "把 NAIN 和 NACH 写回线段。接合 POI、出入口和任务 9 的属性。然后行星才有一层可以显示。",
  radii:
    "大约三平方公里的片区，400 米和 800 米是局部读数。若步速取每分钟 80 米，800 米也就是 10 分钟步行的网络版本。这个步速是约定，不是此地测到的速度。",
  formula:
    "在 depthmapX 中，NAIN = 节点数^1.2 /（总深度 + 2），NACH = log(选择度 + 1) / log(总深度 + 3)。Hillier、Yang 与 Turner，2012。",
  se14: "SE14 报告的是 10 分钟圈内的酒店和公交站。从中心点画出的圆会切过街坊。Mouratidis（2024）的提醒是：缓冲区内的设施计数不是可达性。SX04 用空间句法工具包里的网络服务区替换这个圆。",
  also: "sDNA 和 Urban Network Analysis 工具箱也能算相近的到达与中介性。和这个实验室对齐的路径，是通过 UCL 工具包使用 depthmapX，因为规划上要对照的是 NAIN 和 NACH。",
  proposedTitle: "建议测度，不在授权目录里",
  notRun: "任务 9 未计算",
  researchKicker: "依据",
  researchTitle: "这次数读站在什么上面",
  researchLede: "指标清单是授权的产品结构。这些文献说明下一层为什么是街道图，以及行星为什么要等这张图。",
  contractTitle: "给写提取器的人",
  contractBody:
    "把状态枚举写清楚：有值、零值、无数据、错误。活动场次为 0 不是提取失败。NO_DATA 不是一条错误字符串。IF03 说明较晚的一次“成功”仍然可能是错误的层。依赖是结果的一部分：IF09 失败时不要发布 IF10。在街道图算完之前，不要把 SX 编码放进授权导出。",
};

const zhHant: PlanningCopy = {
  metaTitle: "規劃",
  metaDescription:
    "空間、人口與經濟諮詢。任務 9 續讀：授權指標目錄，以及空間句法、depthmapX 與 QGIS 要補上的一層。",
  kicker: "ichina.co/planning · 任務 9 續讀",
  title: "先讀片區，再畫方案。",
  titleAlt: "Read the district before you draw it.",
  lede: "任務 9 是一次已經採集的讀數。人口帳能夠閉合。餐飲 POI 領先，到訪人口多於常駐人口。街道網絡沒有計算，若干授權指標返回空值。這個頁面是那次續讀。",
  boundary:
    "檔案裡的城市是鄭州，區縣是洛陽。洛陽是河南的地級市，不是鄭州的區。SE12 把統計範圍寫成「郑州洛阳」。先按採集原值保留這對名稱，在 QGIS 裡確認一個多邊形之後，再讓其中任何一個名字成為邊界。",
  jump: "本頁",
  navReading: "讀數",
  navPlanet: "行星",
  navIndicators: "指標",
  navSyntax: "句法",
  navResearch: "研究",
  followKicker: "採集輸出",
  followTitle: "任務 9 實際返回了什麼",
  followLede: "下面的數字是入庫原值。推導檢查會標明是檢查。這裡沒有任何 depthmapX 結果。",
  usual: "常駐人口",
  residents: "居住人口",
  workers: "工作人口",
  visitors: "到訪人口",
  labor: "勞動年齡",
  density: "密度",
  industry: "主導 POI",
  walk: "10 分鐘步行圈",
  housing: "房均價",
  rent: "寫字樓租金",
  floors: "寫字樓層數",
  dining: "月餐飲消費",
  drive: "駕車",
  peopleNote: "這一次 SE01 正好等於 SE02 加 SE03。定義要求的是去重後的並集。這次兩組沒有重疊。",
  qualityTitle: "給客戶匯報之前要先處理的續讀",
  contradiction:
    "IF01 統計到上千個餐飲 POI。較晚的一次 IF03 把商業零售、餐飲、教育、醫療、文體休閒全部計為 0。較早的一次 IF03 因為缺少配套工作簿而失敗。在 POI 表和設施表完成接合之前，這兩句不能描述同一層資料。",
  images: "IF05 還在等兩個時相的衛星或航拍影像。既有建築改造比例尚未測到。",
  mix: "IF04 在目錄裡沒有定義，在這次運行裡也沒有結果。它要求上傳配套工作簿。功能複合度要先有公式，再談下一次匯出。",
  night: "IF09、IF10、IF11 沒有提取到。夜間經濟和 24 小時服務不能從這份檔案裡讀出。IF10 與 IF11 依賴 IF09，所以這條依賴是阻斷的。",
  carbon: "IF06、IF07、IF08 從網頁和認證來源返回無資料。碳環因此保持關閉。",
  events: "SE12 按 2026 年、範圍「郑州洛阳」採集為 0 場活動。零是一個值。它和提取器失敗不是同一種狀態。",
  checksTitle: "能夠閉合的帳",
  checkPopulation: "居住人口加工作人口等於常駐人口",
  checkAge: "18–64 歲占比之和等於勞動年齡占比",
  checkArea: "常駐人口除以密度",
  checkVisitors: "到訪人口除以常駐人口",
  pass: "成立",
  fail: "不成立",
  coverage: "39 個授權編碼的最新狀態",
  statusValue: "有值",
  statusZero: "零值",
  statusNoData: "無資料",
  statusError: "錯誤",
  distAge: "年齡",
  distIncome: "收入",
  distJob: "職業",
  distSpend: "月消費",
  distTicket: "餐飲客單",
  distPhone: "手機價格",
  distCarrier: "運營商",
  distSex: "性別",
  planetKicker: "jubuddy.com/planet",
  planetTitle: "先有街道圖，再加一顆諮詢行星",
  planetLede:
    "現在的行星是可走的建築足跡表面。這個片區可以作為一顆追加的表面，而不是目錄裡的第二十五座城。任務 9 沒有網格，也沒有軸線圖，所以這裡的球體是綁定已有數字的示意圖。",
  layerPeople: "人口",
  layerEconomy: "經濟",
  layerSyntax: "句法",
  layerCarbon: "碳",
  peopleReading: "居住與工作把常駐人口分成兩半，且沒有餘數。到訪是更大的到達量。",
  economyReading: "餐飲領先，製造業緊隨。寫字樓日租金很低，步行圈裡的酒店卻很多。營業時間沒有提取到。",
  syntaxReading: "這些街道是為演示畫的。它們不是整合度圖。在 depthmapX 跑完之前，這一層不能被讀成分析結果。",
  carbonReading: "低碳策略、低影響開發和綠色認證都返回無資料。環保持暗，是有意的。",
  schematic: "示意球體。人口與產業使用任務 9。街道線不是 depthmapX 輸出。",
  openPlanet: "jubuddy.com/planet",
  openWorlds: "gghere.com/worlds",
  indicatorKicker: "授權目錄",
  indicatorTitle: "指標定義查詢",
  indicatorLede:
    "與採集台相同的欄位：編碼、名稱、單位、類型、時間粒度、維度、模組、定義、必填、依賴、分類。右側接上任務 9。",
  code: "指標編碼",
  name: "指標名稱",
  query: "查詢",
  reset: "重置",
  exportExcel: "匯出 Excel",
  exportJson: "匯出 JSON",
  proposedToggle: "包含建議的空間測度（SX）",
  dimension: "維度",
  module: "模組",
  source: "類型",
  any: "全部",
  results: "條",
  empty: "沒有匹配的指標。",
  requiredYes: "必填",
  requiredNo: "非必填",
  definitionMissing: "目錄裡沒有寫入定義。",
  depends: "依賴",
  attempts: "採集次數",
  colCode: "編碼",
  colName: "名稱",
  colUnit: "單位",
  colType: "類型",
  colGrain: "時間粒度",
  colDimension: "維度",
  colModule: "模組",
  colRequired: "必填",
  colDepends: "依賴",
  colTask: "任務 9",
  close: "關閉",
  syntaxKicker: "UCL 空間句法",
  syntaxTitle: "目錄裡屬性很多，構形是沉默的",
  syntaxLede:
    "任務 9 能說明誰在這裡、哪一類 POI 領先。它不能說明這些功能是落在穿越性街道上，還是落在很深的街道上。這是空間句法的問題。depthmapX 負責計算。QGIS 負責邊界、道路中心線和結果回寫。",
  stepBoundary: "確認一個研究多邊形。不要讓鄭州和洛陽繼續作為一塊未測量範圍的兩個名字。",
  stepGraph: "道路中心線轉為線段圖。在 depthmapX 裡做角度線段分析，包含選擇度，半徑取 400、800、1200 和 n。",
  stepJoin: "把 NAIN 和 NACH 寫回線段。接合 POI、出入口和任務 9 的屬性。然後行星才有一層可以顯示。",
  radii:
    "大約三平方公里的片區，400 米和 800 米是局部讀數。若步速取每分鐘 80 米，800 米也就是 10 分鐘步行的網絡版本。這個步速是約定，不是此地測到的速度。",
  formula:
    "在 depthmapX 中，NAIN = 節點數^1.2 /（總深度 + 2），NACH = log(選擇度 + 1) / log(總深度 + 3)。Hillier、Yang 與 Turner，2012。",
  se14: "SE14 報告的是 10 分鐘圈內的酒店和公交站。從中心點畫出的圓會切過街坊。Mouratidis（2024）的提醒是：緩衝區內的設施計數不是可達性。SX04 用空間句法工具包裡的網絡服務區替換這個圓。",
  also: "sDNA 和 Urban Network Analysis 工具箱也能算相近的到達與中介性。和這個實驗室對齊的路徑，是透過 UCL 工具包使用 depthmapX，因為規劃上要對照的是 NAIN 和 NACH。",
  proposedTitle: "建議測度，不在授權目錄裡",
  notRun: "任務 9 未計算",
  researchKicker: "依據",
  researchTitle: "這次讀數站在什麼上面",
  researchLede: "指標清單是授權的產品結構。這些文獻說明下一層為什麼是街道圖，以及行星為什麼要等這張圖。",
  contractTitle: "給寫提取器的人",
  contractBody:
    "把狀態枚舉寫清楚：有值、零值、無資料、錯誤。活動場次為 0 不是提取失敗。NO_DATA 不是一條錯誤字串。IF03 說明較晚的一次「成功」仍然可能是錯誤的層。依賴是結果的一部分：IF09 失敗時不要發布 IF10。在街道圖算完之前，不要把 SX 編碼放進授權匯出。",
};

export function planningCopy(locale: Locale): PlanningCopy {
  switch (locale) {
    case "zh-Hans":
      return zhHans;
    case "zh-Hant":
      return zhHant;
    case "en":
    case "ja":
    case "ko":
    case "th":
    case "nl":
      return en;
    default: {
      const neverLocale: never = locale;
      return neverLocale;
    }
  }
}
