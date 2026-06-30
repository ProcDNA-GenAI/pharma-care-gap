import type { GlobalKpis, HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg } from '@/lib/types/insights'

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

export const MOCK_HCP_ROWS: HcpAgg[] = [
  { npi:'1234567890', name:'Dr. Aisha Williams',      specialty:'Gastroenterology', account:'Mass General Hospital',    territory:'Northeast',       region:'East',    totalPatients:142, ocsUse:118, chronicOcs:71, ocsOveruse:97,  repeatCourse:62, taperFailure:31, relapse:24, m7Rate:68.3 },
  { npi:'2345678901', name:'Dr. Robert Chen',          specialty:'Gastroenterology', account:'NYU Langone',             territory:'Mid-Atlantic',    region:'East',    totalPatients:128, ocsUse:104, chronicOcs:58, ocsOveruse:82,  repeatCourse:51, taperFailure:24, relapse:19, m7Rate:64.1 },
  { npi:'3456789012', name:'Dr. Maria Santos',         specialty:'Internal Medicine',account:'Cleveland Clinic',        territory:'Midwest',         region:'Midwest', totalPatients:89,  ocsUse:72,  chronicOcs:41, ocsOveruse:52,  repeatCourse:34, taperFailure:18, relapse:12, m7Rate:58.4 },
  { npi:'4567890123', name:'Dr. James Wilson',         specialty:'Gastroenterology', account:'Mayo Clinic',             territory:'Midwest',         region:'Midwest', totalPatients:167, ocsUse:139, chronicOcs:88, ocsOveruse:95,  repeatCourse:72, taperFailure:41, relapse:31, m7Rate:56.9 },
  { npi:'5678901234', name:'Dr. Priya Patel',          specialty:'Gastroenterology', account:'UCSF Medical Center',     territory:'Pacific SW',      region:'West',    totalPatients:112, ocsUse:91,  chronicOcs:49, ocsOveruse:61,  repeatCourse:44, taperFailure:20, relapse:16, m7Rate:54.5 },
  { npi:'6789012345', name:'Dr. Thomas Brown',         specialty:'Internal Medicine',account:'Johns Hopkins',           territory:'Mid-Atlantic',    region:'East',    totalPatients:78,  ocsUse:61,  chronicOcs:31, ocsOveruse:41,  repeatCourse:28, taperFailure:14, relapse:10, m7Rate:52.6 },
  { npi:'7890123456', name:'Dr. Sarah Johnson',        specialty:'Gastroenterology', account:'Stanford Health',         territory:'Pacific SW',      region:'West',    totalPatients:134, ocsUse:108, chronicOcs:62, ocsOveruse:69,  repeatCourse:53, taperFailure:27, relapse:20, m7Rate:51.5 },
  { npi:'8901234567', name:'Dr. Michael Kim',          specialty:'Gastroenterology', account:'Northwestern Medicine',   territory:'Midwest',         region:'Midwest', totalPatients:98,  ocsUse:79,  chronicOcs:44, ocsOveruse:48,  repeatCourse:37, taperFailure:19, relapse:14, m7Rate:49.0 },
  { npi:'9012345678', name:'Dr. Laura Martinez',       specialty:'Rheumatology',     account:"Brigham & Women's",      territory:'Northeast',       region:'East',    totalPatients:67,  ocsUse:52,  chronicOcs:27, ocsOveruse:31,  repeatCourse:22, taperFailure:11, relapse:8,  m7Rate:46.3 },
  { npi:'1098765432', name:'Dr. David Thompson',       specialty:'Internal Medicine',account:'Duke University Hospital',territory:'Southeast',       region:'South',   totalPatients:83,  ocsUse:65,  chronicOcs:34, ocsOveruse:37,  repeatCourse:27, taperFailure:13, relapse:9,  m7Rate:44.6 },
  { npi:'2109876543', name:'Dr. Emily Wang',           specialty:'Gastroenterology', account:'Cedars-Sinai',           territory:'Pacific SW',      region:'West',    totalPatients:119, ocsUse:94,  chronicOcs:51, ocsOveruse:52,  repeatCourse:41, taperFailure:21, relapse:15, m7Rate:43.7 },
  { npi:'3210987654', name:'Dr. Carlos Rodriguez',     specialty:'Gastroenterology', account:'UT Southwestern',        territory:'Southwest',       region:'South',   totalPatients:91,  ocsUse:71,  chronicOcs:37, ocsOveruse:39,  repeatCourse:30, taperFailure:15, relapse:11, m7Rate:42.9 },
  { npi:'4321098765', name:'Dr. Jennifer Lee',         specialty:'Internal Medicine',account:'Vanderbilt Medical',     territory:'Southeast',       region:'South',   totalPatients:74,  ocsUse:57,  chronicOcs:28, ocsOveruse:31,  repeatCourse:23, taperFailure:11, relapse:8,  m7Rate:41.9 },
  { npi:'5432109876', name:'Dr. Richard Davis',        specialty:'Gastroenterology', account:'OHSU',                   territory:'Pacific NW',      region:'West',    totalPatients:108, ocsUse:84,  chronicOcs:43, ocsOveruse:44,  repeatCourse:35, taperFailure:17, relapse:12, m7Rate:40.7 },
  { npi:'6543210987', name:'Dr. Amanda Taylor',        specialty:'Gastroenterology', account:'Emory Healthcare',       territory:'Southeast',       region:'South',   totalPatients:82,  ocsUse:63,  chronicOcs:31, ocsOveruse:33,  repeatCourse:25, taperFailure:12, relapse:9,  m7Rate:40.2 },
  { npi:'7654321098', name:'Dr. Kevin Anderson',       specialty:'Internal Medicine',account:'Penn Medicine',          territory:'Mid-Atlantic',    region:'East',    totalPatients:61,  ocsUse:46,  chronicOcs:21, ocsOveruse:24,  repeatCourse:18, taperFailure:8,  relapse:6,  m7Rate:39.3 },
  { npi:'8765432109', name:'Dr. Rachel Moore',         specialty:'Gastroenterology', account:'Scripps Health',         territory:'Pacific SW',      region:'West',    totalPatients:93,  ocsUse:71,  chronicOcs:35, ocsOveruse:36,  repeatCourse:28, taperFailure:13, relapse:9,  m7Rate:38.7 },
  { npi:'9876543210', name:'Dr. Steven Jackson',       specialty:'Gastroenterology', account:'IU Health',              territory:'Midwest',         region:'Midwest', totalPatients:87,  ocsUse:66,  chronicOcs:32, ocsOveruse:33,  repeatCourse:26, taperFailure:12, relapse:9,  m7Rate:37.9 },
  { npi:'1987654321', name:'Dr. Michelle White',       specialty:'Gastroenterology', account:'Baylor Scott & White',   territory:'Southwest',       region:'South',   totalPatients:76,  ocsUse:57,  chronicOcs:27, ocsOveruse:28,  repeatCourse:21, taperFailure:10, relapse:7,  m7Rate:36.8 },
  { npi:'2876543219', name:'Dr. Christopher Harris',   specialty:'Internal Medicine',account:'University of Michigan', territory:'Midwest',         region:'Midwest', totalPatients:64,  ocsUse:48,  chronicOcs:22, ocsOveruse:23,  repeatCourse:17, taperFailure:8,  relapse:6,  m7Rate:35.9 },
  { npi:'3765432198', name:'Dr. Nancy Clark',          specialty:'Gastroenterology', account:'MUSC Health',            territory:'Southeast',       region:'South',   totalPatients:98,  ocsUse:73,  chronicOcs:33, ocsOveruse:31,  repeatCourse:24, taperFailure:11, relapse:8,  m7Rate:31.6 },
  { npi:'4654321987', name:'Dr. Paul Lewis',           specialty:'Gastroenterology', account:'UCHealth',               territory:'Mountain West',   region:'West',    totalPatients:71,  ocsUse:52,  chronicOcs:22, ocsOveruse:21,  repeatCourse:16, taperFailure:7,  relapse:5,  m7Rate:29.6 },
  { npi:'5543210976', name:'Dr. Linda Robinson',       specialty:'Internal Medicine',account:'Banner Health',          territory:'Southwest',       region:'South',   totalPatients:52,  ocsUse:37,  chronicOcs:14, ocsOveruse:14,  repeatCourse:10, taperFailure:4,  relapse:3,  m7Rate:26.9 },
  { npi:'6432109865', name:'Dr. Mark Walker',          specialty:'Gastroenterology', account:'Sutter Health',          territory:'Pacific SW',      region:'West',    totalPatients:83,  ocsUse:60,  chronicOcs:24, ocsOveruse:22,  repeatCourse:17, taperFailure:7,  relapse:5,  m7Rate:26.5 },
  { npi:'7321098754', name:'Dr. Dorothy Hall',         specialty:'Rheumatology',     account:'Hartford HealthCare',    territory:'Northeast',       region:'East',    totalPatients:44,  ocsUse:31,  chronicOcs:11, ocsOveruse:11,  repeatCourse:8,  taperFailure:3,  relapse:2,  m7Rate:25.0 },
  { npi:'8210987643', name:'Dr. George Allen',         specialty:'Gastroenterology', account:'Prisma Health',          territory:'Southeast',       region:'South',   totalPatients:67,  ocsUse:47,  chronicOcs:17, ocsOveruse:16,  repeatCourse:12, taperFailure:5,  relapse:4,  m7Rate:23.9 },
  { npi:'9109876532', name:'Dr. Barbara Young',        specialty:'Internal Medicine',account:'Intermountain Health',   territory:'Mountain West',   region:'West',    totalPatients:58,  ocsUse:40,  chronicOcs:14, ocsOveruse:13,  repeatCourse:9,  taperFailure:4,  relapse:3,  m7Rate:22.4 },
  { npi:'1098765431', name:'Dr. Charles Hernandez',    specialty:'Gastroenterology', account:'Ochsner Health',         territory:'Southeast',       region:'South',   totalPatients:79,  ocsUse:54,  chronicOcs:18, ocsOveruse:17,  repeatCourse:13, taperFailure:5,  relapse:4,  m7Rate:21.5 },
  { npi:'2987654320', name:'Dr. Susan King',           specialty:'Gastroenterology', account:'Wellstar Health',        territory:'Southeast',       region:'South',   totalPatients:91,  ocsUse:61,  chronicOcs:19, ocsOveruse:18,  repeatCourse:13, taperFailure:5,  relapse:4,  m7Rate:19.8 },
  { npi:'3876543219', name:'Dr. Joseph Wright',        specialty:'Internal Medicine',account:'Banner University',      territory:'Southwest',       region:'South',   totalPatients:47,  ocsUse:31,  chronicOcs:9,  ocsOveruse:9,   repeatCourse:6,  taperFailure:2,  relapse:2,  m7Rate:19.1 },
]

export const MOCK_ACCOUNT_ROWS: AccountAgg[] = [
  { account:'Mass General Hospital',    territory:'Northeast',     region:'East',    totalPatients:612,  ocsOveruse:198, m7Rate:32.4, chronicOcs:287, repeatCourse:164, topSpecialty:'Gastroenterology' },
  { account:'NYU Langone',              territory:'Mid-Atlantic',  region:'East',    totalPatients:843,  ocsOveruse:261, m7Rate:30.9, chronicOcs:381, repeatCourse:214, topSpecialty:'Gastroenterology' },
  { account:'Cleveland Clinic',         territory:'Midwest',       region:'Midwest', totalPatients:1204, ocsOveruse:354, m7Rate:29.4, chronicOcs:521, repeatCourse:291, topSpecialty:'Gastroenterology' },
  { account:'Mayo Clinic',              territory:'Midwest',       region:'Midwest', totalPatients:987,  ocsOveruse:284, m7Rate:28.8, chronicOcs:427, repeatCourse:238, topSpecialty:'Gastroenterology' },
  { account:'UCSF Medical Center',      territory:'Pacific SW',    region:'West',    totalPatients:731,  ocsOveruse:204, m7Rate:27.9, chronicOcs:312, repeatCourse:174, topSpecialty:'Gastroenterology' },
  { account:'Johns Hopkins',            territory:'Mid-Atlantic',  region:'East',    totalPatients:562,  ocsOveruse:152, m7Rate:27.0, chronicOcs:238, repeatCourse:131, topSpecialty:'Internal Medicine' },
  { account:'Stanford Health',          territory:'Pacific SW',    region:'West',    totalPatients:489,  ocsOveruse:129, m7Rate:26.4, chronicOcs:207, repeatCourse:114, topSpecialty:'Gastroenterology' },
  { account:'Northwestern Medicine',    territory:'Midwest',       region:'Midwest', totalPatients:678,  ocsOveruse:174, m7Rate:25.7, chronicOcs:284, repeatCourse:156, topSpecialty:'Gastroenterology' },
  { account:'Emory Healthcare',         territory:'Southeast',     region:'South',   totalPatients:534,  ocsOveruse:134, m7Rate:25.1, chronicOcs:222, repeatCourse:122, topSpecialty:'Gastroenterology' },
  { account:'Cedars-Sinai',             territory:'Pacific SW',    region:'West',    totalPatients:723,  ocsOveruse:177, m7Rate:24.5, chronicOcs:298, repeatCourse:163, topSpecialty:'Gastroenterology' },
]

export const MOCK_TERRITORY_ROWS: TerritoryAgg[] = [
  { territory:'Northeast',     region:'East',    totalPatients:3842, ocsOveruse:1324, m7Rate:34.5, chronicOcs:1612, hcpCount:187 },
  { territory:'Mid-Atlantic',  region:'East',    totalPatients:4127, ocsOveruse:1381, m7Rate:33.5, chronicOcs:1724, hcpCount:203 },
  { territory:'Midwest',       region:'Midwest', totalPatients:5213, ocsOveruse:1694, m7Rate:32.5, chronicOcs:2178, hcpCount:248 },
  { territory:'Southeast',     region:'South',   totalPatients:4891, ocsOveruse:1467, m7Rate:30.0, chronicOcs:2012, hcpCount:231 },
  { territory:'Pacific SW',    region:'West',    totalPatients:3124, ocsOveruse:906,  m7Rate:29.0, chronicOcs:1287, hcpCount:149 },
  { territory:'Southwest',     region:'South',   totalPatients:1872, ocsOveruse:524,  m7Rate:28.0, chronicOcs:764,  hcpCount:89  },
  { territory:'Mountain West', region:'West',    totalPatients:984,  ocsOveruse:256,  m7Rate:26.0, chronicOcs:398,  hcpCount:47  },
  { territory:'Pacific NW',    region:'West',    totalPatients:514,  ocsOveruse:151,  m7Rate:29.4, chronicOcs:213,  hcpCount:25  },
]

export const MOCK_DEMOGRAPHIC_ROWS: DemographicAgg[] = [
  { ageBand:'18–34', gender:'Female', totalPatients:1821, ocsOveruse:419,  m7Rate:23.0, chronicOcs:674,  repeatCourse:492  },
  { ageBand:'18–34', gender:'Male',   totalPatients:1634, ocsOveruse:342,  m7Rate:20.9, chronicOcs:589,  repeatCourse:421  },
  { ageBand:'35–49', gender:'Female', totalPatients:3912, ocsOveruse:1017, m7Rate:26.0, chronicOcs:1487, repeatCourse:1082 },
  { ageBand:'35–49', gender:'Male',   totalPatients:3478, ocsOveruse:869,  m7Rate:25.0, chronicOcs:1312, repeatCourse:942  },
  { ageBand:'50–64', gender:'Female', totalPatients:4831, ocsOveruse:1997, m7Rate:41.3, chronicOcs:1981, repeatCourse:1441 },
  { ageBand:'50–64', gender:'Male',   totalPatients:4102, ocsOveruse:1558, m7Rate:38.0, chronicOcs:1658, repeatCourse:1207 },
  { ageBand:'65+',   gender:'Female', totalPatients:2687, ocsOveruse:347,  m7Rate:12.9, chronicOcs:897,  repeatCourse:639  },
  { ageBand:'65+',   gender:'Male',   totalPatients:2102, ocsOveruse:254,  m7Rate:12.1, chronicOcs:693,  repeatCourse:500  },
]

export const MOCK_DATA_DATE = 'June 28, 2025'
