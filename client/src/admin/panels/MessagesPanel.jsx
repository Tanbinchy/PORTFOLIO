import React, { useState, useEffect, useCallback } from 'react';
import { FiTrash2, FiCheckSquare, FiMail, FiInbox, FiRefreshCw } from 'react-icons/fi';
import API from '../../utils/api';

export default function MessagesPanel({ showToast, onCountChange }) {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all'); // all | unread | read
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/contact'); setMessages(data); }
    catch { showToast('Failed to load messages', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    try {
      await API.patch(`/contact/${id}/read`);
      setMessages(m => m.map(x => x._id === id ? { ...x, read: true } : x));
      onCountChange?.();
    } catch { showToast('Failed to mark as read', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/contact/${id}`);
      setMessages(m => m.filter(x => x._id !== id));
      if (expanded === id) setExpanded(null);
      showToast('Message deleted');
      onCountChange?.();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'read')   return m.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-300 text-xs font-bold">
                {unreadCount} unread
              </span>
            )}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">Contact form submissions from your portfolio</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-gray-400 glass border border-white/8 hover:text-white transition-all">
          <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''}/> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'all',    label: `All (${messages.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'read',   label: `Read (${messages.length - unreadCount})` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === tab.id ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white border border-indigo-500/25' : 'glass border border-white/8 text-gray-500 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-20 glass border border-white/8 rounded-2xl animate-pulse"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">{filter === 'unread' ? '📭' : '📬'}</div>
          <p className="text-gray-400">{filter === 'unread' ? 'No unread messages' : 'No messages yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => (
            <div key={msg._id}
              className={`glass border rounded-2xl overflow-hidden transition-all ${
                msg.read ? 'border-white/5 opacity-75' : 'border-indigo-500/20 bg-indigo-500/2'
              }`}>
              {/* Header */}
              <div
                className="flex items-start justify-between gap-3 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(expanded === msg._id ? null : msg._id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.read ? 'bg-white/5 text-gray-600' : 'bg-indigo-500/15 text-indigo-400'
                  }`}>
                    {msg.read ? <FiInbox size={15}/> : <FiMail size={15}/>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{msg.name}</span>
                      {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />}
                      <span className="text-gray-600 text-xs">{msg.email}</span>
                    </div>
                    <div className="text-indigo-300 text-xs font-medium truncate">Re: {msg.subject}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-600 text-xs hidden sm:block">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {!msg.read && (
                    <button
                      onClick={e => { e.stopPropagation(); handleMarkRead(msg._id); }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors">
                      <FiCheckSquare size={10}/> Read
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(msg._id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <FiTrash2 size={12}/>
                  </button>
                </div>
              </div>

              {/* Expanded message body */}
              {expanded === msg._id && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <p className="text-gray-400 text-sm leading-relaxed mt-3 whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg transition-all">
                      <FiMail size={12}/> Reply via Email
                    </a>
                    {!msg.read && (
                      <button onClick={() => handleMarkRead(msg._id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-indigo-300 glass border border-indigo-500/25 hover:bg-indigo-500/10 transition-all">
                        <FiCheckSquare size={12}/> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
