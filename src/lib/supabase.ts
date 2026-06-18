import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 연결 정보.
// 아래 publishable 키는 "공개용" 키라 브라우저(프론트엔드)에 노출되어도 안전합니다.
// 실제 보안은 Supabase의 RLS(행 수준 보안) 정책으로 처리합니다.
const SUPABASE_URL = 'https://uemignrwuvmzecyhmebn.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_B28uKgIM9QXfExXV_Wi0Ag_QOk2J7KM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
