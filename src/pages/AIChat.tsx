import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Sparkles, BarChart3, Vote, Users } from 'lucide-react';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Ethra, your AI governance assistant. I can help you analyze DAOs, understand proposals, predict voting outcomes, and even deploy automated voting agents. What would you like to know?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString()
    },
    {
      id: 2,
      type: 'user',
      content: "Can you analyze the current DeFi Protocol DAO performance?",
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toLocaleTimeString()
    },
    {
      id: 3,
      type: 'bot',
      content: "Based on the latest data, DeFi Protocol DAO shows strong governance health:\n\n📊 **Key Metrics:**\n• Participation Rate: 76% (Above average)\n• Proposal Success Rate: 85%\n• Treasury Growth: +23% this quarter\n• Active Members: 1,547 (+12% MoM)\n\n🔍 **Analysis:**\nThe DAO demonstrates healthy engagement with consistent voting patterns. Recent treasury proposals show strong community alignment. I recommend monitoring the upcoming governance token upgrade proposal as it may impact future participation rates.\n\nWould you like me to create an automated voting agent for specific proposal types?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Call Mistral AI API
    setTimeout(async () => {
      try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer gIbR2wH2A4tsQl83hOp0TL0ty9Qyg1Bj',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [
              { role: 'system', content: 'You are Ethra, an AI governance assistant. Help with DAO analysis, proposals, voting predictions, and automated agents.' },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        const data = await response.json();
        const aiResponse = {
          id: messages.length + 2,
          type: 'bot' as const,
          content: data.choices[0].message.content,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        const errorResponse = {
          id: messages.length + 2,
          type: 'bot' as const,
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    }, 1000);
  };

  const quickActions = [
    { label: "Analyze DAO Performance", icon: BarChart3 },
    { label: "Predict Voting Outcome", icon: Vote },
    { label: "Deploy Voting Agent", icon: Bot },
    { label: "Member Analysis", icon: Users }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="cosmic-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                AI Capabilities
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/20">
                  <h3 className="font-medium text-sm">DAO Analysis</h3>
                  <p className="text-xs text-muted-foreground">Performance metrics and health scoring</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <h3 className="font-medium text-sm">Voting Prediction</h3>
                  <p className="text-xs text-muted-foreground">ML-powered outcome forecasting</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <h3 className="font-medium text-sm">Agent Deployment</h3>
                  <p className="text-xs text-muted-foreground">Automated voting strategies</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <h3 className="font-medium text-sm">Governance Insights</h3>
                  <p className="text-xs text-muted-foreground">Trends and pattern analysis</p>
                </div>
              </div>
            </Card>

            <Card className="cosmic-card p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-left"
                    onClick={() => setMessage(action.label)}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="cosmic-card h-[600px] flex flex-col">
              <div className="p-6 border-b border-border/40">
                <h1 className="text-2xl font-bold flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  Ethra
                </h1>
                <p className="text-muted-foreground">Get insights, analysis, and deploy automated agents</p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'bot' && <Bot className="w-4 h-4 text-primary" />}
                        <span className="text-sm font-medium">
                          {msg.type === 'bot' ? 'Ethra' : 'You'}
                        </span>
                        {msg.type === 'user' && <User className="w-4 h-4 text-accent" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted/40'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-border/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about DAO analytics, voting predictions, or agent deployment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()} className="glow">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    🔍 DAO Analysis
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    🤖 AI Agents
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    📊 Predictions
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChat;