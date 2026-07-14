import type { GlobalKpis, HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg, AgeBand } from '@/lib/types/insights'

export const MOCK_GLOBAL_KPIS: GlobalKpis = {
  totalPatients:    24567,
  ocsUse:           18234,  ocsUseRate:       74.2,
  ocsOveruse:        6803,  ocsOveruseRate:   27.7,
  m7Rate:           27.7,
  chronicOcs:        8398,  chronicOcsRate:   34.2,
  highDose:          5234,  highDoseRate:     21.3,
  repeatCourse:      7124,  repeatCourseRate: 29.0,
  taperFailure:      3201,  taperFailureRate: 17.6,
  relapse:           2408,  relapseRate:      13.2,
}

const RAW_HCP_ROWS = [
  { npi:'1234567890', name:'Dr. Aisha Williams',      specialty:'Gastroenterology', account:'Mass General Hospital',    territory:'Northeast',       region:'East',    totalPatients:142, ocsUse:118, chronicOcs:71, highDose:44, ocsOveruse:97,  repeatCourse:62, taperFailure:31, relapse:24, m7Rate:68.3 },
  { npi:'2345678901', name:'Dr. Robert Chen',          specialty:'Gastroenterology', account:'NYU Langone',             territory:'Mid-Atlantic',    region:'East',    totalPatients:128, ocsUse:104, chronicOcs:58, highDose:36, ocsOveruse:82,  repeatCourse:51, taperFailure:24, relapse:19, m7Rate:64.1 },
  { npi:'3456789012', name:'Dr. Maria Santos',         specialty:'Internal Medicine',account:'Cleveland Clinic',        territory:'Midwest',         region:'Midwest', totalPatients:89,  ocsUse:72,  chronicOcs:41, highDose:25, ocsOveruse:52,  repeatCourse:34, taperFailure:18, relapse:12, m7Rate:58.4 },
  { npi:'4567890123', name:'Dr. James Wilson',         specialty:'Gastroenterology', account:'Mayo Clinic',             territory:'Midwest',         region:'Midwest', totalPatients:167, ocsUse:139, chronicOcs:88, highDose:55, ocsOveruse:95,  repeatCourse:72, taperFailure:41, relapse:31, m7Rate:56.9 },
  { npi:'5678901234', name:'Dr. Priya Patel',          specialty:'Gastroenterology', account:'UCSF Medical Center',     territory:'Pacific SW',      region:'West',    totalPatients:112, ocsUse:91,  chronicOcs:49, highDose:30, ocsOveruse:61,  repeatCourse:44, taperFailure:20, relapse:16, m7Rate:54.5 },
  { npi:'6789012345', name:'Dr. Thomas Brown',         specialty:'Internal Medicine',account:'Johns Hopkins',           territory:'Mid-Atlantic',    region:'East',    totalPatients:78,  ocsUse:61,  chronicOcs:31, highDose:19, ocsOveruse:41,  repeatCourse:28, taperFailure:14, relapse:10, m7Rate:52.6 },
  { npi:'7890123456', name:'Dr. Sarah Johnson',        specialty:'Gastroenterology', account:'Stanford Health',         territory:'Pacific SW',      region:'West',    totalPatients:134, ocsUse:108, chronicOcs:62, highDose:38, ocsOveruse:69,  repeatCourse:53, taperFailure:27, relapse:20, m7Rate:51.5 },
  { npi:'8901234567', name:'Dr. Michael Kim',          specialty:'Gastroenterology', account:'Northwestern Medicine',   territory:'Midwest',         region:'Midwest', totalPatients:98,  ocsUse:79,  chronicOcs:44, highDose:27, ocsOveruse:48,  repeatCourse:37, taperFailure:19, relapse:14, m7Rate:49.0 },
  { npi:'9012345678', name:'Dr. Laura Martinez',       specialty:'Rheumatology',     account:"Brigham & Women's",      territory:'Northeast',       region:'East',    totalPatients:67,  ocsUse:52,  chronicOcs:27, highDose:17, ocsOveruse:31,  repeatCourse:22, taperFailure:11, relapse:8,  m7Rate:46.3 },
  { npi:'1098765432', name:'Dr. David Thompson',       specialty:'Internal Medicine',account:'Duke University Hospital',territory:'Southeast',       region:'South',   totalPatients:83,  ocsUse:65,  chronicOcs:34, highDose:21, ocsOveruse:37,  repeatCourse:27, taperFailure:13, relapse:9,  m7Rate:44.6 },
  { npi:'2109876543', name:'Dr. Emily Wang',           specialty:'Gastroenterology', account:'Cedars-Sinai',           territory:'Pacific SW',      region:'West',    totalPatients:119, ocsUse:94,  chronicOcs:51, highDose:32, ocsOveruse:52,  repeatCourse:41, taperFailure:21, relapse:15, m7Rate:43.7 },
  { npi:'3210987654', name:'Dr. Carlos Rodriguez',     specialty:'Gastroenterology', account:'UT Southwestern',        territory:'Southwest',       region:'South',   totalPatients:91,  ocsUse:71,  chronicOcs:37, highDose:23, ocsOveruse:39,  repeatCourse:30, taperFailure:15, relapse:11, m7Rate:42.9 },
  { npi:'4321098765', name:'Dr. Jennifer Lee',         specialty:'Internal Medicine',account:'Vanderbilt Medical',     territory:'Southeast',       region:'South',   totalPatients:74,  ocsUse:57,  chronicOcs:28, highDose:17, ocsOveruse:31,  repeatCourse:23, taperFailure:11, relapse:8,  m7Rate:41.9 },
  { npi:'5432109876', name:'Dr. Richard Davis',        specialty:'Gastroenterology', account:'OHSU',                   territory:'Pacific NW',      region:'West',    totalPatients:108, ocsUse:84,  chronicOcs:43, highDose:27, ocsOveruse:44,  repeatCourse:35, taperFailure:17, relapse:12, m7Rate:40.7 },
  { npi:'6543210987', name:'Dr. Amanda Taylor',        specialty:'Gastroenterology', account:'Emory Healthcare',       territory:'Southeast',       region:'South',   totalPatients:82,  ocsUse:63,  chronicOcs:31, highDose:19, ocsOveruse:33,  repeatCourse:25, taperFailure:12, relapse:9,  m7Rate:40.2 },
  { npi:'7654321098', name:'Dr. Kevin Anderson',       specialty:'Internal Medicine',account:'Penn Medicine',          territory:'Mid-Atlantic',    region:'East',    totalPatients:61,  ocsUse:46,  chronicOcs:21, highDose:13, ocsOveruse:24,  repeatCourse:18, taperFailure:8,  relapse:6,  m7Rate:39.3 },
  { npi:'8765432109', name:'Dr. Rachel Moore',         specialty:'Gastroenterology', account:'Scripps Health',         territory:'Pacific SW',      region:'West',    totalPatients:93,  ocsUse:71,  chronicOcs:35, highDose:22, ocsOveruse:36,  repeatCourse:28, taperFailure:13, relapse:9,  m7Rate:38.7 },
  { npi:'9876543210', name:'Dr. Steven Jackson',       specialty:'Gastroenterology', account:'IU Health',              territory:'Midwest',         region:'Midwest', totalPatients:87,  ocsUse:66,  chronicOcs:32, highDose:20, ocsOveruse:33,  repeatCourse:26, taperFailure:12, relapse:9,  m7Rate:37.9 },
  { npi:'1987654321', name:'Dr. Michelle White',       specialty:'Gastroenterology', account:'Baylor Scott & White',   territory:'Southwest',       region:'South',   totalPatients:76,  ocsUse:57,  chronicOcs:27, highDose:17, ocsOveruse:28,  repeatCourse:21, taperFailure:10, relapse:7,  m7Rate:36.8 },
  { npi:'2876543219', name:'Dr. Christopher Harris',   specialty:'Internal Medicine',account:'University of Michigan', territory:'Midwest',         region:'Midwest', totalPatients:64,  ocsUse:48,  chronicOcs:22, highDose:14, ocsOveruse:23,  repeatCourse:17, taperFailure:8,  relapse:6,  m7Rate:35.9 },
  { npi:'3765432198', name:'Dr. Nancy Clark',          specialty:'Gastroenterology', account:'MUSC Health',            territory:'Southeast',       region:'South',   totalPatients:98,  ocsUse:73,  chronicOcs:33, highDose:21, ocsOveruse:31,  repeatCourse:24, taperFailure:11, relapse:8,  m7Rate:31.6 },
  { npi:'4654321987', name:'Dr. Paul Lewis',           specialty:'Gastroenterology', account:'UCHealth',               territory:'Mountain West',   region:'West',    totalPatients:71,  ocsUse:52,  chronicOcs:22, highDose:14, ocsOveruse:21,  repeatCourse:16, taperFailure:7,  relapse:5,  m7Rate:29.6 },
  { npi:'5543210976', name:'Dr. Linda Robinson',       specialty:'Internal Medicine',account:'Banner Health',          territory:'Southwest',       region:'South',   totalPatients:52,  ocsUse:37,  chronicOcs:14, highDose:9,  ocsOveruse:14,  repeatCourse:10, taperFailure:4,  relapse:3,  m7Rate:26.9 },
  { npi:'6432109865', name:'Dr. Mark Walker',          specialty:'Gastroenterology', account:'Sutter Health',          territory:'Pacific SW',      region:'West',    totalPatients:83,  ocsUse:60,  chronicOcs:24, highDose:15, ocsOveruse:22,  repeatCourse:17, taperFailure:7,  relapse:5,  m7Rate:26.5 },
  { npi:'7321098754', name:'Dr. Dorothy Hall',         specialty:'Rheumatology',     account:'Hartford HealthCare',    territory:'Northeast',       region:'East',    totalPatients:44,  ocsUse:31,  chronicOcs:11, highDose:7,  ocsOveruse:11,  repeatCourse:8,  taperFailure:3,  relapse:2,  m7Rate:25.0 },
  { npi:'8210987643', name:'Dr. George Allen',         specialty:'Gastroenterology', account:'Prisma Health',          territory:'Southeast',       region:'South',   totalPatients:67,  ocsUse:47,  chronicOcs:17, highDose:11, ocsOveruse:16,  repeatCourse:12, taperFailure:5,  relapse:4,  m7Rate:23.9 },
  { npi:'9109876532', name:'Dr. Barbara Young',        specialty:'Internal Medicine',account:'Intermountain Health',   territory:'Mountain West',   region:'West',    totalPatients:58,  ocsUse:40,  chronicOcs:14, highDose:9,  ocsOveruse:13,  repeatCourse:9,  taperFailure:4,  relapse:3,  m7Rate:22.4 },
  { npi:'1098765431', name:'Dr. Charles Hernandez',    specialty:'Gastroenterology', account:'Ochsner Health',         territory:'Southeast',       region:'South',   totalPatients:79,  ocsUse:54,  chronicOcs:18, highDose:11, ocsOveruse:17,  repeatCourse:13, taperFailure:5,  relapse:4,  m7Rate:21.5 },
  { npi:'2987654320', name:'Dr. Susan King',           specialty:'Gastroenterology', account:'Wellstar Health',        territory:'Southeast',       region:'South',   totalPatients:91,  ocsUse:61,  chronicOcs:19, highDose:12, ocsOveruse:18,  repeatCourse:13, taperFailure:5,  relapse:4,  m7Rate:19.8 },
  { npi:'3876543219', name:'Dr. Joseph Wright',        specialty:'Internal Medicine',account:'Banner University',      territory:'Southwest',       region:'South',   totalPatients:47,  ocsUse:31,  chronicOcs:9,  highDose:6,  ocsOveruse:9,   repeatCourse:6,  taperFailure:2,  relapse:2,  m7Rate:19.1 },
]

export const MOCK_HCP_ROWS: HcpAgg[] = RAW_HCP_ROWS.map(r => ({
  ...r,
  chronicOcsRate: r.totalPatients > 0 ? Math.round((r.chronicOcs / r.totalPatients) * 1000) / 10 : 0,
  highDoseRate: r.totalPatients > 0 ? Math.round((r.highDose / r.totalPatients) * 1000) / 10 : 0,
  repeatCourseRate: r.totalPatients > 0 ? Math.round((r.repeatCourse / r.totalPatients) * 1000) / 10 : 0,
}))

const RAW_ACCOUNT_ROWS = [
  { account:'Mass General Hospital',    territory:'Northeast',     region:'East',    totalPatients:612,  ocsUse:453,  chronicOcs:287, highDose:130, ocsOveruse:198, repeatCourse:164, taperFailure:80,  relapse:60,  m7Rate:32.4, topSpecialty:'Gastroenterology' },
  { account:'NYU Langone',              territory:'Mid-Atlantic',  region:'East',    totalPatients:843,  ocsUse:625,  chronicOcs:381, highDose:180, ocsOveruse:261, repeatCourse:214, taperFailure:110, relapse:82,  m7Rate:30.9, topSpecialty:'Gastroenterology' },
  { account:'Cleveland Clinic',         territory:'Midwest',       region:'Midwest', totalPatients:1204, ocsUse:892,  chronicOcs:521, highDose:256, ocsOveruse:354, repeatCourse:291, taperFailure:157, relapse:118, m7Rate:29.4, topSpecialty:'Gastroenterology' },
  { account:'Mayo Clinic',              territory:'Midwest',       region:'Midwest', totalPatients:987,  ocsUse:731,  chronicOcs:427, highDose:210, ocsOveruse:284, repeatCourse:238, taperFailure:129, relapse:96,  m7Rate:28.8, topSpecialty:'Gastroenterology' },
  { account:'UCSF Medical Center',      territory:'Pacific SW',    region:'West',    totalPatients:731,  ocsUse:542,  chronicOcs:312, highDose:156, ocsOveruse:204, repeatCourse:174, taperFailure:95,  relapse:72,  m7Rate:27.9, topSpecialty:'Gastroenterology' },
  { account:'Johns Hopkins',            territory:'Mid-Atlantic',  region:'East',    totalPatients:562,  ocsUse:416,  chronicOcs:238, highDose:120, ocsOveruse:152, repeatCourse:131, taperFailure:73,  relapse:55,  m7Rate:27.0, topSpecialty:'Internal Medicine' },
  { account:'Stanford Health',          territory:'Pacific SW',    region:'West',    totalPatients:489,  ocsUse:362,  chronicOcs:207, highDose:104, ocsOveruse:129, repeatCourse:114, taperFailure:64,  relapse:48,  m7Rate:26.4, topSpecialty:'Gastroenterology' },
  { account:'Northwestern Medicine',    territory:'Midwest',       region:'Midwest', totalPatients:678,  ocsUse:502,  chronicOcs:284, highDose:144, ocsOveruse:174, repeatCourse:156, taperFailure:88,  relapse:66,  m7Rate:25.7, topSpecialty:'Gastroenterology' },
  { account:'Emory Healthcare',         territory:'Southeast',     region:'South',   totalPatients:534,  ocsUse:396,  chronicOcs:222, highDose:114, ocsOveruse:134, repeatCourse:122, taperFailure:70,  relapse:52,  m7Rate:25.1, topSpecialty:'Gastroenterology' },
  { account:'Cedars-Sinai',             territory:'Pacific SW',    region:'West',    totalPatients:723,  ocsUse:536,  chronicOcs:298, highDose:154, ocsOveruse:177, repeatCourse:163, taperFailure:94,  relapse:71,  m7Rate:24.5, topSpecialty:'Gastroenterology' },
]

export const MOCK_ACCOUNT_ROWS: AccountAgg[] = RAW_ACCOUNT_ROWS.map(r => ({
  ...r,
  hcpCount: RAW_HCP_ROWS.filter(h => h.account === r.account).length || 1,
  chronicOcsRate: r.totalPatients > 0 ? Math.round((r.chronicOcs / r.totalPatients) * 1000) / 10 : 0,
  highDoseRate: r.totalPatients > 0 ? Math.round((r.highDose / r.totalPatients) * 1000) / 10 : 0,
  repeatCourseRate: r.totalPatients > 0 ? Math.round((r.repeatCourse / r.totalPatients) * 1000) / 10 : 0,
}))

const RAW_TERRITORY_ROWS = [
  { territory:'Northeast',     region:'East',    totalPatients:3842, ocsUse:2850, chronicOcs:1612, highDose:819, ocsOveruse:1324, repeatCourse:1114, taperFailure:502, relapse:376, m7Rate:34.5, hcpCount:187 },
  { territory:'Mid-Atlantic',  region:'East',    totalPatients:4127, ocsUse:3062, chronicOcs:1724, highDose:879, ocsOveruse:1381, repeatCourse:1197, taperFailure:539, relapse:404, m7Rate:33.5, hcpCount:203 },
  { territory:'Midwest',       region:'Midwest', totalPatients:5213, ocsUse:3868, chronicOcs:2178, highDose:1110, ocsOveruse:1694, repeatCourse:1512, taperFailure:681, relapse:511, m7Rate:32.5, hcpCount:248 },
  { territory:'Southeast',     region:'South',   totalPatients:4891, ocsUse:3627, chronicOcs:2012, highDose:1042, ocsOveruse:1467, repeatCourse:1419, taperFailure:639, relapse:479, m7Rate:30.0, hcpCount:231 },
  { territory:'Pacific SW',    region:'West',    totalPatients:3124, ocsUse:2318, chronicOcs:1287, highDose:666,  ocsOveruse:906,  repeatCourse:906,  taperFailure:408, relapse:306, m7Rate:29.0, hcpCount:149 },
  { territory:'Southwest',     region:'South',   totalPatients:1872, ocsUse:1388, chronicOcs:764,  highDose:399,  ocsOveruse:524,  repeatCourse:543,  taperFailure:244, relapse:183, m7Rate:28.0, hcpCount:89  },
  { territory:'Mountain West', region:'West',    totalPatients:984,  ocsUse:730,  chronicOcs:398,  highDose:210,  ocsOveruse:256,  repeatCourse:285,  taperFailure:128, relapse:96,  m7Rate:26.0, hcpCount:47  },
  { territory:'Pacific NW',    region:'West',    totalPatients:514,  ocsUse:381,  chronicOcs:213,  highDose:110,  ocsOveruse:151,  repeatCourse:149,  taperFailure:67,  relapse:50,  m7Rate:29.4, hcpCount:25  },
]

export const MOCK_TERRITORY_ROWS: TerritoryAgg[] = RAW_TERRITORY_ROWS.map(r => ({
  ...r,
  chronicOcsRate: r.totalPatients > 0 ? Math.round((r.chronicOcs / r.totalPatients) * 1000) / 10 : 0,
  highDoseRate: r.totalPatients > 0 ? Math.round((r.highDose / r.totalPatients) * 1000) / 10 : 0,
  repeatCourseRate: r.totalPatients > 0 ? Math.round((r.repeatCourse / r.totalPatients) * 1000) / 10 : 0,
}))

const RAW_DEMOGRAPHIC_ROWS = [
  { ageBand:'18–34', gender:'Female', totalPatients:1821, ocsUse:1350, chronicOcs:674,  highDose:388, ocsOveruse:419,  repeatCourse:492,  taperFailure:238, relapse:178, m7Rate:23.0 },
  { ageBand:'18–34', gender:'Male',   totalPatients:1634, ocsUse:1211, chronicOcs:589,  highDose:348, ocsOveruse:342,  repeatCourse:421,  taperFailure:213, relapse:160, m7Rate:20.9 },
  { ageBand:'35–49', gender:'Female', totalPatients:3912, ocsUse:2901, chronicOcs:1487, highDose:833, ocsOveruse:1017, repeatCourse:1082, taperFailure:511, relapse:383, m7Rate:26.0 },
  { ageBand:'35–49', gender:'Male',   totalPatients:3478, ocsUse:2580, chronicOcs:1312, highDose:741, ocsOveruse:869,  repeatCourse:942,  taperFailure:454, relapse:341, m7Rate:25.0 },
  { ageBand:'50–64', gender:'Female', totalPatients:4831, ocsUse:3582, chronicOcs:1981, highDose:1029, ocsOveruse:1997, repeatCourse:1441, taperFailure:631, relapse:473, m7Rate:41.3 },
  { ageBand:'50–64', gender:'Male',   totalPatients:4102, ocsUse:3044, chronicOcs:1658, highDose:874, ocsOveruse:1558, repeatCourse:1207, taperFailure:536, relapse:402, m7Rate:38.0 },
  { ageBand:'65+',   gender:'Female', totalPatients:2687, ocsUse:1993, chronicOcs:897,  highDose:572, ocsOveruse:347,  repeatCourse:639,  taperFailure:351, relapse:263, m7Rate:12.9 },
  { ageBand:'65+',   gender:'Male',   totalPatients:2102, ocsUse:1559, chronicOcs:693,  highDose:448, ocsOveruse:254,  repeatCourse:500,  taperFailure:274, relapse:206, m7Rate:12.1 },
]

export const MOCK_DEMOGRAPHIC_ROWS: DemographicAgg[] = RAW_DEMOGRAPHIC_ROWS.map(r => ({
  ...r,
  ageBand: r.ageBand as AgeBand,
  chronicOcsRate: r.totalPatients > 0 ? Math.round((r.chronicOcs / r.totalPatients) * 1000) / 10 : 0,
  highDoseRate: r.totalPatients > 0 ? Math.round((r.highDose / r.totalPatients) * 1000) / 10 : 0,
  repeatCourseRate: r.totalPatients > 0 ? Math.round((r.repeatCourse / r.totalPatients) * 1000) / 10 : 0,
}))

export const MOCK_DATA_DATE = 'June 28, 2025'
