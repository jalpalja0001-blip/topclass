import { test, expect } from '@playwright/test';

test.describe('리뷰노트 사이트 테스트', () => {
  
  test('메인 페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    // 리뷰노트 메인 페이지 방문
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/리뷰노트/);
    
    // 메인 로고 확인
    await expect(page.locator('header')).toBeVisible();
  });

  test('네비게이션 메뉴 요소들이 존재하는지 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 메인 네비게이션 메뉴들 확인
    await expect(page.getByText('체험단 검색')).toBeVisible();
    await expect(page.getByText('커뮤니티')).toBeVisible();
    await expect(page.getByText('Q&A')).toBeVisible();
    await expect(page.getByText('이용가이드')).toBeVisible();
    await expect(page.getByText('로그인')).toBeVisible();
  });

  test('프리미엄 체험단 섹션이 표시되는지 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 프리미엄 체험단 섹션 확인
    await expect(page.getByText('프리미엄 체험단')).toBeVisible();
    await expect(page.getByText('더보기')).toBeVisible();
    
    // 체험단 카드들이 로드되는지 확인 (최소 1개 이상)
    const premiumCards = page.locator('[data-testid="premium-card"], .premium-item, .card').first();
    await expect(premiumCards).toBeVisible({ timeout: 10000 });
  });

  test('인기 체험단 섹션이 표시되는지 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 인기 체험단 섹션 확인
    await expect(page.getByText('인기 체험단')).toBeVisible();
    
    // 신청자 수 정보가 표시되는지 확인
    const applicationInfo = page.locator('text=/신청 \\d+/').first();
    await expect(applicationInfo).toBeVisible({ timeout: 5000 });
  });

  test('마감 임박 체험단 섹션 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 마감 임박 체험단 섹션 확인
    await expect(page.getByText('마감 임박 체험단')).toBeVisible();
    
    // "오늘 선정 마감" 텍스트가 있는지 확인
    const todayDeadline = page.locator('text=/오늘 선정 마감/').first();
    await expect(todayDeadline).toBeVisible({ timeout: 5000 });
  });

  test('신규 체험단 섹션 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 신규 체험단 섹션 확인
    await expect(page.getByText('신규 체험단')).toBeVisible();
  });

  test('체험단 카드의 기본 정보 요소들 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    
    // 체험단 카드에서 기본 정보들이 표시되는지 확인
    // 일수 정보 (예: "11 일 남음")
    const daysLeft = page.locator('text=/\\d+ 일 남음/').first();
    await expect(daysLeft).toBeVisible({ timeout: 10000 });
    
    // 신청자 수 정보 (예: "신청 7265 / 1")
    const applicationCount = page.locator('text=/신청 \\d+/').first();
    await expect(applicationCount).toBeVisible({ timeout: 5000 });
    
    // 포인트 정보 (예: "0 P", "700,000 P")
    const pointInfo = page.locator('text=/\\d+ P/').first();
    await expect(pointInfo).toBeVisible({ timeout: 5000 });
  });

  test('푸터 정보 확인', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 푸터까지 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 회사 정보 확인
    await expect(page.getByText('주식회사 리뷰노트')).toBeVisible();
    await expect(page.getByText('대표 : 김환수')).toBeVisible();
    await expect(page.getByText('고객센터')).toBeVisible();
    await expect(page.getByText('1877-2163')).toBeVisible();
  });

  test('반응형 디자인 확인 (모바일 뷰)', async ({ page }) => {
    // 모바일 화면 크기로 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 모바일에서도 주요 요소들이 표시되는지 확인
    await expect(page.getByText('체험단 검색')).toBeVisible();
    await expect(page.getByText('프리미엄 체험단')).toBeVisible();
    await expect(page.getByText('인기 체험단')).toBeVisible();
  });

  test('페이지 로딩 성능 확인', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://www.reviewnote.co.kr/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 페이지 로딩이 10초 이내에 완료되는지 확인
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`페이지 로딩 시간: ${loadTime}ms`);
  });

  test('체험단 검색 기능 테스트', async ({ page }) => {
    await page.goto('https://www.reviewnote.co.kr/');
    
    // 체험단 검색 버튼 클릭
    await page.getByText('체험단 검색').click();
    
    // 검색 페이지로 이동했는지 확인 (URL 변경 또는 새로운 컨텐츠 확인)
    // 실제 사이트 구조에 따라 조정 필요
    await page.waitForTimeout(2000);
    
    // 현재 URL 확인
    const currentUrl = page.url();
    console.log(`현재 URL: ${currentUrl}`);
  });

});


