import { supabase } from './supabase';
import { PortfolioItem } from '../types';
import { DEFAULT_PORTFOLIOS } from '../data/defaultPortfolios';

/**
 * 콘텐츠 데이터 접근 계층.
 * 포트폴리오와 사이트 설정(로고/통계)을 Supabase 중앙 DB에 읽고 씁니다.
 * 읽기는 누구나 가능하고, 쓰기는 로그인한 관리자만 가능합니다(RLS 정책).
 */

// ===== 포트폴리오 =====

// 방문자/관리자 모두 호출. DB가 비어있으면 코드 기본값으로 폴백합니다.
export async function fetchPortfolios(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from('portfolios')
    .select('data, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[content] fetchPortfolios error:', error.message);
    return DEFAULT_PORTFOLIOS;
  }
  if (!data || data.length === 0) {
    return DEFAULT_PORTFOLIOS;
  }
  return data.map((row) => row.data as PortfolioItem);
}

// 관리자 전용: 현재 목록 전체를 DB에 반영(추가/수정/삭제/순서 모두 포함).
export async function replaceAllPortfolios(items: PortfolioItem[]): Promise<void> {
  const rows = items.map((item, index) => ({
    id: item.id,
    data: item,
    sort_order: index,
  }));

  // 1) 현재 DB에 있는 id 목록 조회
  const { data: existing, error: selErr } = await supabase
    .from('portfolios')
    .select('id');
  if (selErr) throw selErr;

  const keepIds = new Set(items.map((i) => i.id));
  const toDelete = (existing ?? [])
    .map((r) => r.id as string)
    .filter((id) => !keepIds.has(id));

  // 2) 현재 목록을 upsert(있으면 갱신, 없으면 추가)
  if (rows.length > 0) {
    const { error: upErr } = await supabase.from('portfolios').upsert(rows);
    if (upErr) throw upErr;
  }

  // 3) 목록에서 빠진 항목은 DB에서 삭제
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase
      .from('portfolios')
      .delete()
      .in('id', toDelete);
    if (delErr) throw delErr;
  }
}

// ===== 사이트 설정 (로고, 통계 수치) =====

export type SiteSettings = Record<string, string>;

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error || !data) {
    if (error) console.error('[content] fetchSettings error:', error.message);
    return {};
  }
  const out: SiteSettings = {};
  for (const row of data) {
    if (row.value != null) out[row.key as string] = row.value as string;
  }
  return out;
}

// 관리자 전용: 설정 값 저장. value가 null이면 해당 설정을 삭제(기본값으로 복원).
export async function saveSetting(key: string, value: string | null): Promise<void> {
  if (value === null) {
    const { error } = await supabase.from('site_settings').delete().eq('key', key);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value });
    if (error) throw error;
  }
}

// ===== 관리자 인증 (Supabase Auth) =====

export async function adminSignIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function adminSignOut() {
  return supabase.auth.signOut();
}

export async function getActiveSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
