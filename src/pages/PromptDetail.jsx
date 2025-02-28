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
  // ... 其他示例数据
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