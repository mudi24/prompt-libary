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
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);

  const handleUseOptimizedPrompt = () => {
    if (optimizedPrompt) {
      setPrompt(optimizedPrompt);
    }
  };

  const handleOptimizeClick = async () => {
    if (!prompt.trim()) {
      setError('请先输入提示词');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: 'user',
            content: `作为一名提示词优化专家，请分析以下提示词并给出优化建议：

${prompt}

请从以下几个方面进行分析和优化：
1. 提示词的完整性和结构性
2. 角色定义是否清晰
3. 任务描述是否明确
4. 约束条件是否充分
5. 输出要求是否具体
6. 语言风格是否合适

请给出：
1. 总体评分（满分100分）和评价
2. 具体的改进建议
3. 优化后的提示词版本`
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // 提取优化后的提示词
      const optimizedPromptMatch = aiResponse.match(/优化后的提示词[：:]\s*([\s\S]+?)(?=\n\n|$)/i);
      const extractedOptimizedPrompt = optimizedPromptMatch ? optimizedPromptMatch[1].trim() : null;
      if (extractedOptimizedPrompt) {
        setOptimizedPrompt(extractedOptimizedPrompt);
      }

      setResponse(`## 提示词优化建议

${aiResponse}

---
**原始提示词：**
${prompt}`);
    } catch (err) {
      setError(err.message || '优化请求失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请先输入提示词');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      setResponse(data.choices[0].message.content);
    } catch (err) {
      setError(err.message || 'API请求失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleOptimizeClick}
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  优化提示词
                </button>
                {optimizedPrompt && (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleUseOptimizedPrompt}
                  >
                    使用优化后的提示词
                  </button>
                )}
              </div>
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
        
        {/* 角色定义技巧 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">1. 角色定义</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>明确指定AI扮演的专业角色（如："作为一名资深软件架构师..."）</li>
            <li>提供角色的背景和专业领域（如："拥有10年金融科技经验..."）</li>
            <li>设定角色的行为方式（如："请以严谨的学术风格回答..."）</li>
          </ul>
        </div>

        {/* 任务描述技巧 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">2. 任务描述</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>使用清晰的任务动词（分析、评估、比较、总结等）</li>
            <li>提供具体的上下文和背景信息</li>
            <li>分步骤描述复杂任务（如："第一步...第二步..."）</li>
            <li>指定任务的目标受众（如："面向非技术人员的解释..."）</li>
          </ul>
        </div>

        {/* 约束条件技巧 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">3. 约束条件</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>设定输出的长度限制（如："不超过500字"）</li>
            <li>指定专业度级别（如："使用通俗易懂的语言"或"使用专业术语"）</li>
            <li>明确格式要求（如："使用markdown格式"）</li>
            <li>设定语言风格（如："正式学术风格"或"轻松对话风格"）</li>
          </ul>
        </div>

        {/* 输出结构技巧 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">4. 输出结构</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>使用结构化格式（列表、表格、大纲等）</li>
            <li>要求特定的章节划分（如："包含背景、分析、建议三个部分"）</li>
            <li>设定关键点数量（如："列出5个最重要的因素"）</li>
            <li>要求具体的例子或案例说明</li>
          </ul>
        </div>

        {/* 迭代优化技巧 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">5. 迭代优化</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>使用温度参数调整创造性（较低值获得确定性答案，较高值获得创造性答案）</li>
            <li>通过示例说明期望的输出（少样本学习）</li>
            <li>要求AI解释其推理过程</li>
            <li>分步骤验证和改进输出结果</li>
          </ul>
        </div>

        {/* 高级技巧 */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">6. 高级技巧</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>使用"让我们一步一步思考"等提示词引导AI逐步推理</li>
            <li>设置角色扮演场景（如："假设我们在进行代码审查..."）</li>
            <li>使用评估标准（如："请基于可读性、性能、安全性进行评估"）</li>
            <li>要求多角度分析（如："从技术和商业两个角度分析"）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}