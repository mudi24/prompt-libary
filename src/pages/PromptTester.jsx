import React, { useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';

// 配置marked以使用highlight.js进行代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true
});

export default function PromptTester() {
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [model, setModel] = useState('deepseek-chat');  // 修改默认模型
  
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 模拟API调用
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // 格式化响应为Markdown格式
      const formattedResponse = `## AI响应

${aiResponse}

---

**使用的参数：**
- 模型：${model}
- 温度：${temperature}
- 最大令牌数：${maxTokens}`;

      setResponse(formattedResponse);
    } catch (err) {
      setError(err.message || '请求失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  // 将markdown转换为HTML
  const createMarkup = () => {
    return { __html: marked(response) };
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Prompt测试器</h1>
        <p className="text-lg text-gray-600">实时测试和调整Prompt，查看不同参数设置下的AI响应效果</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入区域 */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                输入Prompt
              </label>
              <textarea
                id="prompt"
                rows="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="在这里输入您的提示词..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">模型选择</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="deepseek-chat">Deepseek Chat</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                温度（创造性）: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="w-full"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>精确</span>
                <span>创造性</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大令牌数: {maxTokens}
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                className="w-full"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>简短</span>
                <span>详细</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </>
              ) : '生成响应'}
            </button>

            {error && (
              <div className="mt-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* 右侧：响应区域 */}
        <div>
          <div className="border border-gray-200 rounded-md bg-gray-50 p-4 h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI响应</h2>
            {response ? (
              <div className="prose max-w-none overflow-auto" dangerouslySetInnerHTML={createMarkup()} />
            ) : (
              <div className="text-gray-500 italic">
                AI响应将显示在这里...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">提示词编写技巧</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>明确指定您希望AI扮演的角色（例如："作为一名经验丰富的营销专家..."）</li>
          <li>提供清晰的上下文和背景信息</li>
          <li>使用结构化格式，如列表或步骤</li>
          <li>指定期望的输出格式（例如："请以表格形式回答"）</li>
          <li>调整温度参数：较低的值使输出更加确定和一致，较高的值使输出更加多样和创造性</li>
          <li>使用示例说明您期望的回答方式（少样本学习）</li>
        </ul>
      </div>
    </div>
  );
}