import React from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';

// 从 PromptLibrary 组件中导入示例数据
const promptExamples = [
  {
    id: '1',
    title: '结构化文章生成器',
    description: '生成包含引言、论点和结论的结构化文章',
    category: 'writing',
    prompt: '请以[主题]为中心，创作一篇结构完整的文章，包含以下部分：\n1. 引言：介绍主题背景和重要性\n2. 主体：至少3个论点，每个论点包含论据和例子\n3. 结论：总结要点并给出展望或建议\n请确保文章逻辑清晰，论点有力，语言流畅。',
    tags: ['文章', '写作', '结构化'],
    popularity: 95,
    usage: {
      instructions: [
        '将[主题]替换为您想要写作的具体主题',
        '可以根据需要调整论点数量',
        '可以指定具体的字数要求',
        '可以添加特定的写作风格要求'
      ],
      examples: [
        {
          input: '请以"人工智能对未来工作的影响"为主题，创作一篇结构完整的文章...',
          output: '人工智能正在深刻改变着我们的工作方式...（示例输出）'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'React组件优化专家',
    description: '分析并优化React组件性能的提示词',
    category: 'coding',
    prompt: '请作为React性能优化专家，分析以下React组件代码：\n```jsx\n[粘贴您的React组件代码]\n```\n请提供以下优化建议：\n1. 识别可能的性能瓶颈\n2. 提出具体的优化方案（如使用useMemo、useCallback等）\n3. 重构代码示例\n4. 解释每项优化的原理和预期效果',
    tags: ['React', '性能优化', '前端开发'],
    popularity: 88,
    usage: {
      instructions: [
        '将示例代码替换为需要优化的组件代码',
        '可以指定特定的性能问题关注点',
        '可以要求特定的优化技术',
        '可以设定性能提升目标'
      ],
      examples: [
        {
          input: '请分析这个购物车组件的性能问题...',
          output: '经分析，该组件存在以下性能问题...'
        }
      ]
    }
  },
  {
    id: '3',
    title: '创意故事生成器',
    description: '根据关键元素生成创意故事',
    category: 'creative',
    prompt: '请创作一个原创短篇故事，包含以下元素：\n- 主角：[描述]\n- 场景：[描述]\n- 冲突：[描述]\n- 主题：[描述]\n故事应当有清晰的开端、发展、高潮和结局，字数在800-1200字之间。请确保故事情节有创意，角色形象丰满，对话生动自然。',
    tags: ['故事', '创意写作', '叙事'],
    popularity: 92,
    usage: {
      instructions: [
        '详细描述每个故事元素',
        '可以指定特定的写作风格',
        '可以设定具体的情节要求',
        '可以添加特定的主题元素'
      ],
      examples: [
        {
          input: '请创作一个科幻故事，主角是一位时间旅行者...',
          output: '在2150年的一个寒冷清晨...'
        }
      ]
    }
  },
  {
    id: '4',
    title: '商业计划书框架',
    description: '生成商业计划书的详细框架',
    category: 'business',
    prompt: '请为[商业创意]创建一个详细的商业计划书框架，包含以下部分：\n1. 执行摘要\n2. 公司描述\n3. 市场分析\n4. 组织和管理结构\n5. 产品或服务线\n6. 营销和销售策略\n7. 财务预测\n8. 融资需求\n\n对于每个部分，请提供3-5个关键问题或要点，帮助我完善计划书内容。',
    tags: ['商业计划', '创业', '商业策略'],
    popularity: 85,
    usage: {
      instructions: [
        '明确说明商业创意的具体领域',
        '可以强调特定的商业模式',
        '可以指定目标市场',
        '可以设定具体的财务目标'
      ],
      examples: [
        {
          input: '请为一个线上教育平台制定商业计划书...',
          output: '执行摘要：我们的线上教育平台旨在...'
        }
      ]
    }
  },
  {
    id: '5',
    title: '概念解析教程',
    description: '将复杂概念转化为易于理解的教程',
    category: 'education',
    prompt: '请将[复杂概念]转化为一个面向初学者的教程。要求：\n1. 使用简单明了的语言解释核心概念\n2. 提供日常生活中的类比或比喻\n3. 将概念分解为3-5个关键点\n4. 为每个关键点提供具体例子\n5. 包含一个互动练习或思考问题\n6. 总结学习要点并提供进阶学习建议',
    tags: ['教育', '学习', '概念解析'],
    popularity: 90,
    usage: {
      instructions: [
        '指定需要解析的具体概念',
        '可以设定目标受众的知识水平',
        '可以要求特定的教学方法',
        '可以添加特定的练习类型'
      ],
      examples: [
        {
          input: '请将"量子纠缠"的概念转化为通俗易懂的教程...',
          output: '想象两个始终保持同步的魔法气球...'
        }
      ]
    }
  }
];

export default function PromptDetail() {
  const { id } = useParams();
  const prompt = promptExamples.find(p => p.id === id);

  if (!prompt) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">提示词未找到</h1>
          <p className="text-gray-600">抱歉，您请求的提示词不存在。</p>
        </div>
      </div>
    );
  }

  // 将提示词内容转换为HTML（支持Markdown格式）
  const createMarkup = (content) => {
    return { __html: marked(content) };
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题和描述 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{prompt.title}</h1>
          <p className="text-lg text-gray-600">{prompt.description}</p>
        </div>

        {/* 标签和热度 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center text-gray-500">
            <svg
              className="h-5 w-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>热度: {prompt.popularity}%</span>
          </div>
        </div>

        {/* 提示词内容 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">提示词内容</h2>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {prompt.prompt}
            </pre>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            {prompt.usage.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {/* 使用示例 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">使用示例</h2>
          {prompt.usage.examples.map((example, index) => (
            <div key={index} className="mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">输入：</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800">{example.input}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">输出：</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={createMarkup(example.output)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 使用建议 */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">使用建议</h2>
          <ul className="list-disc pl-5 space-y-2 text-blue-800">
            <li>根据具体场景调整提示词中的参数和要求</li>
            <li>可以结合多个提示词，创建更复杂的指令</li>
            <li>注意保持提示词的清晰性和具体性</li>
            <li>建议先在小规模场景测试效果</li>
          </ul>
        </div>
      </div>
    </div>
  );
}