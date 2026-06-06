# MAISON OLFACT — Luxury Perfume Store

## Quick Setup

### 1. Install
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` in the root folder:
```
ADMIN_PASS=your-admin-password
CLOUDINARY_CLOUD=your_cloud_name
CLOUDINARY_PRESET=your_upload_preset
GIST_ID=your_gist_id
GITHUB_TOKEN=ghp_your_token
```

### 3. Run locally
```bash
npm run dev
# Store → http://localhost:3000
# Admin → http://localhost:3000/admin
```

### 4. Build
```bash
npm run build
```

---

## Deploy to Cloudflare Pages

1. Push this folder to GitHub
2. Cloudflare Dashboard → Pages → Create Project → Connect GitHub repo
3. Build settings:
   - Framework: **Next.js**
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add Environment Variables in Cloudflare Pages → Settings → Environment variables:
   - `ADMIN_PASS`
   - `CLOUDINARY_CLOUD`
   - `CLOUDINARY_PRESET`
   - `GIST_ID`
   - `GITHUB_TOKEN`

---

## WhatsApp Orders Setup

1. Go to `/admin` → Login → **WhatsApp Orders** tab
2. Enter your phone number with country code (no + or spaces)
   - Example for Iraq: `9647701234567`
3. Customize the order message prefix
4. Click **Save Changes**

Customers can now click **"Order via WhatsApp"** on any product page or cart page and you'll receive the full order details.

---

## Features

| Feature | Details |
|---------|---------|
| Dynamic theme | 3 luxury themes, fully customizable colors |
| Product catalog | Images, variants (size+price+stock), fragrance notes |
| WhatsApp orders | Direct order messages with product details |
| Cart | LocalStorage cart with WhatsApp checkout |
| Admin dashboard | Settings, Themes, Products, Categories, WhatsApp |
| Image uploads | Cloudinary integration |
| Data storage | GitHub Gist as lightweight database |
