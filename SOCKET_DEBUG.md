# Socket.IO Real-Time Feature - Debugging Guide

## Current Status: IMPLEMENTED but NEEDS DEBUGGING

## What Should Be Working RIGHT NOW:

### Backend ✅
- Socket.IO server initialization
- JWT authentication for socket connections
- Room-based architecture (admin, stock-manager, accountant rooms)
- Event emissions in services:
  - Stock added/deducted → `stock:added`, `stock:deducted`
  - Invoice created → `invoice:created`
  - Collection received → `collection:created`
  - User created → `user:created`

### Frontend ✅
- Socket client with auto-reconnect
- Event listeners for all events
- Toast notifications
- Live connection indicator
- Socket initialization in DashboardLayout

## What SHOULD Happen:

### When Admin Adds Stock:
1. Backend: Stock saved to database
2. Backend: Socket emits `stock:added` event to `role:admin` and `role:stock-manager` rooms
3. Frontend: Admin receives event, shows toast notification
4. Frontend: Stock page auto-refreshes if open
5. Frontend: Product page auto-refreshes if open

### Roles & Events:
| Role | Room Name | Events They Receive |
|------|-----------|-------------------|
| Admin | `role:admin` | Stock, Invoice, Collection, User, Expense events |
| Stock Manager | `role:stock-manager` | Stock added/deducted/low events |
| Accountant | `role:accountant` | Invoice, Collection, Expense events |

## DEBUGGING CHECKLIST:

### Step 1: Check Backend Console
```bash
# Look for these messages when backend starts:
📡 Socket.IO server initialized

# When stock is added:
📤 Socket: Emitting to roles [admin, stock-manager]: stock:added
📤 Socket: Emitting to role admin (role:admin): stock:added
📤 Socket: Emitting to role stock-manager (role:stock-manager): stock:added
```

### Step 2: Check Frontend Console
```bash
# When socket connects:
🔌 [Socket Client] Initializing socket connection to: http://localhost:5000
✅ [Socket Client] Socket connected successfully

# When stock added event received:
📥 [Socket Handlers] Received STOCK_ADDED event: { productId: '...', ... }
```

### Step 3: Check LiveIndicator
- Should show "Live" with green dot when connected
- "Offline" with red dot if not connected

### Step 4: Verify Socket Connection
Open browser DevTools → Network tab → WS tab:
- Should see a WebSocket connection to `ws://localhost:5000/socket.io/`

## COMMON ISSUES & SOLUTIONS:

### Issue 1: Socket Not Connecting
**Symptoms**: LiveIndicator shows "Offline"
**Solution**: 
1. Check if backend is running
2. Check API URL in frontend .env: `VITE_API_BASE_URL=http://localhost:5000/api/v1`
3. Check browser console for connection errors

### Issue 2: No Events Received
**Symptoms**: Socket connects but no notifications
**Solution**:
1. Check backend console - are emits being called?
2. Check if user is in correct room (based on role)
3. Check if event names match between frontend and backend

### Issue 3: Role Not Matching
**Symptoms**: Some roles don't receive events
**Solution**:
- Backend roles: `admin`, `stock-manager`, `accountant`
- Socket rooms: `role:admin`, `role:stock-manager`, `role:accountant`
- Make sure role names match exactly!

### Issue 4: Frontend Not Refreshing
**Symptoms**: Toast shows but data doesn't update
**Solution**:
- Custom event dispatched but components not listening
- Need to add event listeners in components to refresh data

## TESTING STEPS:

1. **Start Backend**:
```bash
cd backend
yarn start:dev
# Should see: 📡 Socket.IO server initialized
```

2. **Start Frontend**:
```bash
cd frontend
yarn dev
```

3. **Login as Admin**:
- Go to http://localhost:5173/login
- Login with admin credentials

4. **Add Stock**:
- Go to Stock page
- Add stock for a product
- **Expected**: Toast notification "Stock Added: X units of ProductName"

5. **Check Browser Console**:
- Should see: `📥 [Socket Handlers] Received STOCK_ADDED event`

6. **Check Backend Console**:
- Should see: `📤 Socket: Emitting to roles [admin, stock-manager]: stock:added`

## NEXT STEPS IF STILL NOT WORKING:

1. **Add Breakpoint Logging**: Check if `emitToRoles` is actually being called
2. **Verify Room Joining**: Check if client joins correct room on connection
3. **Test Event Names**: Make sure `SERVER_EVENTS.STOCK_ADDED` matches `'stock:added'`
4. **Check Network Tab**: See if WebSocket frames contain the events

## FILES TO CHECK IF ISSUES PERSIST:

```
Backend:
- src/server.ts (socket initialization)
- src/app/socket/index.ts (emit functions)
- src/app/socket/handlers.ts (room joining)
- src/app/modules/stock/stock.service.ts (emit calls)

Frontend:
- src/socket/socket-client.js (connection)
- src/socket/useSocket.js (hook)
- src/socket/socket-handlers.js (event listeners)
- src/layouts/DashboardLayout.jsx (socket init)
```

## CURRENT IMPLEMENTATION STATUS:

| Feature | Status | Notes |
|---------|--------|-------|
| Socket Server | ✅ Complete | With JWT auth |
| Stock Events | ✅ Complete | added/deducted/low |
| Invoice Events | ✅ Complete | Created event |
| Collection Events | ✅ Complete | Created event |
| User Events | ✅ Complete | Created event |
| Frontend Client | ✅ Complete | Auto-reconnect |
| Event Handlers | ✅ Complete | Toast notifications |
| Live Indicator | ✅ Complete | Status display |
| Data Refresh | ⚠️ Partial | Custom events dispatched |

## KNOWN LIMITATIONS:

1. **No Automatic Data Refresh**: Components need to listen for custom events to refresh data
2. **No Notification Persistence**: Notifications not stored in database
3. **No Notification Panel**: Redux slice not implemented yet
4. **No Sound**: Notification sounds not added yet

## TO IMPLEMENT NEXT (AFTER DEBUGGING):

1. Fix current issues
2. Add Redux notification slice
3. Create notification panel UI
4. Add data refresh on events
5. Add notification sounds
