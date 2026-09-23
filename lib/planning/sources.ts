export type PlanningSource = {
  id: string;
  year: string;
  title: string;
  detail: string;
  href: string;
  en: string;
  zh: string;
};

export const planningSources: PlanningSource[] = [
  {
    id: "hillier-hanson-1984",
    year: "1984",
    title: "The Social Logic of Space",
    detail: "Bill Hillier & Julienne Hanson. Cambridge University Press.",
    href: "https://doi.org/10.1017/CBO9780511597237",
    en: "Configuration comes before the land-use label. Integration and depth are properties of the street network.",
    zh: "构形先于用地标签。整合度与深度是街道网络本身的性质。",
  },
  {
    id: "hillier-1996",
    year: "1996",
    title: "Space is the Machine",
    detail: "Bill Hillier. The movement economy, and natural movement.",
    href: "https://discovery.ucl.ac.uk/id/eprint/3881/",
    en: "Street layout shapes movement, and movement shapes which uses can survive. That is the link from SX02 to IF01.",
    zh: "街道布局塑造人流，人流决定哪些功能留得下来。这是 SX02 通向 IF01 的那一层。",
  },
  {
    id: "hillier-yang-turner-2012",
    year: "2012",
    title: "Normalising least angle choice in Depthmap",
    detail: "Bill Hillier, Tao Yang & Alasdair Turner. The Journal of Space Syntax 3(2).",
    href: "https://discovery.ucl.ac.uk/id/eprint/1389938/",
    en: "NAIN and NACH make integration and choice comparable across districts of different sizes. Use these, not raw choice.",
    zh: "NAIN 与 NACH 让不同规模片区的整合度、选择度可以比较。用归一化值，不用原始选择度。",
  },
  {
    id: "gil-2015",
    year: "2015",
    title: "The Space Syntax Toolkit",
    detail: "Jorge Gil, Tasos Varoudis, Kayvan Karimi & Alan Penn. SSS10. Bartlett, UCL.",
    href: "https://discovery.ucl.ac.uk/id/eprint/1490063/",
    en: "depthmapX inside QGIS: axial and segment analysis, plus land use, frontages, and service areas.",
    zh: "把 depthmapX 放进 QGIS：轴线与线段分析，以及用地、界面和服务区。",
  },
  {
    id: "depthmapx",
    year: "ongoing",
    title: "depthmapX",
    detail: "Tasos Varoudis and Space Syntax Laboratory, UCL. Successor to Alasdair Turner’s Depthmap.",
    href: "https://github.com/SpaceGroupUCL/depthmapX",
    en: "The graph engine. Segment angular analysis with choice, at metric radii, is the run Task 9 never made.",
    zh: "图计算引擎。带选择度的角度线段分析、按米制半径输出，是任务 9 没有跑的那一步。",
  },
  {
    id: "toolkit-repo",
    year: "0.3.10",
    title: "QGIS Space Syntax Toolkit",
    detail: "Plugin esstoolkit. Needs depthmapXnet for the network module.",
    href: "https://github.com/SpaceGroupUCL/qgisSpaceSyntaxToolkit",
    en: "The workbench around the engine: road centre lines, unverified links, entrances, and the join back to attributes.",
    zh: "引擎外面的工作台：道路中心线、未连接线段、出入口，以及算完写回属性表。",
  },
  {
    id: "mouratidis-2024",
    year: "2024",
    title: "Seven pitfalls of the 15-minute city",
    detail: "Kostas Mouratidis. Cities, 153. Facility counts inside a circle are not accessibility.",
    href: "https://www.sciencedirect.com/science/article/pii/S0264275124004888",
    en: "SE14’s hotel and bus counts sit in a walk circle. A circle is not the street network. SX04 is the correction.",
    zh: "SE14 的酒店和公交站落在步行圈里。圆不是街道网络。SX04 是这一步的修正。",
  },
  {
    id: "citynexus",
    year: "2024",
    title: "CityNexus",
    detail: "Destination Earth urban digital twin. What-if runs for mobility, population, and access.",
    href: "https://destination-earth.eu/use-cases/citynexus-a-novel-urban-digital-twin-application/",
    en: "A current example of the same three layers — movement, population, access — run as scenarios rather than a static table.",
    zh: "同一组层次的近期例子：出行、人口、可达，做成情景而不是一张静表。",
  },
];
