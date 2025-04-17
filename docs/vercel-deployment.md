# Vercel Deployment Guide for Chatham Smart Map

## Prerequisites
- GitHub account
- Vercel account (free tier)

## Why Vercel?
Vercel offers several advantages for hosting the Chatham Smart Map application:

1. **Free Tier Benefits**:
   - 100GB bandwidth per month
   - Unlimited websites and APIs
   - Serverless functions
   - Global CDN
   - Automatic HTTPS
   - Continuous deployment from Git

2. **Simple Deployment Process**:
   - Direct integration with GitHub
   - Automatic detection of Vue.js projects
   - Zero configuration deployments

3. **Performance**:
   - Global edge network
   - Automatic asset optimization
   - Fast page loads

## Deployment Steps

### 1. Sign up for Vercel
If you don't have a Vercel account:
1. Go to [vercel.com](https://vercel.com)
2. Sign up for a free account (you can use your GitHub account for authentication)

### 2. Import Your GitHub Repository
1. From the Vercel dashboard, click "Add New..." > "Project"
2. Select "Import Git Repository"
3. Connect your GitHub account if not already connected
4. Find and select the "JIB-8352/chatham_smart_map" repository

### 3. Configure Project Settings
1. In the configuration screen:
   - Framework Preset: Vue.js
   - Root Directory: ./
   - Build Command: `yarn build`
   - Output Directory: dist
   - Install Command: `yarn install`

2. Environment Variables (optional):
   - You can add any environment variables your application needs

3. Click "Deploy"

### 4. Wait for Deployment
Vercel will build and deploy your application. This usually takes 1-2 minutes.

### 5. Access Your Deployed Application
Once deployment is complete, Vercel will provide you with:
- A production URL (e.g., chatham-smart-map.vercel.app)
- A dashboard to monitor your application

### 6. Custom Domain (Optional)
If you want to use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain and follow the instructions

## Automatic Deployments
By default, Vercel will automatically deploy:
- Production deployments when you push to the main branch
- Preview deployments when you create pull requests

You can customize this behavior in the project settings.

## Troubleshooting

### Build Failures
If your build fails:
1. Check the build logs in the Vercel dashboard
2. Ensure your Node.js version is compatible (Vercel supports Node.js 14.x, 16.x, 18.x, and 20.x)
3. Verify that all dependencies are correctly specified in package.json

### Runtime Errors
If your application deploys but doesn't work correctly:
1. Check the Function Logs in the Vercel dashboard
2. Verify that all environment variables are correctly set
3. Test locally with the same environment variables

## Limitations of Free Tier
- 100GB bandwidth per month
- Limited build minutes (400 per month)
- Basic analytics

## Additional Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Vue.js on Vercel](https://vercel.com/guides/deploying-vuejs-to-vercel)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
