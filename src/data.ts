import {JobApplication,ExportData,STATUSES} from './types'
export const STORAGE_KEY='jobApplicationTracker.v1'
export type ImportIssue='invalid-json'|'missing-fields'|'unsupported-schema'|'invalid-applications'|'invalid-record'
const replied=new Set(['收到聯繫','面試安排中','一面完成','二面以上','Offer','未錄取'])
const closed=new Set(['Offer','未錄取','自行放棄','無回覆結案'])
export function stats(a:JobApplication[]){const total=a.filter(x=>x.status!=='收藏待投').length;const responses=a.filter(x=>replied.has(x.status)).length;const interviews=a.filter(x=>x.interviewRecords.length>0).length;const offers=a.filter(x=>x.status==='Offer').length;return{total,responses,interviews,offers,responseRate:total?responses/total*100:0,interviewRate:total?interviews/total*100:0}}
export function today(){return new Date().toLocaleDateString('sv-SE')}
export function followState(a:JobApplication){if(!a.nextFollowUpDate||closed.has(a.status))return 0;return a.nextFollowUpDate<today()?2:a.nextFollowUpDate===today()?1:0}
export function load(storage:Pick<Storage,'getItem'>=localStorage):JobApplication[]{try{const v=JSON.parse(storage.getItem(STORAGE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
export function save(a:JobApplication[],storage:Pick<Storage,'setItem'>=localStorage){storage.setItem(STORAGE_KEY,JSON.stringify(a))}
export function validateImport(v:unknown):v is ExportData{if(!v||typeof v!=='object')return false;const x=v as any;return x.schemaVersion===1&&Array.isArray(x.applications)&&x.applications.every((a:any)=>a&&typeof a.id==='string'&&typeof a.companyName==='string'&&typeof a.jobTitle==='string'&&STATUSES.includes(a.status)&&Array.isArray(a.interviewRecords))}
export function inspectImportText(text:string):{data?:ExportData;issue?:ImportIssue}{let value:unknown;try{value=JSON.parse(text)}catch{return{issue:'invalid-json'}}if(!value||typeof value!=='object'||!('schemaVersion'in value)||!('applications'in value))return{issue:'missing-fields'};const x=value as any;if(x.schemaVersion!==1)return{issue:'unsupported-schema'};if(!Array.isArray(x.applications))return{issue:'invalid-applications'};if(!x.applications.every((a:any)=>a&&typeof a.id==='string'&&typeof a.companyName==='string'&&typeof a.jobTitle==='string'&&STATUSES.includes(a.status)&&Array.isArray(a.interviewRecords)))return{issue:'invalid-record'};return{data:x as ExportData}}
