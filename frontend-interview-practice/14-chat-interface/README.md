# Challenge 14: Chat Interface

**Time Limit:** 75 minutes
**Difficulty:** Advanced
**Tech:** React + Vite

## Requirements

Build a chat/messaging interface UI.

### Must Have
1. Display list of messages
2. Input field to send new messages
3. Messages show sender name, text, and timestamp
4. Different styling for own messages vs others
5. Auto-scroll to bottom when new message arrives
6. Press Enter to send
7. Disable send if input is empty
8. Clear input after sending
9. Show "typing..." indicator (simulated)
10. Message grouping by date

### Bonus (if time permits)
- User avatars
- Message reactions (emoji)
- Edit/delete messages
- Reply/quote message
- Image/file attachments
- User list sidebar
- Online/offline status
- Read receipts
- Search messages
- Emoji picker

## Mock Data

```javascript
const mockMessages = [
  {
    id: 1,
    sender: 'Alice',
    text: 'Hey, how are you?',
    timestamp: new Date('2024-01-13T10:30:00'),
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    text: 'I\'m good! Working on a project.',
    timestamp: new Date('2024-01-13T10:31:00'),
    isOwn: true
  },
  {
    id: 3,
    sender: 'Alice',
    text: 'Nice! What are you building?',
    timestamp: new Date('2024-01-13T10:32:00'),
    isOwn: false
  }
]
```

## Evaluation Criteria

- ✅ Messages display correctly
- ✅ Sending messages works
- ✅ Auto-scroll functions
- ✅ Visual distinction between senders
- ✅ Timestamps formatted nicely
- ✅ Clean, modern UI

## Key Concepts

- List rendering with keys
- Controlled form inputs
- Auto-scrolling (useRef + scrollIntoView)
- Date formatting
- Conditional styling
- State management

## Auto-scroll Implementation

```javascript
const messagesEndRef = useRef(null)

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

return (
  <div className="messages">
    {messages.map(msg => <Message key={msg.id} {...msg} />)}
    <div ref={messagesEndRef} />
  </div>
)
```

## Message Grouping by Date

```javascript
const groupMessagesByDate = (messages) => {
  const groups = {}
  messages.forEach(msg => {
    const date = formatDate(msg.timestamp)
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
  })
  return groups
}
```

## Timestamp Formatting

```javascript
const formatTimestamp = (date) => {
  const now = new Date()
  const msgDate = new Date(date)

  if (isToday(msgDate)) {
    return msgDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (isYesterday(msgDate)) {
    return 'Yesterday ' + msgDate.toLocaleTimeString(...)
  } else {
    return msgDate.toLocaleDateString(...)
  }
}
```

## Test Cases

1. Load page → shows existing messages
2. Type message and click send → appears at bottom
3. Press Enter → sends message
4. Send empty message → button disabled, nothing happens
5. Send message → input clears
6. Scroll up and send → auto-scrolls to new message
7. Messages from different senders have different styles
8. Timestamps display correctly
9. "Typing..." indicator appears (simulated)
10. Long messages wrap correctly

## UI Tips

- Use flexbox for message layout
- Align own messages to right, others to left
- Use subtle shadows and borders
- Color code message bubbles
- Fixed input at bottom
- Scrollable message area

```css
.message-own {
  align-self: flex-end;
  background: #007bff;
  color: white;
}

.message-other {
  align-self: flex-start;
  background: #e9ecef;
  color: #333;
}
```
