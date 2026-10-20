SMART, CREATION AND CHALLENGES — DEPLOYMENT NOTES

Files:
- index.html: all three tools on one page
- netlify/functions/create-link.js: stores a page and returns a short URL
- netlify/functions/get-link.js: loads a shared page from the short URL
- netlify.toml and package.json: Netlify build configuration

DEPLOY:
1. Keep your old website untouched. Create a NEW Netlify site for this project.
2. Upload/deploy this whole folder as a project (not just index.html).
3. Netlify should install the dependency from package.json and deploy both functions.
4. Open the new site's URL and test Birthday QR, Social QR, and Custom Website QR.
5. Scan each QR using another phone or camera before sharing.

The QR points to a compact URL like /?p=0123abcdef. The full text is stored in Netlify Blobs, so long birthday messages don't have to be encoded into the QR itself.
This requires a deployed Netlify site and working Netlify Blobs support. Opening index.html directly from the phone's file manager will not enable short-link saving.
Social/contact data that you enter and share is public to anyone with the link. Avoid publishing private phone numbers or email addresses.
