/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Creates a transparent version of a white-bg image using a Canvas.
 * Assumes the input is black ink on white paper.
 */
export const createTransparentPNG = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas context error");

      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple luma keying
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > 200) {
          data[i + 3] = 0; // Alpha 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};

/**
 * Adds a designy frame and branding to the image for export.
 */
export const addBrandingToImage = (base64Image: string, isTransparent: boolean = false): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Set a high resolution A4-ish ratio or stick to image aspect but with padding
      // Let's create a padded frame.
      const padding = 100;
      const bottomFooter = 150;
      const width = Math.max(img.width + (padding * 2), 1200);
      const height = Math.max(img.height + (padding * 2) + bottomFooter, 1600);

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas error");

      // Fill Background
      if (!isTransparent) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      } 

      // Draw Outer Frame Border
      if (!isTransparent) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, width - 80, height - 80);
      }

      // Draw Inner Image
      // Center the image within the available area above the footer
      const availableHeight = height - bottomFooter - (padding * 2);
      const scale = Math.min(
        (width - (padding * 2)) / img.width,
        availableHeight / img.height
      );
      
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const drawX = (width - drawWidth) / 2;
      const drawY = padding + (availableHeight - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Add Branding Text (Only if not transparent, or add text in black if transparent)
      // Even for transparent PNGs, we usually want the branding visible.
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      
      // Main Brand
      ctx.font = 'bold 40px "Syne", sans-serif';
      ctx.fillText('EasyInkLab', width / 2, height - 90);

      // Subtitle / URL
      ctx.font = '300 20px "Space Grotesk", sans-serif';
      ctx.fillText('GENERATED STENCIL • SONERKAYA.ART', width / 2, height - 50);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};

/**
 * Triggers a download for a Base64 string
 */
export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Simulates a Print-to-PDF action with branding
 */
export const printImage = (dataUrl: string) => {
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(`
      <html>
        <head>
          <title>EasyInkLab Stencil</title>
          <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Space+Grotesk:wght@300;400&display=swap" rel="stylesheet">
          <style>
            body { 
              margin: 0; 
              display: flex; 
              flex-direction: column;
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              font-family: 'Space Grotesk', sans-serif;
              padding: 40px;
              box-sizing: border-box;
            }
            .frame {
              border: 4px solid black;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 40px;
              box-sizing: border-box;
            }
            .image-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              overflow: hidden;
            }
            img { 
              max-width: 100%; 
              max-height: 100%; 
              object-fit: contain; 
            }
            .footer {
              text-align: center;
              margin-top: 20px;
            }
            .brand {
              font-family: 'Syne', sans-serif;
              font-weight: 700;
              font-size: 24px;
              display: block;
              margin-bottom: 5px;
            }
            .meta {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            @media print { 
              body { display: block; height: auto; } 
              .frame { height: 95vh; page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="frame">
            <div class="image-container">
              <img src="${dataUrl}" />
            </div>
            <div class="footer">
              <span class="brand">EasyInkLab</span>
              <span class="meta">Generated Stencil • sonerkaya.art</span>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  }
};