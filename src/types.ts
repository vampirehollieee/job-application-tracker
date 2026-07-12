export const STATUSES = ['收藏待投','已投遞','已讀／履歷審查中','收到聯繫','面試安排中','一面完成','二面以上','Offer','未錄取','自行放棄','無回覆結案'] as const
export type ApplicationStatus = typeof STATUSES[number]
export const CHANNELS = ['104','LinkedIn','Yourator','Cake','公司官網','朋友介紹','獵頭聯繫','其他'] as const
export type InterviewRecord = {id:string;interviewDate:string;stage:string;interviewer:string;questions:string;answers:string;feeling:string;nextPreparation:string;retrospective:string;createdAt:string;updatedAt:string}
export type JobApplication = {id:string;companyName:string;jobTitle:string;jobUrl:string;appliedDate:string;resumeVersion:string;applicationChannel:string;status:ApplicationStatus;nextFollowUpDate:string;jdText:string;jdSummary:string;whyApply:string;matchedStrengths:string;possibleGaps:string;notes:string;interviewRecords:InterviewRecord[];createdAt:string;updatedAt:string;isExample?:boolean}
export type ExportData = {schemaVersion:1;exportedAt:string;applications:JobApplication[]}
