# Quick Demo Setup Guide

For sharing your app with your manager, here are your options:

## Option 1: Use Ngrok (Easiest for Quick Demo - 5 minutes)

This allows you to create a public URL for your locally running app.

### Setup Steps:

1. **Install ngrok:**
   ```bash
   brew install ngrok
   # OR download from https://ngrok.com/download
   ```

2. **Sign up for free ngrok account:**
   - Go to https://ngrok.com/signup
   - Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken
   - Run: `ngrok config add-authtoken YOUR_TOKEN`

3. **Start your application locally (without Docker):**
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm start

   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

4. **Create ngrok tunnels:**

   **Terminal 3 - Tunnel for backend:**
   ```bash
   ngrok http 3000
   ```
   Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

   **Terminal 4 - Update frontend API URL:**
   - Stop the frontend (Ctrl+C in Terminal 2)
   - Update `frontend/src/lib/api.js`:
     ```javascript
     const API_BASE_URL = 'https://YOUR-BACKEND-NGROK-URL';
     ```
   - Restart frontend: `npm run dev`

   **Terminal 5 - Tunnel for frontend:**
   ```bash
   ngrok http 5173
   ```
   Copy the HTTPS URL (e.g., `https://xyz789.ngrok.io`)

5. **Share the frontend URL** with your manager!

### Limitations:
- Free ngrok URLs expire when you close the terminal
- URLs change each time you restart ngrok
- Connection can be slower than a real server

---

## Option 2: Deploy to Render.com (Free - 15 minutes)

This gives you permanent URLs and is completely free.

### Setup Steps:

1. **Push your code to GitHub** (if not already there)

2. **Sign up on Render.com:** https://render.com/

3. **Deploy Backend:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Name: `3c-demo-backend`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Free instance type
   - Click "Create Web Service"
   - Copy the backend URL (e.g., `https://3c-demo-backend.onrender.com`)

4. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repo
   - Settings:
     - Name: `3c-demo-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - **Add Environment Variable:**
     - Key: `VITE_API_URL`
     - Value: Your backend URL from step 3
   - Click "Create Static Site"

5. **Access your app** at the frontend URL Render provides!
   - Share this URL with your manager

### Benefits:
- Permanent URLs
- Automatic HTTPS
- Free tier available
- Auto-deploys on git push

---

## Option 3: Deploy with Docker to DigitalOcean (Fastest Paid Option - $6/month)

### Setup Steps:

1. **Create a DigitalOcean account:** https://www.digitalocean.com/

2. **Create a Droplet:**
   - Ubuntu 22.04
   - Basic plan ($6/month)
   - Choose a datacenter region
   - Add your SSH key

3. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

4. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

5. **Install Docker Compose:**
   ```bash
   apt install docker-compose
   ```

6. **Copy your project to the server:**
   ```bash
   # On your local machine
   scp -r /Users/dmytrooliinyk/Documents/Mugco/MoveToWeb/3C/3C-Demo root@your-server-ip:/root/
   ```

7. **On the server, update docker-compose.yml:**
   ```bash
   cd /root/3C-Demo
   nano docker-compose.yml
   ```
   Change the VITE_API_URL to: `http://your-server-ip:3000`

8. **Run Docker Compose:**
   ```bash
   docker-compose up -d
   ```

9. **Access your app:**
   - Frontend: `http://your-server-ip`
   - Backend: `http://your-server-ip:3000`
   - Share the IP with your manager!

10. **Optional - Add a domain name:**
    - Buy a domain (e.g., from Namecheap)
    - Point it to your server IP
    - Access via: `http://yourdomain.com`

---

## My Recommendation for Your Demo:

**For a quick demo today:** Use **Option 1 (Ngrok)**
- Takes 5 minutes
- Free
- Works immediately

**For a professional demo:** Use **Option 2 (Render.com)**
- Takes 15 minutes
- Free
- Gives permanent URLs
- Looks more professional

**For production:** Use **Option 3 (DigitalOcean + Docker)**
- $6/month
- Full control
- Can add custom domain

Let me know which option you want to use and I can help you set it up!
