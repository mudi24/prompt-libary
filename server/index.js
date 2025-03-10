const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

async function callDeepseekAPI(req, res) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function callDoubaAPI(req, res) {
  try {
    const response = await fetch('https://api.doubao.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function callChatGPTAPI(req, res) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        ...req.body,
        model: 'gpt-3.5-turbo'
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function callQianwenAPI(req, res) {
  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        ...req.body,
        model: 'Qwen/Qwen2.5-72B-Instruct',
        stream: false
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function callZhipuAPI(req, res) {
  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        ...req.body,
        model: 'Pro/THUDM/glm-4-9b-chat',
        stream: false
      })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const modelHandlers = {
  'doubao-chat': callDoubaAPI,
  'chatgpt': callChatGPTAPI,
  'Qwen/Qwen2.5-72B-Instruct': callQianwenAPI,
  'Pro/THUDM/glm-4-9b-chat': callZhipuAPI,
  'default': callDeepseekAPI
};

app.post('/api/chat', async (req, res) => {
  const { model } = req.body;
  const handler = modelHandlers[model] || modelHandlers.default;
  await handler(req, res);
});

app.listen(3001, () => {
  console.log('代理服务器运行在 3001 端口');
});