import { JobApplication, InterviewRecord } from './types'
import { STORAGE_KEY } from './data'

export const SAMPLE_DISMISSED_KEY='jobApplicationTracker.sampleDataDismissed.v1'
const date=(offset:number,base=new Date())=>{const d=new Date(base);d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d.toLocaleDateString('sv-SE')}
export const relativeDates=(base=new Date())=>({today:date(0,base),yesterday:date(-1,base),threeDaysAgo:date(-3,base),threeDaysLater:date(3,base),sevenDaysAgo:date(-7,base)})
const interview=(dates:ReturnType<typeof relativeDates>,retrospective=''):InterviewRecord=>({id:crypto.randomUUID(),interviewDate:dates.threeDaysAgo,stage:'一面',interviewer:'林小姐（虛構窗口）',questions:'請分享一次跨部門協作經驗。',answers:'以目標、分工與追蹤節點說明處理方式。',feeling:'溝通順暢，仍可把成果數字說得更明確。',nextPreparation:'整理兩個量化成果與反問問題。',retrospective,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()})
export function createSampleApplications(base=new Date()):JobApplication[]{const d=relativeDates(base),now=new Date().toISOString();const make=(n:number,companyName:string,jobTitle:string,status:JobApplication['status'],applicationChannel:string,resumeVersion:string,nextFollowUpDate='',records:InterviewRecord[]=[]):JobApplication=>({id:`sample-${n}-${crypto.randomUUID()}`,companyName,jobTitle,jobUrl:'',appliedDate:status==='收藏待投'?'':d.sevenDaysAgo,resumeVersion,applicationChannel,status,nextFollowUpDate,jdText:'此為虛構職缺的示範內容。',jdSummary:'示範如何整理職缺重點。',whyApply:'工作內容與目前求職方向相符。',matchedStrengths:'具備協作、溝通與執行經驗。',possibleGaps:'需補充產業案例與量化成果。',notes:'這是可自由編輯的範例資料。',interviewRecords:records,createdAt:now,updatedAt:now,isExample:true});return[
make(1,'北辰人才工作室','招募助理','已投遞','104','招募助理版',d.yesterday),
make(2,'灰盒數位','社群內容專員','已讀／履歷審查中','LinkedIn','內容企劃版',d.today),
make(3,'松果跨境商務','E-Commerce Operations Specialist','收到聯繫','公司官網','電商營運版',d.threeDaysLater),
make(4,'軌道專案研究室','Project Coordinator','面試安排中','Yourator','專案助理版',d.threeDaysLater,[interview(d)]),
make(5,'白河媒體','Social Media Specialist','一面完成','Cake','社群企劃版','',[interview(d,'回答案例完整，但應先講結論，再補背景與行動。')]),
make(6,'晨光顧問','Talent Sourcer','Offer','獵頭聯繫','招募助理版'),
make(7,'藍流工作室','內容營運助理','收藏待投','其他','內容企劃版'),
make(8,'遠岸服務科技','Customer Success Coordinator','未錄取','LinkedIn','客戶服務版')
]}
type LocalStorageLike=Pick<Storage,'getItem'|'setItem'>
export function initializeApplications(storage:LocalStorageLike=localStorage){const existing=storage.getItem(STORAGE_KEY);if(existing!==null){try{const value=JSON.parse(existing);return Array.isArray(value)?value:[]}catch{return[]}}if(storage.getItem(SAMPLE_DISMISSED_KEY)==='true')return[];const samples=createSampleApplications();storage.setItem(STORAGE_KEY,JSON.stringify(samples));return samples}
export function initializeState(storage:LocalStorageLike=localStorage):{applications:JobApplication[];readError:boolean}{const existing=storage.getItem(STORAGE_KEY);if(existing!==null){try{const value=JSON.parse(existing);return{applications:Array.isArray(value)?value:[],readError:!Array.isArray(value)}}catch{return{applications:[],readError:true}}}if(storage.getItem(SAMPLE_DISMISSED_KEY)==='true')return{applications:[],readError:false};const samples=createSampleApplications();try{storage.setItem(STORAGE_KEY,JSON.stringify(samples))}catch{return{applications:samples,readError:false}}return{applications:samples,readError:false}}
export function removeExamples(apps:JobApplication[],storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(SAMPLE_DISMISSED_KEY,'true');return apps.filter(a=>a.isExample!==true)}
export function markSamplesDismissed(storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(SAMPLE_DISMISSED_KEY,'true')}
export function resetTool(storage:Pick<Storage,'removeItem'>=localStorage){storage.removeItem(STORAGE_KEY);storage.removeItem(SAMPLE_DISMISSED_KEY)}
