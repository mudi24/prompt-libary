import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 示例Prompt数据
const promptCategories = [
  { id: 'writing', name: '写作辅助' },
  { id: 'coding', name: '编程开发' },
  { id: 'creative', name: '创意生成' },
  { id: 'business', name: '商业应用' },
  { id: 'education', name: '教育学习' },
];

const promptExamples = [
  {
    id: '1',
    title: '结构化文章生成器',
    description: '生成包含引言、论点和结论的结构化文章',
    category: 'writing',
    prompt: '请以[主题]为中心，创作一篇结构完整的文章，包含以下部分：\n1. 引言：介绍主题背景和重要性\n2. 主体：至少3个论点，每个论点包含论据和例子\n3. 结论：总结要点并给出展望或建议\n请确保文章逻辑清晰，论点有力，语言流畅。',
    tags: ['文章', '写作', '结构化'],
    popularity: 95
  },
  {
    id: '2',
    title: 'React组件优化专家',
    description: '分析并优化React组件性能的提示词',
    category: 'coding',
    prompt: '请作为React性能优化专家，分析以下React组件代码：\n```jsx\n[粘贴您的React组件代码]\n```\n请提供以下优化建议：\n1. 识别可能的性能瓶颈\n2. 提出具体的优化方案（如使用useMemo、useCallback等）\n3. 重构代码示例\n4. 解释每项优化的原理和预期效果',
    tags: ['React', '性能优化', '前端开发'],
    popularity: 88
  },
  {
    id: '3',
    title: '创意故事生成器',
    description: '根据关键元素生成创意故事',
    category: 'creative',
    prompt: '请创作一个原创短篇故事，包含以下元素：\n- 主角：[描述]\n- 场景：[描述]\n- 冲突：[描述]\n- 主题：[描述]\n故事应当有清晰的开端、发展、高潮和结局，字数在800-1200字之间。请确保故事情节有创意，角色形象丰满，对话生动自然。',
    tags: ['故事', '创意写作', '叙事'],
    popularity: 92
  },
  {
    id: '4',
    title: '商业计划书框架',
    description: '生成商业计划书的详细框架',
    category: 'business',
    prompt: '请为[商业创意]创建一个详细的商业计划书框架，包含以下部分：\n1. 执行摘要\n2. 公司描述\n3. 市场分析\n4. 组织和管理结构\n5. 产品或服务线\n6. 营销和销售策略\n7. 财务预测\n8. 融资需求\n\n对于每个部分，请提供3-5个关键问题或要点，帮助我完善计划书内容。',
    tags: ['商业计划', '创业', '商业策略'],
    popularity: 85
  },
  {
    id: '5',
    title: '概念解析教程',
    description: '将复杂概念转化为易于理解的教程',
    category: 'education',
    prompt: '请将[复杂概念]转化为一个面向初学者的教程。要求：\n1. 使用简单明了的语言解释核心概念\n2. 提供日常生活中的类比或比喻\n3. 将概念分解为3-5个关键点\n4. 为每个关键点提供具体例子\n5. 包含一个互动练习或思考问题\n6. 总结学习要点并提供进阶学习建议',
    tags: ['教育', '学习', '概念解析'],
    popularity: 90
  },
];

export default function PromptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤提示词
  const filteredPrompts = promptExamples.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Prompt库</h1>
        <p className="text-lg text-gray-600">浏览精选的AI提示词案例，提升您的AI交互效果</p>
      </div>

      {/* 搜索和过滤 */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="搜索提示词..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="flex-shrink-0">
          <select
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">所有类别</option>
            {promptCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 提示词卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => {
          const category = promptCategories.find(c => c.id === prompt.category);
          return (
            <Link to={`/prompt/${prompt.id}`} key={prompt.id} className="block">
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{prompt.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {category?.name}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{prompt.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>热度: {prompt.popularity}%</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">没有找到匹配的提示词，请尝试其他搜索条件</p>
        </div>
      )}
    </div>
  );
}