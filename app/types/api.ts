// API 타입 정의 - 공공데이터포털 소상공인 상가(상권)정보 API

// API 응답 헤더
export interface APIResponseHeader {
  resultCode: string;
  resultMsg: string;
}

// 소상공인 정보
export interface BusinessItem {
  // 식별자
  bizesId: string; // 상가업소번호
  mgtNo: string; // 관리번호

  // 기본 정보
  bizesNm: string; // 상호명 (Business Name)
  lnoAdr: string; // 지번주소 (Lot Number Address)
  rdnmAdr: string; // 도로명주소 (Road Name Address)

  // 연락처
  mtel1no?: string; // 대표전화번호
  mtel2no?: string; // 대표전화번호2
  mtel3no?: string; // 대표전화번호3

  // 분류 정보
  indsLclsCd: string; // 대분류코드 (Large Category Code)
  indsLclsNm: string; // 대분류명 (Large Category Name)
  indsMclsCd: string; // 중분류코드 (Medium Category Code)
  indsMclsNm: string; // 중분류명 (Medium Category Name)
  indsSclsCd: string; // 소분류코드 (Small Category Code)
  indsSclsNm: string; // 소분류명 (Small Category Name)

  // 표준산업분류
  ksic: string; // 표준산업분류코드 (KSIC Code)
  ksicNm: string; // 표준산업분류명 (KSIC Name)

  // 지리 정보
  lon: string; // 경도 (Longitude)
  lat: string; // 위도 (Latitude)

  // 건물 정보
  bizesNmRoad: string; // 건물명
  rdnmWhlAddr: string; // 도로명전체주소

  // 상태
  trdStateNm: string; // 영업상태명
}

// API 응답 본문
export interface APIResponseBody {
  items: BusinessItem[];
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

// 전체 API 응답
export interface APIResponse {
  header: APIResponseHeader;
  body: APIResponseBody;
}

// API 요청 옵션
export interface FetchBusinessOptions {
  date: string; // YYYYMMDD 형식
  pageNo?: number;
  numOfRows?: number;
  type?: 'json' | 'xml';
}

// 분류 정보
export type Category = {
  code: string;
  name: string;
};

// 동기화 결과
export interface SyncResult {
  totalFetched: number;
  totalSynced: number;
  newRecords: number;
  updatedRecords: number;
  errors: number;
  duration: number; // milliseconds
}

// 상태 정보
export interface SyncStatus {
  id: string;
  dataSource: string;
  lastSyncedAt: Date;
  syncStatus: 'idle' | 'running' | 'success' | 'failed';
  errorMessage: string | null;
  syncCount: number;
  totalSynced: number;
  newRecordsCount: number;
}
