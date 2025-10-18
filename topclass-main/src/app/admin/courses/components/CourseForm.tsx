import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Upload, X, Save, Plus, Minus } from 'lucide-react';

export interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  category: string;
  price: number; // 할인 후 가격
  original_price: number; // 할인 전 가격
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  tags: string[]; // text[]
  thumbnail_url: string; // 썸네일 이미지 URL
  detail_image_url: string; // 상세이미지, courses에 저장X
}

interface Props {
  mode: 'create' | 'edit';
  initialData?: CourseFormData;
  onSubmit: (form: CourseFormData) => void;
  loading?: boolean;
  onCancel: () => void;
}

export default function CourseForm({ mode, initialData, onSubmit, loading, onCancel }: Props) {
  const [form, setForm] = useState<CourseFormData>(
    initialData || {
      title: '',
      description: '',
      instructor: '',
      category: '무료강의',
      price: 0,
      original_price: 0,
      duration: 0,
      level: 'beginner',
      status: 'draft',
      is_featured: false,
      tags: [],
      thumbnail_url: '',
      detail_image_url: ''
    }
  );
  const [customCategory, setCustomCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData]);

  useEffect(() => {
    // 강의 수정 시(초기 데이터) customCategory 동기화
    if (form.category !== '기타') {
      setCustomCategory('');
    } else if (form.category === '기타' && initialData && initialData.category !== '기타') {
      setCustomCategory('');
    } else if (form.category === '기타' && initialData) {
      setCustomCategory(initialData.category);
    }
  }, [form.category, initialData]);

  const handleImageUpload = async (file: File, type: 'thumbnail' | 'detail') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.url) throw new Error(data.error || '이미지 업로드 실패');
      return data.url; // 업로드된 URL을 반환
    } catch (err: any) {
      setError(err?.message || '이미지 업로드 중 오류');
      return ''; // 오류 발생 시 빈 문자열 반환
    }
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === '기타') {
      setForm(prev => ({ ...prev, category: '기타' }));
      setCustomCategory('');
    } else {
      setForm(prev => ({ ...prev, category: value }));
      setCustomCategory('');
      if (value === '무료강의') {
        setForm(prev => ({ ...prev, price: 0, original_price: 0, is_featured: false }));
      } else {
        setForm(prev => ({ ...prev, is_featured: false }));
      }
    }
  };

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value);
    // 입력 중에도 유지하되, 제출 시 반영
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('강의명을 입력해주세요.');
    if (!form.description.trim()) return setError('강의 설명을 입력해주세요.');
    if (!form.instructor.trim()) return setError('강사명을 입력해주세요.');
    setError(null);
    // customCategory 입력이 있으면 카테고리에 반영
    const submitData = {
      ...form,
      category: (form.category === '기타' && customCategory) ? customCategory : form.category
    };
    onSubmit(submitData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-700">{error}</div>
      )}
      {/* 이미지 업로드 구역: 썸네일 왼쪽 / 상세 오른쪽 나란히, 안에서 flex */}
      <div className="rounded-xl border bg-white flex flex-row gap-8 items-start justify-center px-7 py-5 mb-8 max-w-2xl mx-auto">
        {/* 썸네일 */}
        <div className="flex-1 flex flex-col items-center">
          <label className="block mb-1 font-semibold">썸네일 이미지</label>
          {form.thumbnail_url && (
            <div className="mb-2 w-32 h-32 aspect-square rounded bg-gray-100 overflow-hidden flex items-center justify-center">
              <img src={form.thumbnail_url} className="object-cover w-full h-full" />
            </div>
          )}
          <label className="relative group cursor-pointer">
            <span className="inline-block px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all">
              썸네일 업로드
            </span>
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await handleImageUpload(file, 'thumbnail');
                  setForm((prev) => ({ ...prev, thumbnail_url: url }));
                }
              }} />
          </label>
        </div>
        {/* 상세이미지 */}
        <div className="flex-1 flex flex-col items-center">
          <label className="block mb-1 font-semibold">상세 이미지</label>
          {form.detail_image_url && (
            <div className="mb-2 w-32 h-32 aspect-square rounded bg-gray-100 overflow-hidden flex items-center justify-center">
              <img src={form.detail_image_url} className="object-cover w-full h-full" alt="상세이미지 미리보기" />
            </div>
          )}
          <label className="relative group cursor-pointer">
            <span className="inline-block px-3 py-2 rounded bg-green-50 text-green-700 border border-green-200 group-hover:bg-green-600 group-hover:text-white transition-all">
              상세 이미지 업로드
            </span>
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log('📤 상세이미지 업로드 시작:', file.name);
                  const url = await handleImageUpload(file, 'detail');
                  console.log('📦 상세이미지 업로드 결과:', url);
                  if (url) {
                    setForm((prev) => ({ ...prev, detail_image_url: url }));
                    console.log('✅ 상세이미지 상태 업데이트 완료');
                  } else {
                    console.error('❌ 상세이미지 업로드 실패 - URL이 없음');
                  }
                }
              }} />
          </label>
        </div>
      </div>
      {/* 기본 정보 */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div>
          <label className="block font-medium mb-1">강의명</label>
          <input type="text" value={form.title ?? ""} onChange={e => handleInputChange('title', e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">강의 설명</label>
          <textarea value={form.description ?? ""} onChange={e => handleInputChange('description', e.target.value)} rows={3} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">강사명</label>
          <input type="text" value={form.instructor ?? ""} onChange={e => handleInputChange('instructor', e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">카테고리</label>
          <select value={form.category === '기타' ? '기타' : form.category} onChange={e => handleCategoryChange(e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="무료강의">무료강의</option>
            <option value="프로그래밍">프로그래밍</option>
            <option value="디자인">디자인</option>
            <option value="마케팅">마케팅</option>
            <option value="비즈니스">비즈니스</option>
            <option value="기타">기타</option>
          </select>
          {form.category === '기타' && (
            <input type="text" value={customCategory} onChange={e => handleCustomCategoryChange(e.target.value)} className="mt-2 w-full px-3 py-2 border rounded" placeholder="카테고리 직접 입력" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">수강 시간(분)</label>
            <input type="number" value={form.duration ?? 0} onChange={e => handleInputChange('duration', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded" placeholder="0" min="0" />
          </div>
          <div>
            <label className="block font-medium mb-1">레벨</label>
            <select value={form.level} onChange={e => handleInputChange('level', e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">고급</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">상태</label>
            <select value={form.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="published">공개</option>
              <option value="draft">초안</option>
              <option value="archived">보관</option>
            </select>
          </div>
          <div className="flex items-center mt-7">
            <input type="checkbox" id="is_featured" checked={!!form.is_featured} onChange={e => handleInputChange('is_featured', e.target.checked)} className="h-4 w-4 m-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">추천 강의로 설정</label>
          </div>
        </div>
        {/* 가격: 할인 전(original_price), 후(price) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">할인 전 가격 (original_price)</label>
            <input type="number" value={form.original_price ?? 0} onChange={e => handleInputChange('original_price', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded" placeholder="0" min="0" disabled={form.category === '무료강의'} />
            {form.original_price > 0 && <div className="text-xs text-gray-500">{formatCurrency(form.original_price)}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">할인 후 가격 (price)</label>
            <input type="number" value={form.price ?? 0} onChange={e => handleInputChange('price', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded" placeholder="0" min="0" disabled={form.category === '무료강의'} />
            {form.price > 0 && <div className="text-xs text-gray-500">{formatCurrency(form.price)}</div>}
          </div>
        </div>
        {/* 태그: 배열(text[], string[]) 편집 */}
        <div>
          <label className="block font-medium mb-1">태그 (tags)</label>
          <div className="flex gap-2 mb-1">
            <input type="text" value={newTag ?? ""} onChange={e => setNewTag(e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="태그 입력" />
            <button type="button" onClick={handleAddTag} className="px-2 py-1 bg-blue-600 text-white rounded text-sm"><Plus className="inline w-3 h-3" /></button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center bg-gray-200 px-2 py-0.5 rounded text-sm">
                {tag}
                <button type="button" className="ml-1 text-gray-600 hover:text-red-500" onClick={() => handleRemoveTag(tag)}><Minus className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200">취소</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white flex items-center disabled:opacity-50" disabled={!!loading}>
          <Save className="w-4 h-4 mr-1" /> {mode === 'edit' ? '저장' : '생성'}
        </button>
      </div>
    </form>
  );
}
