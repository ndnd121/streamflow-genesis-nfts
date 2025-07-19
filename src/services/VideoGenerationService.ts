export interface VideoGenerationOptions {
  prompt: string;
  style: string;
  duration: number;
  width?: number;
  height?: number;
}

class VideoGenerationService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;

  constructor() {
    // Create offscreen canvas for video generation
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  private async generateVideoFrames(options: VideoGenerationOptions, onProgress?: (step: number, progress: number) => void): Promise<Blob> {
    const { prompt, style, duration, width = 512, height = 512 } = options;
    
    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Create video stream from canvas
    const stream = this.canvas.captureStream(30); // 30 FPS
    const chunks: Blob[] = [];
    
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    return new Promise((resolve, reject) => {
      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      this.mediaRecorder!.onerror = (event) => {
        reject(new Error('MediaRecorder error'));
      };

      // Start recording
      this.mediaRecorder!.start();

      // Generate animated content based on prompt and style
      this.animateCanvas(prompt, style, duration, onProgress);
    });
  }

  private animateCanvas(prompt: string, style: string, duration: number, onProgress?: (step: number, progress: number) => void) {
    const fps = 30;
    const totalFrames = duration * fps;
    let currentFrame = 0;
    
    const animate = () => {
      if (currentFrame >= totalFrames) {
        this.mediaRecorder?.stop();
        return;
      }

      // Clear canvas
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Generate content based on prompt and style
      this.renderFrame(currentFrame, totalFrames, prompt, style);

      // Update progress
      if (onProgress) {
        const progress = (currentFrame / totalFrames) * 100;
        onProgress(2, progress);
      }

      currentFrame++;
      
      // Continue animation
      requestAnimationFrame(animate);
    };

    animate();
  }

  private renderFrame(frame: number, totalFrames: number, prompt: string, style: string) {
    const time = frame / totalFrames;
    const { width, height } = this.canvas;

    // Create animated background
    const gradient = this.ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    // Style-based color schemes
    if (style === 'realistic') {
      gradient.addColorStop(0, `hsl(${220 + time * 60}, 70%, ${30 + time * 20}%)`);
      gradient.addColorStop(1, `hsl(${240 + time * 40}, 80%, ${10 + time * 15}%)`);
    } else if (style === 'cartoon') {
      gradient.addColorStop(0, `hsl(${time * 360}, 80%, 60%)`);
      gradient.addColorStop(1, `hsl(${(time * 360 + 180) % 360}, 70%, 40%)`);
    } else {
      gradient.addColorStop(0, `hsl(${280 + time * 80}, 60%, 40%)`);
      gradient.addColorStop(1, `hsl(${320 + time * 60}, 70%, 20%)`);
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add animated elements based on prompt
    this.ctx.save();
    this.ctx.translate(width / 2, height / 2);
    
    // Create pulsing effect
    const scale = 0.8 + 0.3 * Math.sin(time * Math.PI * 4);
    this.ctx.scale(scale, scale);

    // Draw animated shapes
    this.ctx.fillStyle = `hsla(${time * 360}, 70%, 70%, 0.8)`;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 60, 0, Math.PI * 2);
    this.ctx.fill();

    // Add rotating elements
    this.ctx.rotate(time * Math.PI * 2);
    for (let i = 0; i < 6; i++) {
      this.ctx.save();
      this.ctx.rotate((i / 6) * Math.PI * 2);
      this.ctx.fillStyle = `hsla(${(time * 360 + i * 60) % 360}, 80%, 60%, 0.6)`;
      this.ctx.fillRect(80, -10, 40, 20);
      this.ctx.restore();
    }

    this.ctx.restore();

    // Add prompt text overlay
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''), width / 2, height - 30);
  }

  async generateVideo(options: VideoGenerationOptions, onProgress?: (step: number, progress: number) => void): Promise<string> {
    try {
      // Step 1: Initialize
      if (onProgress) onProgress(1, 0);
      
      // Step 2: Generate video
      if (onProgress) onProgress(2, 0);
      const videoBlob = await this.generateVideoFrames(options, onProgress);
      
      // Step 3: Create URL
      if (onProgress) onProgress(3, 100);
      const videoUrl = URL.createObjectURL(videoBlob);
      
      return videoUrl;
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  // Clean up resources
  dispose() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
  }
}

export default new VideoGenerationService();