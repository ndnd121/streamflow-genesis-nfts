import { pipeline, env } from '@huggingface/transformers';
import { FFmpeg } from '@ffmpeg/ffmpeg';

// Configure transformers.js for WebGPU
env.allowLocalModels = false;
env.useBrowserCache = false;

export interface VideoGenerationOptions {
  prompt: string;
  style: string;
  duration: number;
  width?: number;
  height?: number;
}

class VideoGenerationService {
  private ffmpeg: FFmpeg | null = null;
  private imageGenerator: any = null;

  private async initializeImageGenerator() {
    if (!this.imageGenerator) {
      console.log('Initializing image generation pipeline...');
      this.imageGenerator = await pipeline('text-generation', 'stabilityai/stable-diffusion-2', {
        task: 'text-to-image',
        device: 'webgpu',
      });
    }
    return this.imageGenerator;
  }

  private async initializeFFmpeg() {
    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
      await this.ffmpeg.load();
    }
    return this.ffmpeg;
  }

  async generateFrames(
    prompt: string, 
    style: string, 
    numberOfFrames: number = 24,
    onProgress?: (frameIndex: number) => void
  ): Promise<string[]> {
    try {
      const generator = await this.initializeImageGenerator();
      console.log('Generating frames...');
      
      const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed`;
      const frameUrls: string[] = [];

      for (let i = 0; i < numberOfFrames; i++) {
        const progress = ((i + 1) / numberOfFrames) * 100;
        console.log(`Generating frame ${i + 1}/${numberOfFrames} (${progress.toFixed(1)}%)`);
        
        const framePrompt = `${enhancedPrompt}, frame ${i + 1} of ${numberOfFrames}`;
        const image = await generator(framePrompt);
        
        if (image instanceof Blob) {
          frameUrls.push(URL.createObjectURL(image));
        }
        
        if (onProgress) {
          onProgress(i);
        }
      }

      return frameUrls;
    } catch (error) {
      console.error('Error generating frames:', error);
      throw error;
    }
  }

  async combineFramesToVideo(frameUrls: string[], fps: number = 24): Promise<string> {
    try {
      console.log('Initializing FFmpeg...');
      const ffmpeg = await this.initializeFFmpeg();
      
      console.log('Writing frames to virtual filesystem...');
      for (let i = 0; i < frameUrls.length; i++) {
        const response = await fetch(frameUrls[i]);
        const frameData = await response.arrayBuffer();
        await ffmpeg.writeFile(`frame${i.toString().padStart(4, '0')}.png`, new Uint8Array(frameData));
      }

      console.log('Combining frames into video...');
      await ffmpeg.exec([
        '-framerate', fps.toString(),
        '-pattern_type', 'glob',
        '-i', 'frame*.png',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        'output.mp4'
      ]);

      console.log('Reading generated video...');
      const data = await ffmpeg.readFile('output.mp4');
      const videoBlob = new Blob([data], { type: 'video/mp4' });
      return URL.createObjectURL(videoBlob);
    } catch (error) {
      console.error('Error combining frames:', error);
      throw error;
    }
  }

  async generateVideo(options: VideoGenerationOptions, onProgress?: (step: number, progress: number) => void): Promise<string> {
    const {
      prompt,
      style,
      duration,
      width = 1024,
      height = 576
    } = options;

    try {
      // Calculate number of frames based on duration
      const fps = 24;
      const numberOfFrames = Math.min(Math.max(duration * fps, 14), 120);

      // Generate frames with progress updates
      const frameUrls = await this.generateFrames(prompt, style, numberOfFrames, 
        (frameIndex) => {
          if (onProgress) {
            const progress = ((frameIndex + 1) / numberOfFrames) * 100;
            onProgress(2, progress);
          }
        }
      );

      // Update progress for video encoding
      if (onProgress) {
        onProgress(3, 50);
      }

      // Combine frames into video
      const videoUrl = await this.combineFramesToVideo(frameUrls, fps);

      // Cleanup frame URLs
      frameUrls.forEach(URL.revokeObjectURL);

      // Final progress update
      if (onProgress) {
        onProgress(4, 100);
      }

      return videoUrl;
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }
}

export default new VideoGenerationService();