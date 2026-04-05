import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import RepairInfographic from '../components/analysis/RepairInfographic';
import ToolsList from '../components/analysis/ToolsList';
import MaterialsList from '../components/analysis/MaterialsList';
import ChatWindow from '../components/chat/ChatWindow';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';
import { sendChatMessage } from '../lib/api';
import type { ChatMessage } from '../types/chat';

export default function AnalysisPage() {
  const { analysisResult, chatMessages, addChatMessage } = useAppContext();
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = useCallback(async (text: string, images?: File[]) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);

    setIsChatLoading(true);
    try {
      const allMsgs = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(allMsgs, images);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
      };
      addChatMessage(aiMsg);
    } catch {
      addChatMessage({
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again.',
        timestamp: Date.now(),
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [chatMessages, addChatMessage]);

  if (!analysisResult) {
    return (
      <PageShell>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Yet</h2>
          <p className="text-gray-500 text-sm mb-6">Take a photo of a home problem to get started.</p>
          <Link to="/">
            <Button>Go to Camera</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          <RepairInfographic analysis={analysisResult} />
          <ToolsList tools={analysisResult.tools} />
          <MaterialsList materials={analysisResult.materials} />

          {/* Quick links */}
          <div className="flex gap-3">
            <Link to="/videos" className="flex-1">
              <Button variant="secondary" className="w-full">▶️ Watch Videos</Button>
            </Link>
            <Link to="/contractors" className="flex-1">
              <Button variant="secondary" className="w-full">👷 Find a Pro</Button>
            </Link>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-20">
            <ChatWindow
              messages={chatMessages}
              onSend={handleSendMessage}
              isLoading={isChatLoading}
              followUpQuestion={analysisResult.followUpQuestion}
            />
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
