import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { apiLogger } from '@/app/lib/logger';

// 공공데이터포털 API 설정
const API_BASE_URL = 'https://apis.data.go.kr/B553077/api/open/sdsc2';
const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY;

if (!SERVICE_KEY) {
  throw new Error('DATA_GO_KR_SERVICE_KEY 환경변수가 필요합니다');
}

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
});

// 재시도 설정
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // 네트워크 오류, 5xx 오류, 429 (속도 제한) 재시도
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status ?? 0) >= 500 ||
      error.response?.status === 429
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    apiLogger.warn(
      {
        retryCount,
        url: requestConfig.url,
        error: error.message,
      },
      'API 요청 재시도'
    );
  },
});

// API 응답 타입
export interface BusinessAPIResponse {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    items: any[];
    numOfRows: number;
    pageNo: number;
    totalCount: number;
  };
}

/**
 * 날짜 기준 소상공인 정보 조회
 * @param date YYYYMMDD 형식
 * @param pageNo 페이지 번호
 * @param numOfRows 페이지당 레코드 수
 */
export async function fetchBusinessesByDate(
  date: string,
  pageNo: number = 1,
  numOfRows: number = 1000
): Promise<BusinessAPIResponse> {
  apiLogger.info({ date, pageNo, numOfRows }, '소상공인 데이터 조회 시작');

  try {
    const response = await apiClient.get('/storeListInDate', {
      params: {
        serviceKey: SERVICE_KEY,
        key: date,
        type: 'json',
        pageNo,
        numOfRows,
      },
    });

    apiLogger.info(
      {
        date,
        pageNo,
        totalItems: response.data.body?.totalCount || 0,
        returnedItems: response.data.body?.items?.length || 0,
      },
      '소상공인 데이터 조회 성공'
    );

    return response.data;
  } catch (error) {
    apiLogger.error(
      { date, error: error instanceof Error ? error.message : String(error) },
      '소상공인 데이터 조회 실패'
    );
    throw error;
  }
}

/**
 * 단일 상가업소 조회
 * @param bizesId 상가업소번호
 */
export async function fetchBusinessById(bizesId: string) {
  apiLogger.info({ bizesId }, '단일 상가업소 조회 시작');

  try {
    const response = await apiClient.get('/storeOne', {
      params: {
        serviceKey: SERVICE_KEY,
        key: bizesId,
        type: 'json',
      },
    });

    apiLogger.info({ bizesId }, '단일 상가업소 조회 성공');
    return response.data;
  } catch (error) {
    apiLogger.error(
      { bizesId, error: error instanceof Error ? error.message : String(error) },
      '단일 상가업소 조회 실패'
    );
    throw error;
  }
}

/**
 * API 헬스체크
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const testDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    await fetchBusinessesByDate(testDate, 1, 10);
    return true;
  } catch (error) {
    apiLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      'API 헬스체크 실패'
    );
    return false;
  }
}

export default {
  fetchBusinessesByDate,
  fetchBusinessById,
  checkAPIHealth,
};
